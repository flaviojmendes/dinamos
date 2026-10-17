import * as T from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { SVGRenderer } from 'three/addons/renderers/SVGRenderer.js';
import type { LessonVisual } from './visualModel';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import type { SceneMode, Station } from './learningModel';
import { makeRestaurantObject, restaurantPropNames } from './restaurantObjects';
import type { RestaurantProp } from './visualModel';
import { getRestaurantBeat, type RestaurantBeat } from './restaurantChoreography';

type Position = [number, number, number];
export interface WorldState {
  mode: SceneMode; focus: Station; step: 0 | 1 | 2; level: number;
  visual?: LessonVisual;
  locale?: 'pt' | 'en';
  playing: boolean; reducedMotion: boolean; onStepComplete?: () => void;
}
export interface RestaurantWorld {
  backend: 'webgl' | 'svg';
  update: (state: WorldState) => void;
  rotate: (direction: number) => void;
  zoom: () => void;
  dispose: () => void;
}
const P = {
  stone: '#eeeae5', edge: '#b2c6c0', wall: '#e3d7cb', navy: '#303a50', pink: '#eb568b',
  rose: '#f2a2b8', mint: '#84cbb5', darkMint: '#3c8c7a', wood: '#b8845d', steel: '#c0c9cc',
  ink: '#202a38', white: '#fffcf4', gold: '#efb95e', red: '#e16c66', green: '#78bd96',
};
const positions: Record<Station, Position> = {
  entrance: [-1.9, 1.1, 3.7], counter: [-.7, 1.25, 1], kitchen: [1.95, 1.12, -1.3],
  pickup: [2.5, 1.1, 1], stock: [-3.6, 1.1, -1.3], branch: [5.25, 1, .45],
  dispatch: [2.65, .85, 4.55], terminal: [3.45, 1.1, -2.55],
};
const levels: Record<Station, number> = { entrance: 1, counter: 1, kitchen: 2, stock: 3, pickup: 3, dispatch: 4, branch: 5, terminal: 6 };
const specialStation: Partial<Record<SceneMode, Station>> = {
  cache: 'pickup', storage: 'stock', replication: 'branch', consensus: 'branch', network: 'branch',
  ai: 'terminal', delivery: 'dispatch', observability: 'terminal',
};

