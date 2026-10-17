import * as T from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { SVGRenderer } from 'three/addons/renderers/SVGRenderer.js';
import type { LessonVisual } from './visualModel';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import type { SceneMode, Station } from './learningModel';

type Position = [number, number, number];
export interface WorldState {
  mode: SceneMode; focus: Station; step: 0 | 1 | 2; level: number;
  visual?: LessonVisual;
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
  entrance: [-1.9, .3, 3.7], counter: [-.7, 1.25, 1], kitchen: [.2, 1.12, -2.15],
  pickup: [2.5, 1.1, 1], stock: [-3.6, 1.1, -1.3], branch: [5.25, 1, -.5],
  dispatch: [3.25, .7, 4], terminal: [3.45, 1.4, -2.55],
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
    gpu.toneMappingExposure = 1.32;
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
  const ambient = new T.HemisphereLight('#fff3de', '#a7bad5', 2.5); scene.add(ambient);
  const sunlight = new T.DirectionalLight('#fff5df', 4);
  sunlight.position.set(-6, 12, 9); sunlight.castShadow = true;
  sunlight.shadow.mapSize.set(1024, 1024);
  Object.assign(sunlight.shadow.camera, { left: -10, right: 10, top: 9, bottom: -9, near: 1, far: 35 });
  sunlight.shadow.normalBias = .04; sunlight.shadow.bias = -.0002;
  scene.add(sunlight);
  const fill = new T.DirectionalLight('#c9e4ff', 1.4); fill.position.set(7, 5, -5); scene.add(fill);
  if (!gpu) { sunlight.intensity = .8; fill.intensity = .25; scene.add(new T.AmbientLight('#e8eef3', .35)); }

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
  if (!gpu) {
    const shadowMaterial = new T.MeshBasicMaterial({ color: '#30454b', transparent: true, opacity: .12, depthWrite: false });
    materials.add(shadowMaterial);
    for (const [x, z, width, depth] of [[-.7, 1.12, 2.5, .65], [-.65, -2.2, .9, .6], [3.1, 2.75, .8, .55], [-1.7, 2.6, .35, .22]]) {
      const geometry = new T.CircleGeometry(1, 24); geometries.add(geometry);
      const shadow = new T.Mesh(geometry, shadowMaterial); shadow.rotation.x = -Math.PI / 2;
      shadow.position.set(x, .045, z); shadow.scale.set(width, depth, 1); island.add(shadow);
    }
  }
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
  const cachedBurgers = [burger(pickup, [2.12, 1.03, 1.1], .75), burger(pickup, [2.7, 1.03, 1.1], .75)];
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

  const cacheDisplay = group(pickup, [0, 0, 0]);
  box(cacheDisplay, [.85, .46, .07], [2.6, 1.37, 1.57], P.navy, .025);
  box(cacheDisplay, [.75, .36, .02], [2.6, 1.37, 1.615], '#466b65', .014);
  const cacheRows: T.Mesh[] = [];
  for (let i = 0; i < 3; i++) cacheRows.push(box(cacheDisplay, [.5 - i * .09, .035, .018], [2.55, 1.46 - i * .09, 1.64], P.mint, .005));

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
  const replicaLights: T.Mesh[] = [];
  for (let i = 0; i < 3; i++) {
    const g = group(branch, [5.25, 0, -2.65 + i * 2.05]); replicas.push(g);
    box(g, [1.28, .11, 1.4], [0, .1, 0], '#cedbd6', .09);
    box(g, [1.04, .89, .95], [0, .6, 0], i === 0 ? P.rose : '#d2d7d5');
    box(g, [1.16, .16, 1.08], [0, 1.14, 0], P.navy, .04);
    box(g, [.73, .41, .04], [0, .73, .5], P.ink);
    box(g, [.7, .12, .09], [0, 1, .55], i === 0 ? P.pink : P.mint, .015);
    for (const x of [-.23, .23]) box(g, [.035, .38, .025], [x, .72, .54], P.steel, .005);
    replicaLights.push(sphere(g, .08, [.4, 1.3, 0], P.mint));
  }
  const terminal = stationGroups.terminal;
  box(terminal, [1.15, .1, .75], [3.25, .94, -2.5], P.wood);
  for (const x of [2.8, 3.7]) box(terminal, [.055, .9, .055], [x, .48, -2.5], P.navy);
  box(terminal, [.1, .3, .1], [3.25, 1.14, -2.6], P.navy);
  box(terminal, [.88, .58, .1], [3.25, 1.57, -2.6], P.navy, .045);
  box(terminal, [.76, .46, .025], [3.25, 1.57, -2.535], '#42665f', .02);
  for (let i = 0; i < 4; i++) box(terminal, [.1, .1 + i * .055, .03], [2.99 + i * .17, 1.46 + i * .025, -2.5], i % 2 ? P.mint : P.rose, .01);
  box(terminal, [.5, .035, .18], [3.25, 1.02, -2.23], P.navy, .02);

  const gpuWorkers = Array.from({ length: 3 }, (_, index) => {
    const worker = group(terminal, [2.93 + index * .3, 0, -2.5]);
    box(worker, [.23, .58, .46], [0, .38, 0], P.navy, .035);
    sphere(worker, .027, [0, .57, .245], P.mint);
    for (let row = 0; row < 3; row++) box(worker, [.14, .022, .018], [0, .4 - row * .07, .24], P.steel, .002);
    return worker;
  });

  function person(parent: T.Group, at: Position, color: string, chef = false, skin = '#d6a184') {
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
  const effects = group();
  const flowMaterial = new T.MeshBasicMaterial({ color: P.pink, transparent: true, opacity: .7 }); materials.add(flowMaterial);
  const tokenMaterial = new T.MeshStandardMaterial({ color: P.pink, emissive: P.pink, emissiveIntensity: .15, roughness: .5 }); materials.add(tokenMaterial);
  const tokens = Array.from({ length: 6 }, () => {
    const geometry = new T.SphereGeometry(.09, 12, 8); geometries.add(geometry);
    const token = new T.Mesh(geometry, tokenMaterial); effects.add(token); return token;
  });
  const lineMaterial = new T.LineDashedMaterial({ color: P.pink, dashSize: .13, gapSize: .1, transparent: true, opacity: .55 }); materials.add(lineMaterial);
  let line: T.Line | null = null;
  const focusRingGeometry = new T.RingGeometry(.73, .79, 48); geometries.add(focusRingGeometry);
  const focusRing = new T.Mesh(focusRingGeometry, flowMaterial); focusRing.rotation.x = -Math.PI / 2; effects.add(focusRing);
  const pin = sphere(effects, .1, [0, 0, 0], P.pink);
  const connectionMaterial = new T.LineDashedMaterial({ color: P.mint, dashSize: .12, gapSize: .1, transparent: true, opacity: .55 }); materials.add(connectionMaterial);
  const connections: T.Line[] = [];
  for (const replica of replicas) {
    const g = new T.BufferGeometry().setFromPoints([new T.Vector3(2.8, .12, -.55), new T.Vector3(replica.position.x, .12, replica.position.z)]);
    geometries.add(g); const connection = new T.Line(g, connectionMaterial); connection.computeLineDistances(); effects.add(connection); connections.push(connection);
  }
  const failed = new T.MeshBasicMaterial({ color: P.red, transparent: true, opacity: .8 }); materials.add(failed);
  const fault = new T.Mesh(new T.TorusGeometry(.82, .045, 6, 24), failed); geometries.add(fault.geometry); effects.add(fault);
  fault.rotation.x = -Math.PI / 2;
  const faultBeacon = sphere(effects, .12, [0, 0, 0], P.red);
  const steam = Array.from({ length: 5 }, (_, i) => {
    const m = new T.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: .16, depthWrite: false }); materials.add(m);
    const g = new T.SphereGeometry(.09, 8, 6); geometries.add(g);
    const puff = new T.Mesh(g, m); puff.position.set(-.5 + i * .1, 1.35, -2.15); effects.add(puff); return puff;
  });

  const dataPanel = group(effects);
  box(dataPanel, [1.5, .55, .07], [0, 0, 0], P.navy, .035);
  const bitCells = Array.from({ length: 8 }, (_, i) => box(dataPanel, [.12, .18, .03], [-.59 + i * .17, .05, .06], P.mint, .012));
  const statusLight = sphere(dataPanel, .055, [.61, -.16, .07], P.mint);

  const allGroups: { object: T.Group; target: number; built: boolean }[] = [];
  for (const [station, object] of Object.entries(stationGroups) as [Station, T.Group][]) allGroups.push({ object, target: 1, built: initial.level >= levels[station] });
  allGroups.push({ object: walls, target: 1, built: initial.level >= 2 }, { object: dining, target: 1, built: initial.level >= 3 });
  let from = new T.Vector3(); let to = new T.Vector3();

  function configure(next: WorldState, first = false) {
    const changedStep = state.step !== next.step || state.mode !== next.mode;
    state = next;
    if (changedStep || first) { stepTime = 0; reported = false; }
    const visual = state.visual;
    const required = specialStation[state.mode];
    for (const [station, object] of Object.entries(stationGroups) as [Station, T.Group][]) {
      const item = allGroups.find(item => item.object === object)!;
      const built = state.level >= levels[station];
      item.target = built || station === state.focus || station === visual?.from || station === visual?.to || station === visual?.fault || station === required || (station === 'kitchen' && ['routing', 'scaling', 'recovery'].includes(state.mode)) ? 1 : 0;
      item.built = built;
    }
    allGroups.find(item => item.object === walls)!.target = state.level >= 2 ? 1 : 0;
    allGroups.find(item => item.object === dining)!.target = state.level >= 3 ? 1 : 0;
    for (const item of allGroups) {
      if (state.reducedMotion || first) { item.object.visible = item.target > 0; item.object.scale.set(1, item.target || .001, 1); }
      else if (item.target && !item.object.visible) { item.object.visible = true; item.object.scale.set(1, .02, 1); }
    }
    const stepFocus = positions[state.focus];
    focusRing.position.set(stepFocus[0], .09, stepFocus[2]); pin.position.set(stepFocus[0], stepFocus[1] + .75, stepFocus[2]);
    fault.visible = !!visual?.fault;
    const faultAt = visual?.fault ? positions[visual.fault] : positions.counter;
    fault.position.set(faultAt[0], .13, faultAt[2]);
    faultBeacon.visible = fault.visible; faultBeacon.position.set(faultAt[0], faultAt[1] + .85, faultAt[2]);
    replicas.forEach((replica, i) => { replica.rotation.y = i === 0 && state.mode === 'consensus' ? .07 : 0; });
    connections.forEach((connection, i) => { connection.visible = (state.level >= 5 || state.focus === 'branch' || required === 'branch' || visual?.from === 'branch' || visual?.to === 'branch' || visual?.fault === 'branch') && !(visual?.fault === 'branch' && i === 1); });
    const ticketCount = visual?.queueDepth ?? (state.mode === 'routing' ? 3 : 1);
    tickets.forEach((ticket, i) => { ticket.visible = i < ticketCount; });
    cachedBurgers.forEach(burger => { burger.visible = true; });
    const cue = visual?.cue;
    if (state.step === 0 || state.mode !== 'scaling') { expandedWorkers = false; baseGrill.scale.setScalar(1); }
    if (cue === 'scale' && visual?.peers) expandedWorkers = true;
    if (cue === 'scale' && !visual?.peers && visual?.to === 'kitchen') baseGrill.scale.set(1.28, 1.12, 1.2);
    gpuWorkers.forEach((worker, index) => { worker.visible = index === 0 || expandedWorkers; });

    replicaLights.forEach((light, i) => { light.material = material(visual?.fault === 'branch' && i === 1 ? P.red : cue === 'vote' && i === 2 ? P.gold : P.mint); });
    lineMaterial.color.set(visual?.blocked ? P.gold : P.pink);
    dataPanel.visible = ['filter', 'write', 'inspect', 'retrieve', 'cache-fill', 'cache-hit', 'deduplicate', 'vote', 'commit', 'merge'].includes(cue ?? '');
    dataPanel.position.set(stepFocus[0], stepFocus[1] + .45, stepFocus[2] + .15);
    dataPanel.rotation.y = .45;
    cacheRows.forEach((row, index) => { row.scale.x = cue === 'cache-fill' ? .55 + index * .13 : 1; });
    statusLight.material = material(visual?.blocked ? P.gold : cue === 'reject' ? P.red : P.mint);
    bitCells.forEach((cell, index) => { cell.material = material(cue === 'filter' && ![1, 3, 5].includes(index) ? '#566476' : cue === 'commit' ? P.mint : index % 2 ? P.rose : P.mint); });

    tokenMaterial.color.set(cue === 'reject' ? P.red : visual?.blocked || cue === 'compensate' ? P.gold : ['cache-hit', 'commit', 'recover', 'answer', 'merge', 'deduplicate'].includes(cue ?? '') ? P.darkMint : P.pink);
    tokenMaterial.emissive.copy(tokenMaterial.color);
    const routes: Partial<Record<SceneMode, [Station, Station][]>> = {
      counter: [['entrance', 'counter'], ['counter', 'kitchen'], ['kitchen', 'pickup']],
      queue: [['entrance', 'counter'], ['counter', 'counter'], ['counter', 'kitchen']],
      routing: [['entrance', 'counter'], ['counter', 'kitchen'], ['kitchen', 'pickup']],
      cache: [['kitchen', 'pickup'], ['counter', 'pickup'], ['pickup', 'entrance']],
      storage: [['counter', 'stock'], ['stock', 'stock'], ['stock', 'counter']],
      replication: [['counter', 'stock'], ['stock', 'branch'], ['branch', 'counter']],
      consensus: [['counter', 'branch'], ['branch', 'branch'], ['branch', 'counter']],
      network: [['counter', 'branch'], ['branch', 'branch'], ['branch', 'counter']],
      saga: [['counter', 'stock'], ['stock', 'kitchen'], ['kitchen', 'stock']],
      security: [['entrance', 'counter'], ['entrance', 'entrance'], ['entrance', 'counter']],
      observability: [['counter', 'kitchen'], ['kitchen', 'terminal'], ['terminal', 'counter']],
      scaling: [['entrance', 'counter'], ['counter', 'kitchen'], ['kitchen', 'pickup']],
      ai: [['counter', 'terminal'], ['stock', 'terminal'], ['terminal', 'counter']],
      delivery: [['counter', 'kitchen'], ['kitchen', 'pickup'], ['pickup', 'dispatch']],
      recovery: [['counter', 'kitchen'], ['kitchen', 'counter'], ['counter', 'kitchen']],
      events: [['entrance', 'counter'], ['counter', 'stock'], ['stock', 'branch']],
    };
    const route = visual ? [visual.from, visual.to] as [Station, Station] : routes[state.mode]![state.step];
    from = new T.Vector3(...positions[route[0]]); to = new T.Vector3(...positions[route[1]]);
    if (from.distanceTo(to) < .1) { from.x -= 1.2; to.x += .6; }
    if (line) { effects.remove(line); geometries.delete(line.geometry); line.geometry.dispose(); }
    const points = Array.from({ length: 32 }, (_, i) => {
      const t = i / 31 * (visual?.blocked ? .58 : 1); const v = from.clone().lerp(to, t); v.y += .5 * Math.sin(t * Math.PI); return v;
    });
    const geometry = new T.BufferGeometry().setFromPoints(points); geometries.add(geometry);
    line = new T.Line(geometry, lineMaterial); line.computeLineDistances(); effects.add(line);
    if (gpu) gpu.shadowMap.needsUpdate = true;
    buildUntil = performance.now() + (first || state.reducedMotion ? 0 : 650);
    updateFrame(0); render(); schedule();
  }
  function updateFrame(delta: number) {
    if (state.playing && !state.reducedMotion) { clock += delta; stepTime += delta; }
    for (const item of allGroups) {
      const scale = state.reducedMotion ? item.target : T.MathUtils.damp(item.object.scale.y, item.target, 8, Math.max(delta, .016));
      item.object.scale.set(1, Math.max(.001, scale), 1);
      if (item.target === 0 && scale < .008) item.object.visible = false;
    }
    const teaching = state.playing && !state.reducedMotion;
    tokens.forEach((token, i) => {
      let progress = teaching ? (stepTime * (state.visual?.cue === 'cache-hit' ? .55 : .32) + i / tokens.length) % 1 : Math.min(.95, .16 + i * .13);
      if (state.visual?.blocked) progress = Math.min(progress, .58);
      if (state.visual?.cue === 'reject') progress = Math.min(progress, .4);
      token.position.copy(from).lerp(to, progress);
      token.position.y += .5 * Math.sin(progress * Math.PI);
      if (state.visual?.peers) {
        if (state.visual.to === 'branch') token.position.z += (i % 3 - 1) * 2.05 * progress;
        else if (state.visual.from === 'branch') token.position.z += (i % 3 - 1) * 2.05 * (1 - progress);
        else if (state.visual.to === 'kitchen') token.position.x += (i % 3 - 1) * 1.5 * progress;
      }
      token.visible = !(state.visual?.cue === 'deduplicate' && i % 2 === 1 && progress > .52);

    });
    focusRing.scale.setScalar(teaching ? 1 + Math.sin(clock * 2) * .035 : 1);
    pin.position.y = positions[state.focus][1] + .75 + (teaching ? Math.sin(clock * 2) * .05 : 0);
    cookingBurger.rotation.y = clock * .15;
    cook.arms[0].rotation.x = teaching ? -.7 + Math.sin(clock * 4) * .2 : -.7;
    secondCook.arms[1].rotation.x = teaching ? -.5 + Math.sin(clock * 3.5) * .2 : -.5;
    cashier.arms[1].rotation.x = teaching ? -.5 + Math.sin(clock * 2.4) * .12 : -.5;
    customers.forEach((customer, i) => {
      const moving = teaching && state.step === 0;
      customer.group.position.z = 2.6 + i * 1.15 - (moving ? Math.sin(clock * .8 + i) * .13 : 0);
      customer.legs.forEach((leg, n) => { leg.rotation.x = moving ? Math.sin(clock * 5 + n * Math.PI) * .18 : 0; });
    });
    scooter.position.x = 3.1 + (teaching && state.mode === 'delivery' && state.step === 2 ? Math.sin(clock * .6) * 1.25 : 0);
    steam.forEach((puff, i) => {
      const cycle = (clock * .4 + i / steam.length) % 1;
      puff.position.y = 1.27 + cycle * .9;
      puff.scale.setScalar(.4 + cycle);
      (puff.material as T.MeshBasicMaterial).opacity = teaching ? (1 - cycle) * .18 : .08;
    });
    if (teaching && stepTime >= 4 && !reported) { reported = true; initial.onStepComplete?.(); }
  }
  function render() { if (!disposed) { renderer.render(scene, camera); if (!gpu) canvas.style.backgroundColor = 'transparent'; } }
  function schedule() {
    previousTime = 0;
    const animate = state.playing && !state.reducedMotion;
    if (animate || performance.now() < buildUntil) setLoop(time => {
      if (disposed) return;
      const delta = previousTime ? Math.min((time - previousTime) / 1000, gpu ? .05 : .15) : 0;
      previousTime = time;
      updateFrame(delta); render();
      if ((!state.playing || state.reducedMotion) && performance.now() >= buildUntil) setLoop(null);
    });
    else setLoop(null);
  }
  const renderOnChange = () => render(); controls.addEventListener('change', renderOnChange);
  const resize = () => {
    const width = Math.max(host.clientWidth, 1); const height = Math.max(host.clientHeight, 1);
    const aspect = width / height;
    const view = Math.max(6.35, 8.9 / aspect);
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
      gpu?.dispose(); gpu?.forceContextLoss(); if (canvas.parentNode === host) host.removeChild(canvas);
    },
  };
}