/** A small, texture-free game world. Static shadows are cached; paused scenes render on demand. */
export function createRestaurantWorld(host: HTMLElement, initial: WorldState & { onUnavailable: () => void }): RestaurantWorld {
  let state: WorldState = initial;
  let disposed = false;
  let clock = 0;
  let stepTime = 0;
  let previousTime = 0;
  let reported = false;
  let expandedWorkers = false;
  let buildUntil = 0;
  const scene = new T.Scene();
  const camera = new T.OrthographicCamera(-10, 10, 7, -7, .1, 100);
  camera.position.set(14, 15, 18);
  const webglCanvas = document.createElement('canvas');
  let renderer: T.WebGLRenderer | SVGRenderer;
  let gpu: T.WebGLRenderer | null = null;
  try {
    const context = webglCanvas.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'low-power' });
    if (!context) throw new Error('WebGL unavailable');
    gpu = new T.WebGLRenderer({ canvas: webglCanvas, context, alpha: true, antialias: true });
    gpu.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    gpu.outputColorSpace = T.SRGBColorSpace;
    gpu.toneMapping = T.ACESFilmicToneMapping;
    gpu.toneMappingExposure = 1.12;
    gpu.shadowMap.enabled = true;
    gpu.shadowMap.type = T.PCFSoftShadowMap;
    gpu.shadowMap.autoUpdate = false;
    gpu.setClearColor(0x000000, 0);
    renderer = gpu;
  } catch {
    // The same Three.js scene remains usable on devices without a GPU context.
    const vectorRenderer = new SVGRenderer();
    vectorRenderer.setQuality('high');
    vectorRenderer.setPrecision(2);
    renderer = vectorRenderer;
  }
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.width = '100%'; canvas.style.height = '100%'; canvas.style.display = 'block';
  host.appendChild(canvas);
  const previousHostPosition = host.style.position;
  const positionHost = getComputedStyle(host).position === 'static';
  if (positionHost) host.style.position = 'relative';
  let vectorFrame = 0;
  const setLoop = (callback: ((time: number) => void) | null) => {
    if (gpu) { gpu.setAnimationLoop(callback); return; }
    cancelAnimationFrame(vectorFrame);
    if (!callback) return;
    let last = 0;
    const tick = (time: number) => {
      if (disposed) return;
      vectorFrame = requestAnimationFrame(tick);
      if (time - last < 80) return;
      last = time; callback(time);
    };
    vectorFrame = requestAnimationFrame(tick);
  };
  const controls = new OrbitControls(camera, canvas as HTMLElement);
  controls.target.set(.1, .6, .25);
  controls.enablePan = false; controls.enableZoom = false; controls.enableDamping = false;
  controls.minPolarAngle = .4; controls.maxPolarAngle = 1.12;
  controls.minAzimuthAngle = -.1; controls.maxAzimuthAngle = 1.45;
  controls.rotateSpeed = .6;
  canvas.style.touchAction = 'pan-y';
  controls.update();

  const geometries = new Set<T.BufferGeometry>();
  const materials = new Set<T.Material>();
  const cached = new Map<string, T.MeshStandardMaterial>();
  const rounded = new Map<string, T.BufferGeometry>();
  const material = (color: string, metalness = 0) => {
    const key = `${color}:${metalness}`;
    if (!cached.has(key)) {
      const m = new T.MeshStandardMaterial({ color, roughness: metalness ? .4 : .82, metalness });
      cached.set(key, m); materials.add(m);
    }
    return cached.get(key)!;
  };
  function mesh(parent: T.Object3D, geometry: T.BufferGeometry, color: string, at: Position, metallic = false) {
    geometries.add(geometry);
    const object = new T.Mesh(geometry, material(color, metallic ? .45 : 0));
    object.position.set(...at); object.castShadow = true; object.receiveShadow = true;
    parent.add(object); return object;
  }
  function box(parent: T.Object3D, size: Position, at: Position, color: string, radius = .04) {
    const key = `${size.join(',')}:${radius}`;
    if (!rounded.has(key)) rounded.set(key, radius >= .025 && Math.min(...size) > .08 ? new RoundedBoxGeometry(...size, 1, Math.min(radius, ...size.map(v => v / 3))) : new T.BoxGeometry(...size));
    return mesh(parent, rounded.get(key)!, color, at);
  }
  const sphere = (parent: T.Object3D, radius: number, at: Position, color: string) => mesh(parent, new T.SphereGeometry(radius, 12, 8), color, at);
  function cylinder(parent: T.Object3D, top: number, bottom: number, height: number, at: Position, color: string, segments = 16) {
    return mesh(parent, new T.CylinderGeometry(top, bottom, height, segments), color, at);
  }
  function group(parent: T.Object3D = scene, at: Position = [0, 0, 0]) {
    const object = new T.Group(); object.position.set(...at); parent.add(object); return object;
  }
  const craft = { group, box, sphere, cylinder };
  const restaurantObject = (parent: T.Object3D, kind: RestaurantProp, at: Position, scale = 1) => {
    const object = makeRestaurantObject(craft, parent, kind);
    object.position.set(...at); object.scale.setScalar(scale); return object;
  };
  const ambient = new T.HemisphereLight('#fff3de', '#a7bad5', 2.5); scene.add(ambient);
  const sunlight = new T.DirectionalLight('#fff5df', 4);
  sunlight.position.set(-6, 12, 9); sunlight.castShadow = true;
  sunlight.shadow.mapSize.set(1024, 1024);
  Object.assign(sunlight.shadow.camera, { left: -10, right: 10, top: 9, bottom: -9, near: 1, far: 35 });
  sunlight.shadow.normalBias = .04; sunlight.shadow.bias = -.0002;
  scene.add(sunlight);
  const fill = new T.DirectionalLight('#c9e4ff', 1.4); fill.position.set(7, 5, -5); scene.add(fill);
  if (!gpu) { sunlight.intensity = .48; fill.intensity = .16; scene.add(new T.AmbientLight('#e8eef3', .3)); }

  const island = group();
  box(island, [13, .42, 11], [0, -.35, .5], P.edge, .18);
  box(island, [12.9, .18, 10.9], [0, -.08, .5], P.stone, .12);
  // The floor grid belongs to the miniature, rather than the surrounding reading surface.
  for (let x = -4; x <= 4; x += 1) for (let z = -3; z <= 3; z += 1) {
    box(island, [.985, .014, .985], [x, .02, z], (x + z) % 2 ? '#e7e3de' : '#f3f0e9', .005).castShadow = false;
  }
  // Sidewalk, road and delivery parking outside the cutaway.
  box(island, [10.7, .025, 1.12], [.1, .03, 4.5], '#b9c3c4', .02);
  for (let x = -4; x < 5; x += 1.35) box(island, [.62, .015, .07], [x, .054, 4.5], P.white, .012).castShadow = false;
  const walls = group();
  box(walls, [9.3, 2.6, .17], [0, 1.3, -3.55], P.wall, .055);
  box(walls, [.17, 2.6, 7.2], [-4.55, 1.3, -.05], P.wall, .055);
  box(walls, [9.35, .16, .22], [0, 2.64, -3.55], P.navy);
  box(walls, [.22, .16, 7.2], [-4.55, 2.64, -.05], P.navy);
  box(walls, [9.1, .54, .05], [0, .3, -3.43], P.mint);
  box(walls, [.05, .54, 7.1], [-4.43, .3, -.05], P.mint);
  // Framed menu: physical detail only. Teaching labels remain accessible HTML.
  box(walls, [2, 1.12, .09], [1.1, 1.72, -3.4], P.navy);
  for (let row = 0; row < 4; row++) {
    box(walls, [1.12 - row * .12, .045, .018], [.9, 2.02 - row * .19, -3.34], row === 0 ? P.rose : '#c6d0d0', .006);
    box(walls, [.19, .045, .018], [1.84, 2.02 - row * .19, -3.34], P.gold, .006);
  }
  // A tiny burger sign anchors the same business as it expands.
  const sign = group(walls, [-2.55, 2.15, -3.32]);
  const signPlate = cylinder(sign, .46, .46, .07, [0, 0, 0], P.pink, 32); signPlate.rotation.x = Math.PI / 2;
  const signBun = sphere(sign, .27, [0, .06, .08], P.gold); signBun.scale.set(1, .6, .4);
  box(sign, [.51, .065, .08], [0, -.03, .13], '#6c493a');
  box(sign, [.54, .05, .09], [0, -.08, .14], P.green);
  box(sign, [.5, .08, .08], [0, -.14, .13], P.gold);
  // The vector renderer uses painter ordering, not a depth buffer. Large floor
  // triangles must stay behind furniture and people instead of cutting across them.
  island.traverse(object => { object.renderOrder = -20; });
  walls.traverse(object => { object.renderOrder = -10; });

  const stationGroups = {} as Record<Station, T.Group>;
  for (const station of Object.keys(positions) as Station[]) stationGroups[station] = group();
  // Counter, register, pickup ledge and drinks.
  const counter = stationGroups.counter;
  box(counter, [4.5, 1, .85], [-.7, .52, 1.12], P.rose, .08);
  box(counter, [4.66, .14, 1.03], [-.7, 1.08, 1.1], P.wood, .07);
  box(counter, [4.28, .07, .04], [-.7, .87, 1.57], P.white, .01);
  for (const x of [-2.4, -1.2, 0, 1]) box(counter, [.035, .68, .025], [x, .48, 1.565], '#cf718b', .004);
  box(counter, [.16, .3, .14], [-1.9, 1.25, 1.02], P.navy);
  const pos = box(counter, [.56, .38, .09], [-1.9, 1.48, 1.01], P.ink); pos.rotation.x = -.22;
  box(counter, [.45, .27, .018], [-1.9, 1.49, 1.075], P.mint, .018).rotation.x = -.22;
  cylinder(counter, .1, .075, .25, [.92, 1.28, 1.12], P.white);
  box(counter, [.026, .24, .026], [.92, 1.48, 1.12], P.red, .004);
  const entrance = stationGroups.entrance;
  box(entrance, [1.4, .03, .72], [-1.9, .065, 3.25], P.pink, .06);
  // Small queue stanchions show the relationship between customers and incoming requests.
  for (const x of [-2.8, -.95]) {
    cylinder(entrance, .16, .2, .08, [x, .09, 3.2], P.navy);
    cylinder(entrance, .035, .035, .74, [x, .48, 3.2], P.steel);
    sphere(entrance, .07, [x, .87, 3.2], P.gold);
  }
  for (const x of [.45, 1.25]) {
    cylinder(counter, .22, .22, .1, [x, .58, 2.1], P.pink);
    for (const dx of [-.12, .12]) box(counter, [.045, .52, .045], [x + dx, .29, 2.1], P.navy, .01);
  }

  const burners: T.Mesh[] = [];
  const grills: T.Group[] = [];
  function grill(parent: T.Group, x: number, z: number) {
    const g = group(parent, [x, 0, z]);
    box(g, [1.3, .95, 1], [0, .5, 0], P.steel, .06);
    box(g, [1.4, .09, 1.07], [0, 1.01, 0], P.ink);
    for (const sx of [-.34, .34]) for (const sz of [-.25, .25]) {
      const burner = cylinder(g, .2, .2, .025, [sx, 1.07, sz], '#555360'); burners.push(burner);
      const ring = mesh(g, new T.TorusGeometry(.145, .02, 4, 16), P.gold, [sx, 1.1, sz]); ring.rotation.x = Math.PI / 2;
    }
    for (const sx of [-.36, 0, .36]) cylinder(g, .06, .06, .05, [sx, .85, .525], P.navy).rotation.x = Math.PI / 2;
    box(g, [.96, .035, .04], [0, .63, .53], P.navy);
    grills.push(g); return g;
  }
  const baseGrill = grill(counter, -.65, -2.2);
  grill(stationGroups.kitchen, -2.2, -2.2);
  grill(stationGroups.kitchen, .92, -2.2);
  box(stationGroups.kitchen, [4.6, .38, 1.12], [-.65, 2.28, -2.3], P.steel, .1);
  box(stationGroups.kitchen, [3.9, .035, .6], [-.65, 2.06, -2.22], '#ffe5b1', .02);
  box(stationGroups.kitchen, [1.3, .1, .7], [1.95, 1.04, -1.3], P.wood, .025);
  for (const x of [1.4, 2.5]) box(stationGroups.kitchen, [.055, 1, .055], [x, .52, -1.3], P.steel, .01);
  for (const x of [-2.4, -.65, 1.1]) box(stationGroups.kitchen, [.055, .64, .055], [x, 1.7, -3.32], P.steel);

  function burger(parent: T.Group, at: Position, scale = 1) {
    const g = group(parent, at); g.scale.setScalar(scale);
    cylinder(g, .22, .24, .09, [0, .05, 0], P.gold);
    cylinder(g, .25, .23, .05, [0, .12, 0], P.green);
    cylinder(g, .235, .235, .075, [0, .17, 0], '#694538');
    box(g, [.4, .026, .4], [0, .22, 0], '#f3c45d', .016).rotation.y = .3;
    const bun = sphere(g, .24, [0, .25, 0], P.gold); bun.scale.y = .57;
    for (const [x, z] of [[-.08, -.06], [.1, -.04], [0, .1]]) sphere(g, .018, [x, .375, z], P.white).scale.set(1, .4, .5);
    return g;
  }
  const cookingBurger = burger(baseGrill, [.25, 1.09, .15], .8);
  const pickup = stationGroups.pickup;
  box(pickup, [1.65, .85, .83], [2.55, .47, 1.15], P.mint, .065);
  box(pickup, [1.8, .11, .94], [2.55, .96, 1.15], P.white);
  box(pickup, [1.65, .07, .72], [2.55, 1.61, 1.07], P.wood);
  for (const x of [1.84, 3.25]) box(pickup, [.055, .67, .055], [x, 1.3, 1.07], P.navy);
  // Prepared food only belongs to preparation and pickup, never to a cache lesson.
  const pickupBurgers = [burger(pickup, [2.12, 1.03, 1.1], .75), burger(pickup, [2.7, 1.03, 1.1], .75)];
  for (const x of [2.05, 2.65, 3.1]) {
    box(pickup, [.27, .45, .19], [x, 1.88, 1.12], x < 2.4 ? P.rose : '#c7af8e', .025);
    box(pickup, [.1, .07, .022], [x, 1.89, 1.23], P.white, .009);
  }
  const stock = stationGroups.stock;
  box(stock, [1.1, 1.87, .85], [-3.72, .96, -2.6], '#a9bdc0', .065);
  box(stock, [.94, 1.69, .05], [-3.72, 1, -2.15], P.white);
  box(stock, [.05, .64, .045], [-3.36, 1.25, -2.11], P.steel);
  for (const x of [-4.25, -3.25]) box(stock, [.055, 1.7, .055], [x, .88, -.54], P.navy);
  for (const y of [.15, .7, 1.25, 1.75]) box(stock, [1.1, .06, .7], [-3.75, y, -.54], P.wood);
  for (let i = 0; i < 6; i++) box(stock, [.27, .33, .35], [-4.02 + (i % 3) * .29, .88 + Math.floor(i / 3) * .53, -.5], i % 2 ? P.mint : '#d9bc90', .018);
  box(stock, [1.15, .08, .75], [-3.6, 1.03, -1.3], P.wood, .025);
  for (const x of [-4.04, -3.17]) box(stock, [.055, .98, .055], [x, .51, -1.3], P.navy, .01);

  restaurantObject(pickup, 'menu', [2.95, 1.3, 1.15], .62);

  function plant(parent: T.Group, x: number, z: number) {
    const g = group(parent, [x, 0, z]);
    cylinder(g, .25, .18, .4, [0, .23, 0], '#d29172');
    cylinder(g, .23, .23, .04, [0, .44, 0], '#6f5a43');
    for (let i = 0; i < 7; i++) {
      const angle = i * 2.4;
      const leaf = sphere(g, .2, [Math.cos(angle) * .15, .64 + (i % 3) * .13, Math.sin(angle) * .15], i % 2 ? '#70a68e' : '#427963');
      leaf.scale.set(.6, 1.7, .5); leaf.rotation.z = Math.cos(angle) * .45;
    }
  }
  const dining = group();
  for (const [x, z] of [[3.1, 2.75], [3.2, -.05]]) {
    cylinder(dining, .08, .14, .8, [x, .45, z], P.navy);
    cylinder(dining, .65, .65, .1, [x, .91, z], P.wood, 32);
    for (const sx of [-.88, .88]) {
      cylinder(dining, .24, .24, .1, [x + sx, .55, z], P.pink);
      for (const dx of [-.12, .12]) box(dining, [.055, .5, .055], [x + sx + dx, .27, z], P.navy);
    }
    cylinder(dining, .07, .045, .16, [x, 1.05, z], P.white);
  }
  plant(dining, -4.05, 2.65); plant(dining, 4.1, -2.5);

  const dispatch = stationGroups.dispatch;
  const scooter = group(dispatch, [3.1, .23, 4.55]);
  for (const x of [-.55, .55]) {
    const tire = cylinder(scooter, .25, .25, .15, [x, .05, 0], P.ink); tire.rotation.x = Math.PI / 2;
    const hub = cylinder(scooter, .13, .13, .16, [x, .05, 0], P.steel); hub.rotation.x = Math.PI / 2;
  }
  box(scooter, [1.16, .18, .36], [0, .28, 0], P.mint, .08);
  box(scooter, [.48, .18, .36], [-.12, .55, 0], P.navy, .06);
  box(scooter, [.12, .82, .16], [.42, .57, 0], P.mint, .035).rotation.z = -.2;
  box(scooter, [.52, .055, .055], [.55, 1.02, 0], P.navy);
  box(scooter, [.53, .55, .5], [-.48, .72, 0], P.pink, .06);
  box(scooter, [.33, .1, .018], [-.48, .76, .26], P.white, .012);

  const branch = stationGroups.branch;
  const replicas: T.Group[] = [];
  const branchDocuments: T.Group[] = [];
  for (let i = 0; i < 3; i++) {
    const g = group(branch, [5.25, 0, -2.65 + i * 2.05]); replicas.push(g);
    box(g, [1.35, .1, 1.5], [0, .1, 0], '#c6d4c8', .06);
    box(g, [1.2, 1.75, .07], [0, .95, -.56], '#ddc9af', .025);
    for (const x of [-.61, .61]) box(g, [.07, 1.8, .07], [x, 1, .57], P.wood, .02);
    box(g, [1.45, .12, 1.4], [0, 1.95, .05], P.pink, .035);
    for (let stripe = 0; stripe < 5; stripe++) box(g, [.13, .025, 1.41], [-.56 + stripe * .28, 2.025, .05], P.white, .007);
    box(g, [1.28, .12, .7], [0, .9, .85], P.wood, .035);
    box(g, [1.18, .65, .1], [0, .54, 1.1], P.rose, .025);
    box(g, [.55, .11, .35], [0, .72, -.22], P.ink, .025);
    burger(g, [.22, .79, -.2], .6);
    burger(g, [-.22, .98, .95], .55);
    restaurantObject(g, 'menu', [-.38, 1.16, .42], .45);
    branchDocuments.push(restaurantObject(g, 'ledger', [.12, 1, .95], .5));
  }
  const terminal = stationGroups.terminal;
  box(terminal, [1.15, .1, .75], [3.25, .94, -2.5], P.wood);
  for (const x of [2.8, 3.7]) box(terminal, [.055, .9, .055], [x, .48, -2.5], P.navy);
  restaurantObject(terminal, 'recipe', [3.03, 1.04, -2.4], .7);
  restaurantObject(terminal, 'ledger', [3.56, 1.04, -2.4], .6);
  restaurantObject(terminal, 'clock', [3.62, 1.25, -2.72], .55);
  box(terminal, [1.1, .75, .07], [3.25, 1.95, -3.39], '#9d7750', .03);
  restaurantObject(terminal, 'checklist', [3.25, 1.94, -3.33], .72);
  // A chair and a supplier's telephone make this a restaurant manager's desk.
  cylinder(terminal, .23, .27, .1, [3.25, .57, -1.77], P.pink);
  box(terminal, [.45, .38, .06], [3.25, .85, -1.55], P.rose, .035);
  for (const x of [3.1, 3.4]) box(terminal, [.045, .5, .045], [x, .3, -1.77], P.navy, .01);
  box(terminal, [.28, .07, .22], [2.95, 1.05, -2.62], P.ink, .025);
  box(terminal, [.33, .065, .09], [2.95, 1.12, -2.62], P.rose, .025);

  function person(parent: T.Object3D, at: Position, color: string, chef = false, skin = '#d6a184') {
    const g = group(parent, at);
    const torso = cylinder(g, .19, .23, .52, [0, .79, 0], color);
    torso.castShadow = false;
    box(g, [.29, .39, .08], [0, .72, .18], chef ? P.rose : color, .045);
    const legs: T.Object3D[] = [];
    for (const x of [-.1, .1]) {
      const leg = box(g, [.13, .4, .14], [x, .29, 0], P.navy, .045); legs.push(leg);
      box(g, [.16, .09, .25], [x, .07, .06], P.ink, .04);
    }
    sphere(g, .22, [0, 1.23, 0], skin);
    if (chef) {
      cylinder(g, .24, .21, .11, [0, 1.43, 0], P.white);
      for (const x of [-.13, 0, .13]) sphere(g, .15, [x, 1.52, 0], P.white);
    } else {
      const hair = sphere(g, .23, [0, 1.3, -.015], '#5a4139'); hair.scale.y = .5;
    }
    for (const x of [-.075, .075]) sphere(g, .018, [x, 1.24, .204], P.ink);
    const arms: T.Group[] = [];
    for (const x of [-.26, .26]) {
      const arm = group(g, [x, .96, 0]);
      cylinder(arm, .065, .065, .36, [0, -.17, 0], color);
      sphere(arm, .073, [0, -.37, 0], skin); arms.push(arm);
    }
    return { group: g, legs, arms };
  }
  const cashier = person(counter, [-2.1, .05, .1], P.pink, false);
  const cook = person(counter, [-.65, .05, -1.05], P.white, true, '#b87d60');
  const secondCook = person(stationGroups.kitchen, [.95, .05, -1.05], P.white, true);
  const customers = [person(entrance, [-1.6, .05, 2.6], '#6b8ca5'), person(entrance, [-1.4, .05, 3.8], '#c9a056', false, '#ae765f')];
  customers.forEach(customer => customer.group.rotation.y = Math.PI);

  const tickets = Array.from({ length: 7 }, (_, i) => {
    const g = group(counter, [-1.2 + i * .4, 1.52, .96]);
    box(g, [.27, .36, .025], [0, 0, 0], P.white, .016);
    box(g, [.22, .05, .01], [0, .1, .02], P.pink, .003);
    box(g, [.17, .025, .01], [0, -.015, .02], P.steel, .002);
    box(g, [.12, .025, .01], [-.025, -.08, .02], P.steel, .002);
    return g;
  });
  // Every unit has a food counter, a cook and a menu, rather than a server box.
  replicas.forEach(replica => {
    const chef = person(replica, [0, .16, -.12], P.white, true);
    chef.group.scale.setScalar(.58);
  });
  const manager = person(terminal, [3.75, .05, -2.1], '#6b927c');
  manager.group.rotation.y = -.5;
  const extraCook = person(stationGroups.kitchen, [-2.2, .05, -1.05], P.white, true, '#ad7557');
  const extraAdvisor = person(terminal, [2.7, .05, -1.65], '#bd8559');
  extraAdvisor.group.rotation.y = -.3;
  const runner = person(scene, [0, .05, 0], P.pink);
  const arrivingCustomer = person(scene, [0, .05, 0], '#6b8ca5');
  arrivingCustomer.group.userData.restaurantProp = 'customer';
  // The carried object remains in a worker's hands, at waist height throughout the walk.
  const hand = group(runner.group, [0, .92, .36]);
  const work = group();
  const secondWork = group();
  const peerWork = [group(), group(), group()];
  const pools = new Map<T.Group, Map<RestaurantProp, T.Group>>();
  function showObject(holder: T.Group, prop: RestaurantProp) {
    if (!pools.has(holder)) pools.set(holder, new Map());
    const pool = pools.get(holder)!;
    if (!pool.has(prop)) pool.set(prop, restaurantObject(holder, prop, [0, 0, 0], .9));
    for (const [kind, object] of pool) object.visible = kind === prop;
  }
  const inkStamp = group(work, [.12, .24, .09]);
  cylinder(inkStamp, .09, .09, .035, [0, 0, 0], '#568c65', 16).rotation.x = Math.PI / 2;
  box(inkStamp, [.035, .11, .018], [-.015, -.005, .025], P.white, .004).rotation.z = .7;
  box(inkStamp, [.035, .17, .018], [.045, .025, .025], P.white, .004).rotation.z = -.55;
  const returnStamp = group(work, [.12, .23, .08]);
  for (const angle of [-.7, .7]) box(returnStamp, [.035, .2, .02], [0, 0, 0], P.red, .005).rotation.z = angle;
  const carriedApproval = inkStamp.clone(); hand.add(carriedApproval);
  const carriedReturn = returnStamp.clone(); hand.add(carriedReturn);
  const pen = group(work, [.28, .1, .07]);
  cylinder(pen, .016, .016, .42, [0, 0, 0], P.navy, 6).rotation.z = -.4;
  const filingTray = group();
  box(filingTray, [.85, .08, .6], [0, 0, 0], '#9e7754', .025);
  for (const x of [-.41, .41]) box(filingTray, [.04, .18, .58], [x, .08, 0], '#9e7754', .008);
  const waitingNotice = group();
  box(waitingNotice, [.77, .43, .035], [0, 0, 0], '#fff0d1', .015);
  box(waitingNotice, [.04, .55, .04], [0, -.35, -.03], P.wood, .006);
  box(waitingNotice, [.45, .04, .3], [0, -.62, 0], P.wood, .008);
  const noticeClock = restaurantObject(waitingNotice, 'clock', [-.25, .04, .04], .27);
  noticeClock.rotation.y = .1;
  const stockKey = restaurantObject(stock, 'key', [-3.34, 1.13, -2.07], .55);
  const reserveCrate = restaurantObject(stock, 'ingredient', [-3.6, .25, -.6], .8);
  const steam = Array.from({ length: 4 }, (_, i) => {
    const m = new T.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: .13, depthWrite: false }); materials.add(m);
    const g = new T.SphereGeometry(.09, 8, 6); geometries.add(g);
    const puff = new T.Mesh(g, m); puff.position.set(-.5 + i * .1, 1.35, -2.15); scene.add(puff); return puff;
  });

  // These labels are anchored to furniture or the item being handled. No text textures
  // or floating network UI are required, so WebGL and SVG remain equally readable.
  const annotations = document.createElement('div');
  annotations.setAttribute('aria-hidden', 'true');
  Object.assign(annotations.style, { position: 'absolute', inset: '0', overflow: 'hidden', pointerEvents: 'none' });
  host.appendChild(annotations);
  const labels: { element: HTMLSpanElement; at: T.Vector3; visible: () => boolean }[] = [];
  function label(at: Position, paper = false) {
    const element = document.createElement('span');
    Object.assign(element.style, {
      position: 'absolute', display: 'block', whiteSpace: 'nowrap', transform: 'translate(-50%,-50%)',
      fontFamily: 'system-ui,sans-serif', fontWeight: '700', fontSize: paper ? '10px' : '9px',
      padding: paper ? '3px 6px' : '2px 5px', color: '#443d30', background: '#fff4db',
      borderRadius: '2px', border: '1px solid #bfa981', lineHeight: '1.3',
    });
    annotations.appendChild(element);
    const entry = { element, at: new T.Vector3(...at), visible: () => true }; labels.push(entry); return entry;
  }
  const itemLabel = label([0, 0, 0], true);
  const extraLabel = label([0, 0, 0], true);
  const noticeLabel = label([0, 0, 0]);
  const mainSign = label([-2.55, 2.55, -3.3]); mainSign.element.textContent = 'DINAMOS';
  replicas.forEach((replica, i) => {
    const entry = label([replica.position.x, 1.67, replica.position.z + .76]);
    entry.visible = () => branch.visible; entry.element.textContent = String.fromCharCode(65 + i);
  });
  const allGroups: { object: T.Group; target: number; built: boolean }[] = [];
  for (const [station, object] of Object.entries(stationGroups) as [Station, T.Group][]) allGroups.push({ object, target: 1, built: initial.level >= levels[station] });
  allGroups.push({ object: dining, target: 1, built: initial.level >= 3 });
  let beat: RestaurantBeat = { action: 'handover', copies: 1, carry: true };
  let visual: LessonVisual = initial.visual ?? { from: 'entrance', to: 'counter', cue: 'flow', prop: 'order' };
  let walk: T.Vector3[] = [];
  let currentProp: RestaurantProp = 'order';
  const anchor = (station: Station) => new T.Vector3(...positions[station]);
  const floor = (station: Station) => {
    const at = anchor(station); at.y = .05;
    // Staff use the aisle behind the counter, customers the front of house.
    if (station === 'counter') at.set(-1.25, .05, .15);
    if (station === 'kitchen') at.set(1.95, .05, -.65);
    if (station === 'stock') at.set(-3.15, .05, -.65);
    if (station === 'pickup') at.set(2.65, .05, .25);
    if (station === 'terminal') at.set(3.45, .05, -1.5);
    if (station === 'branch') at.set(4.45, .05, -.7);
    if (station === 'dispatch') at.set(3.3, .05, 3.75);
    return at;
  };
  function makeWalk() {
    const a = floor(visual.from), b = floor(visual.to);
    walk = [a];
    // Cross between dining room and kitchen around the open end of the counter.
    if ((a.z > 1) !== (b.z > 1)) walk.push(new T.Vector3(3.7, .05, a.z), new T.Vector3(3.7, .05, b.z));
    walk.push(b);
  }
  function placeOnWalk(object: T.Group, amount: number) {
    const lengths = walk.slice(1).map((point, i) => point.distanceTo(walk[i]));
    let remaining = amount * lengths.reduce((sum, length) => sum + length, 0);
    for (let i = 0; i < lengths.length; i++) {
      if (remaining <= lengths[i] || i === lengths.length - 1) {
        const fraction = lengths[i] ? T.MathUtils.clamp(remaining / lengths[i], 0, 1) : 0;
        object.position.copy(walk[i]).lerp(walk[i + 1], fraction);
        const direction = walk[i + 1].clone().sub(walk[i]);
        if (direction.lengthSq() > .001) object.rotation.y = Math.atan2(direction.x, direction.z);
        return;
      }
      remaining -= lengths[i];
    }
  }
  function configure(next: WorldState, first = false) {
    const changedMode = state.mode !== next.mode;
    const changedStep = state.step !== next.step || state.mode !== next.mode || JSON.stringify(state.visual) !== JSON.stringify(next.visual);
    state = next;
    if (changedStep || first) { stepTime = 0; reported = false; }
    visual = state.visual ?? { from: 'entrance', to: state.focus, cue: 'flow', prop: 'order' };
    currentProp = visual.prop; beat = getRestaurantBeat(visual);
    const required = specialStation[state.mode];
    for (const [station, object] of Object.entries(stationGroups) as [Station, T.Group][]) {
      const item = allGroups.find(item => item.object === object)!;
      const built = state.level >= levels[station];
      item.target = built || station === state.focus || station === visual.from || station === visual.to || station === visual.fault || station === required ? 1 : 0;
      item.built = built;
    }
    const expandedSite = allGroups.find(item => item.object === branch)!.target > 0;
    island.scale.set(expandedSite ? 1 : .83, 1, 1);
    island.position.x = expandedSite ? 0 : -.3;
    allGroups.find(item => item.object === dining)!.target = state.level >= 3 ? 1 : 0;
    for (const item of allGroups) {
      if (state.reducedMotion || first) { item.object.visible = item.target > 0; item.object.scale.set(1, item.target || .001, 1); }
      else if (item.target && !item.object.visible) { item.object.visible = true; item.object.scale.set(1, .02, 1); }
    }
    const target = anchor(visual.to);
    const surfaces: Record<Station, number> = { entrance: 1.15, counter: 1.17, kitchen: 1.12, pickup: 1.03, stock: 1.08, branch: 1, dispatch: .95, terminal: 1.02 };
    const flat = ['ledger', 'recipe', 'tray', 'ingredient'].includes(currentProp);
    work.position.copy(target); work.position.y = surfaces[visual.to] + (flat ? .05 : .34); work.rotation.set(0, .35, 0);
    secondWork.position.copy(work.position).add(new T.Vector3(.6, 0, .12)); secondWork.rotation.set(0, -.2, 0);
    for (const holder of [hand, work, secondWork, ...peerWork]) showObject(holder, currentProp);
    const localRead = !beat.carry;
    runner.group.visible = currentProp !== 'customer' && beat.action !== 'queue';
    arrivingCustomer.group.visible = currentProp === 'customer';
    hand.visible = currentProp !== 'customer' && beat.carry; work.visible = localRead; secondWork.visible = beat.copies > 1 && localRead;
    if (beat.action === 'copy') {
      secondWork.visible = true;
      secondWork.position.copy(anchor(visual.from));
      secondWork.position.y = surfaces[visual.from] + (flat ? .05 : .34);
    }
    peerWork.forEach((holder, i) => {
      const peerPosition = visual.to === 'branch' || visual.from === 'branch'
        ? new T.Vector3(5.25, 1.07, -1.67 + i * 2.05)
        : new T.Vector3(-2.2 + i * 1.55, 1.2, -2.05);
      holder.position.copy(peerPosition); holder.rotation.set(0, .3, 0);
      holder.visible = (beat.action === 'copy' || beat.action === 'approve') && !!visual.peers;
      holder.scale.setScalar(.65);
    });
    filingTray.position.copy(target).add(new T.Vector3(.5, -.05, .13));
    filingTray.visible = ['file-duplicate', 'return', 'sort'].includes(beat.action);
    const noticeAt = anchor(visual.fault ?? visual.to);
    waitingNotice.position.copy(noticeAt); waitingNotice.position.y = .78; waitingNotice.rotation.y = .35;
    waitingNotice.visible = !!visual.blocked || !!visual.fault;
    stockKey.visible = currentProp === 'key' || (state.mode === 'security' && visual.to === 'stock');
    reserveCrate.visible = currentProp === 'ingredient' || beat.action === 'refund';
    tickets.forEach((ticket, i) => { ticket.visible = i < (visual.queueDepth ?? (beat.action === 'queue' ? 5 : 1)); });
    pickupBurgers.forEach(item => { item.visible = currentProp === 'tray' || currentProp === 'delivery-bag'; });
    if (state.step === 0 || changedMode) { expandedWorkers = false; baseGrill.scale.setScalar(1); }
    if (visual.cue === 'scale' && visual.peers) expandedWorkers = true;
    if (visual.cue === 'scale' && !visual.peers && visual.to === 'kitchen') baseGrill.scale.set(1.28, 1.12, 1.2);
    extraCook.group.visible = state.mode === 'scaling' ? expandedWorkers : state.level >= 2 || expandedWorkers;
    secondCook.group.visible = state.mode === 'scaling' ? expandedWorkers : state.level >= 2 || expandedWorkers;
    extraAdvisor.group.visible = expandedWorkers && state.mode === 'ai';
    branchDocuments.forEach(document => { document.visible = !peerWork.some(holder => holder.visible); });
    const locale = state.locale ?? 'pt';
    const name = restaurantPropNames[locale][currentProp];
    itemLabel.element.textContent = `${name}${visual.detail ? ` ${visual.detail}` : ''}`;
    extraLabel.element.textContent = beat.action === 'refund'
      ? `${locale === 'pt' ? 'Estorno' : 'Refund'} ${visual.detail ?? ''}`
      : beat.action === 'file-duplicate'
        ? `${locale === 'pt' ? 'Via repetida' : 'Duplicate copy'} ${visual.detail ?? ''}`
        : `${name}${visual.detail ? ` ${visual.detail}` : ''}`;
    noticeLabel.element.textContent = locale === 'pt'
      ? (visual.blocked ? 'Comanda em espera' : 'Sem novas notícias')
      : (visual.blocked ? 'Order on hold' : 'No new messages');
    noticeLabel.at.copy(waitingNotice.position).add(new T.Vector3(.1, .03, .06));
    noticeLabel.visible = () => waitingNotice.visible;
    itemLabel.visible = () => true;
    extraLabel.visible = () => secondWork.visible;
    host.dataset.restaurantProp = currentProp; host.dataset.restaurantAction = beat.action;
    host.dataset.restaurantDetail = visual.detail ?? '';
    makeWalk();
    if (gpu) gpu.shadowMap.needsUpdate = true;
    buildUntil = performance.now() + (first || state.reducedMotion ? 0 : 650);
    updateFrame(0); if (!first) resize(); render(); schedule();
  }
  function updateFrame(delta: number, activeElapsed = delta) {
    const teaching = state.playing && !state.reducedMotion;
    if (teaching) { clock += delta; stepTime += activeElapsed; }
    const phase = stepTime > 0 ? T.MathUtils.clamp(stepTime / 3.5, 0, 1) : teaching ? 0 : .88;
    for (const item of allGroups) {
      const scale = state.reducedMotion ? item.target : T.MathUtils.damp(item.object.scale.y, item.target, 8, Math.max(delta, .016));
      item.object.scale.set(1, Math.max(.001, scale), 1);
      if (item.target === 0 && scale < .008) item.object.visible = false;
    }
    let travel = T.MathUtils.smoothstep(phase, .06, .78);
    if (beat.action === 'return') travel = phase < .5 ? phase * 1.5 : 1.5 * (1 - phase);
    if (beat.action === 'retry') travel = phase < .5 ? phase * 1.5 : (phase - .5) * 2;
    if (visual.blocked) travel = Math.min(travel, .55);
    placeOnWalk(runner.group, travel); placeOnWalk(arrivingCustomer.group, travel);
    if (!beat.carry && currentProp !== 'customer') {
      runner.group.position.set(work.position.x - .45, .05, work.position.z + .48);
      runner.group.rotation.y = Math.atan2(.45, -.48);
    }
    runner.arms.forEach(arm => { arm.rotation.x = -.85; });
    arrivingCustomer.arms[1].rotation.x = -.3;
    for (const person of [runner, arrivingCustomer]) person.legs.forEach((leg, i) => { leg.rotation.x = teaching && travel > 0 && travel < .98 ? Math.sin(clock * 7 + i * Math.PI) * .34 : 0; });
    // A handover ends with the object resting on the destination's counter.
    const delivered = beat.carry && travel > .96 && currentProp !== 'customer';
    hand.visible = !delivered && beat.carry && currentProp !== 'customer';
    work.visible = !beat.carry || delivered;
    if (beat.action === 'file-duplicate') {
      secondWork.visible = true;
      secondWork.position.copy(filingTray.position).add(new T.Vector3(0, .09, 0));
      secondWork.rotation.x = -Math.PI / 2;
    } else if (beat.action === 'refund') secondWork.visible = true;
    const stamping = beat.stamp && phase > .45;
    inkStamp.visible = !!stamping && beat.stamp !== 'rejected'; returnStamp.visible = !!stamping && beat.stamp === 'rejected';
    carriedApproval.visible = !!stamping && beat.stamp !== 'rejected'; carriedReturn.visible = !!stamping && beat.stamp === 'rejected';
    pen.visible = beat.action === 'write';
    pen.position.x = .12 + (teaching ? Math.sin(clock * 6) * .14 : 0);
    work.rotation.x = currentProp === 'ledger' || currentProp === 'recipe' || currentProp === 'tray' || currentProp === 'ingredient' ? 0 : -.12;
    if (beat.action === 'read') work.rotation.z = teaching ? Math.sin(clock * 2) * .035 : 0;
    // Copies are papers/books handled at serving stations. Prepared food never fans out.
    peerWork.forEach((holder, i) => { if (holder.visible) holder.rotation.y = .3 + (teaching && beat.action === 'approve' ? Math.sin(clock * 2 + i) * .08 : 0); });
    cook.arms[0].rotation.x = currentProp === 'tray' || currentProp === 'ingredient' ? -.8 + (teaching ? Math.sin(clock * 5) * .22 : 0) : -.5;
    secondCook.arms[1].rotation.x = teaching && expandedWorkers ? -.7 + Math.sin(clock * 4) * .2 : -.5;
    cashier.arms[1].rotation.x = beat.action === 'write' || beat.action === 'approve' ? -.8 + (teaching ? Math.sin(clock * 5) * .12 : 0) : -.5;
    manager.arms[1].rotation.x = -.7 + (teaching && visual.to === 'terminal' ? Math.sin(clock * 3) * .1 : 0);
    customers.forEach((customer, i) => { customer.group.position.z = 2.6 + i * 1.15; });
    scooter.position.x = 3.1 + (teaching && currentProp === 'delivery-bag' && visual.to === 'dispatch' ? Math.max(0, phase - .65) * 3 : 0);
    steam.forEach((puff, i) => {
      const cycle = (clock * .4 + i / steam.length) % 1;
      puff.visible = currentProp === 'tray' || currentProp === 'ingredient'; puff.position.y = 1.27 + cycle * .9;
      puff.scale.setScalar(.4 + cycle); (puff.material as T.MeshBasicMaterial).opacity = teaching ? (1 - cycle) * .13 : .06;
    });
    itemLabel.at.copy(work.visible ? work.position : currentProp === 'customer' ? arrivingCustomer.group.position : runner.group.position);
    itemLabel.at.y += work.visible ? .45 : 1.8;
    extraLabel.at.copy(secondWork.position).add(new T.Vector3(0, .45, 0));
    if (teaching && stepTime >= 4 && !reported) { reported = true; initial.onStepComplete?.(); }
  }
  function render() {
    if (disposed) return;
    renderer.render(scene, camera); if (!gpu) canvas.style.backgroundColor = 'transparent';
    for (const entry of labels) {
      const projected = entry.at.clone().project(camera);
      entry.element.style.display = entry.visible() && projected.z >= -1 && projected.z <= 1 ? 'block' : 'none';
      entry.element.style.left = `${(projected.x + 1) * .5 * host.clientWidth}px`;
      entry.element.style.top = `${(1 - projected.y) * .5 * host.clientHeight}px`;
    }
  }
  function schedule() {
    previousTime = 0;
    const animate = state.playing && !state.reducedMotion;
    if (animate || performance.now() < buildUntil) setLoop(time => {
      if (disposed) return;
      const elapsed = previousTime ? Math.max(0, (time - previousTime) / 1000) : 0;
      previousTime = time;
      // Bound pose interpolation, not the lesson clock. A slow GPU must not
      // stretch four seconds of active teaching into dozens of seconds.
      updateFrame(Math.min(elapsed, gpu ? .05 : .15), elapsed); render();
      if ((!state.playing || state.reducedMotion) && performance.now() >= buildUntil) setLoop(null);
    });
    else setLoop(null);
  }
  const renderOnChange = () => render(); controls.addEventListener('change', renderOnChange);
  const resize = () => {
    const width = Math.max(host.clientWidth, 1); const height = Math.max(host.clientHeight, 1);
    const aspect = width / height;
    const expandedSite = allGroups.find(item => item.object === branch)!.target > 0;
    const view = Math.max(expandedSite ? 6.35 : 5.6, (expandedSite ? 8.9 : 7.5) / aspect);
    camera.left = -view * aspect; camera.right = view * aspect; camera.top = view; camera.bottom = -view;
    camera.updateProjectionMatrix(); if (gpu) gpu.setSize(width, height, false); else renderer.setSize(width, height); render();
  };
  const observer = new ResizeObserver(resize); observer.observe(host);
  const lost = (event: Event) => { event.preventDefault(); setLoop(null); initial.onUnavailable(); };
  canvas.addEventListener('webglcontextlost', lost);
  configure(initial, true); resize();
  return {
    backend: gpu ? 'webgl' : 'svg',
    update: next => configure({ ...state, ...next }),
    rotate: direction => {
      const offset = camera.position.clone().sub(controls.target);
      const angle = Math.atan2(offset.x, offset.z) + direction * .25;
      const radius = Math.hypot(offset.x, offset.z);
      camera.position.set(controls.target.x + Math.sin(angle) * radius, camera.position.y, controls.target.z + Math.cos(angle) * radius);
      controls.update(); render();
    },
    zoom: () => { camera.zoom = camera.zoom < 1.15 ? 1.3 : 1; camera.updateProjectionMatrix(); render(); },
    dispose: () => {
      disposed = true; setLoop(null); observer.disconnect();
      canvas.removeEventListener('webglcontextlost', lost); controls.removeEventListener('change', renderOnChange); controls.dispose();
      geometries.forEach(geometry => geometry.dispose()); materials.forEach(m => m.dispose());
      gpu?.dispose(); gpu?.forceContextLoss(); annotations.remove();
      if (positionHost) host.style.position = previousHostPosition;
      delete host.dataset.restaurantProp; delete host.dataset.restaurantAction; delete host.dataset.restaurantDetail;
      if (canvas.parentNode === host) host.removeChild(canvas);
    },
  };
}
