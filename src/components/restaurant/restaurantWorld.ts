import * as T from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { SVGRenderer } from 'three/addons/renderers/SVGRenderer.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import type { SceneMode, Station } from './learningModel';
import type { LessonVisual, RestaurantProp } from './visualModel';
import { makeRestaurantObject, restaurantPropNames } from './restaurantObjects';
import { getRestaurantBeat, type RestaurantBeat } from './restaurantChoreography';
import { getLessonDiorama, kits, localize, normalizeUnit, type DioramaUnit, type LessonDiorama, type UnitMark } from './dioramas';
import { kitBuilders, type KitBuild, type KitState, type StationPlace, type UnitHandle } from './dioramaKits';
import { C, type Craft, type Position, burgerBadge, chalkboard, markToken, person, plant, sawhorse, trafficCone } from './dioramaCraft';
import { restaurantCopy } from './copy';

export interface WorldState {
  mode: SceneMode; focus: Station; step: 0 | 1 | 2; level: number;
  visual?: LessonVisual;
  /** Lesson slug: selects the themed diorama and its authored states. */
  lesson?: string;
  title?: string;
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

const fallbackDiorama: LessonDiorama = {
  kit: 'line', board: { pt: 'Hamburgueria Dinamos', en: 'Dinamos Burgers' }, steps: [{}, {}, {}],
};
const metallic = new Set<string>([C.chrome, C.steel]);
const flatProps: readonly RestaurantProp[] = ['ledger', 'recipe', 'tray', 'ingredient'];
type LabelKind = 'paper' | 'notice' | 'sign' | 'chalk' | 'tag' | 'plaque';
interface Label { element: HTMLSpanElement; at: T.Vector3; visible: () => boolean }
interface UnitDecor { handle: UnitHandle; marks: Record<UnitMark, T.Group>; cone: T.Group; ring: T.Mesh; tag: Label; home: T.Vector3; shown: boolean }

const labelStyles: Record<LabelKind, Partial<CSSStyleDeclaration>> = {
  paper: { fontSize: '10px', padding: '3px 6px', color: '#443d30', background: '#fff4db', border: '1px solid #bfa981', borderRadius: '2px' },
  notice: { fontSize: '9px', padding: '2px 5px', color: '#5b2a1f', background: '#ffe9c7', border: '1px solid #d39a62', borderRadius: '2px' },
  sign: { fontSize: '8px', padding: '2px 6px', color: '#fff4db', background: '#2f3a52', borderRadius: '2px', textTransform: 'uppercase', letterSpacing: '.06em' },
  chalk: { fontSize: '11px', color: '#f6f2e4', fontFamily: '"Chalkboard SE","Segoe Print","Bradley Hand","Comic Sans MS",cursive', whiteSpace: 'normal', maxWidth: '130px', textAlign: 'center', fontWeight: '600' },
  tag: { fontSize: '9px', padding: '1px 5px', color: '#3a3226', background: '#fffaf0', border: '1px solid #c9b48e', borderRadius: '6px' },
  plaque: { fontSize: '10px', color: '#3b2a14', fontFamily: 'Georgia,"Times New Roman",serif', textAlign: 'center', letterSpacing: '.02em' },
};

function wrapText(context: CanvasRenderingContext2D, text: string, width: number) {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (line && context.measureText(next).width > width) { lines.push(line); line = word; } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}
/** Hand-lettered chalk on the diorama's menu board. */
function drawChalk(canvas: HTMLCanvasElement, text: string, aspect: number) {
  const context = canvas.getContext('2d');
  if (!context) return false;
  const W = 640, H = Math.round(W / aspect);
  canvas.width = W; canvas.height = H;
  context.fillStyle = '#2f4a3e'; context.fillRect(0, 0, W, H);
  context.fillStyle = '#ffffff'; context.globalAlpha = .06;
  for (let i = 0; i < 6; i++) {
    context.beginPath(); context.ellipse(W * (.12 + i * .15), H * (.28 + (i % 3) * .22), W * .13, H * .09, i * .7, 0, Math.PI * 2); context.fill();
  }
  context.globalAlpha = 1;
  const family = '"Chalkboard SE","Segoe Print","Bradley Hand","Comic Sans MS",cursive';
  let size = Math.round(H * .3);
  let lines: string[] = [];
  for (; size > 16; size -= 2) {
    context.font = `600 ${size}px ${family}`;
    lines = wrapText(context, text, W * .86);
    if (lines.length * size * 1.15 <= H * .72 && lines.every(line => context.measureText(line).width <= W * .88)) break;
  }
  const lineHeight = size * 1.15;
  const top = H / 2 - (lines.length - 1) * lineHeight / 2 - size * .1;
  context.textAlign = 'center'; context.textBaseline = 'middle';
  context.fillStyle = '#f6f2e4'; context.shadowColor = 'rgba(255,255,255,.4)'; context.shadowBlur = 3;
  lines.forEach((line, i) => context.fillText(line, W / 2, top + i * lineHeight));
  context.shadowBlur = 0;
  const underline = top + (lines.length - 1) * lineHeight + size * .66;
  if (underline < H - 8) {
    context.strokeStyle = 'rgba(240,181,69,.9)'; context.lineWidth = Math.max(3, size * .08); context.lineCap = 'round';
    context.beginPath(); context.moveTo(W * .32, underline); context.quadraticCurveTo(W * .5, underline + size * .14, W * .68, underline - size * .04); context.stroke();
  }
  return true;
}

/** A themed burger-restaurant diorama per lesson. Static shadows are cached; paused scenes render on demand. */
export function createRestaurantWorld(host: HTMLElement, initial: WorldState & { onUnavailable: () => void }): RestaurantWorld {
  let state: WorldState = initial;
  let disposed = false;
  let clock = 0;
  let stepTime = 0;
  let previousTime = 0;
  let reported = false;
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
    gpu.toneMappingExposure = 1.08;
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
  controls.target.set(0, 1.0, .1);
  controls.enablePan = false; controls.enableZoom = false; controls.enableDamping = false;
  controls.minPolarAngle = .4; controls.maxPolarAngle = 1.12;
  controls.minAzimuthAngle = -.1; controls.maxAzimuthAngle = 1.45;
  controls.rotateSpeed = .6;
  canvas.style.touchAction = 'pan-y';
  controls.update();

  const geometries = new Map<string, T.BufferGeometry>();
  const materials = new Map<string, T.Material>();
  const geometry = (key: string, make: () => T.BufferGeometry) => {
    let made = geometries.get(key);
    if (!made) { made = make(); geometries.set(key, made); }
    return made;
  };
  const material = (color: string) => {
    let made = materials.get(color);
    if (!made) {
      made = new T.MeshStandardMaterial({ color, roughness: metallic.has(color) ? .38 : .8, metalness: metallic.has(color) ? .35 : 0 });
      materials.set(color, made);
    }
    return made;
  };
  const glowMaterial = (color: string) => {
    const key = `glow:${color}`;
    let made = materials.get(key);
    if (!made) {
      made = new T.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: gpu ? 1.15 : .45, roughness: .5 });
      materials.set(key, made);
    }
    return made;
  };
  function mesh(parent: T.Object3D, shape: T.BufferGeometry, paint: T.Material, at: Position) {
    const object = new T.Mesh(shape, paint);
    object.position.set(...at); object.castShadow = true; object.receiveShadow = true;
    parent.add(object); return object;
  }
  const boxGeometry = (size: Position, radius: number) => geometry(`b${size}:${radius}`, () => radius >= .025 && Math.min(...size) > .08
    ? new RoundedBoxGeometry(...size, 1, Math.min(radius, ...size.map(v => v / 3)))
    : new T.BoxGeometry(...size));
  const sphereGeometry = (radius: number) => geometry(`s${radius}`, () => new T.SphereGeometry(radius, 14, 10));
  function group(parent: T.Object3D = scene, at: Position = [0, 0, 0]) {
    const object = new T.Group(); object.position.set(...at); parent.add(object); return object;
  }
  const craft: Craft = {
    group,
    box: (parent, size, at, color, radius = .04) => mesh(parent, boxGeometry(size, radius), material(color), at),
    cylinder: (parent, top, bottom, height, at, color, segments = 16) =>
      mesh(parent, geometry(`c${top},${bottom},${height},${segments}`, () => new T.CylinderGeometry(top, bottom, height, segments)), material(color), at),
    sphere: (parent, radius, at, color) => mesh(parent, sphereGeometry(radius), material(color), at),
    torus: (parent, radius, tube, at, color) => mesh(parent, geometry(`t${radius},${tube}`, () => new T.TorusGeometry(radius, tube, 8, 28)), material(color), at),
    cone: (parent, radius, height, at, color, segments = 16) =>
      mesh(parent, geometry(`k${radius},${height},${segments}`, () => new T.ConeGeometry(radius, height, segments)), material(color), at),
    glow: (parent, kind, size, at, color) => {
      const shape = kind === 'sphere' ? sphereGeometry(size as number) : boxGeometry(size as Position, 0);
      const object = mesh(parent, shape, glowMaterial(color), at); object.castShadow = false; return object;
    },
  };
  const restaurantObject = (parent: T.Object3D, kind: RestaurantProp, at: Position, scale = 1) => {
    const object = makeRestaurantObject(craft, parent, kind);
    object.position.set(...at); object.scale.setScalar(scale); return object;
  };

  const ambient = new T.HemisphereLight('#fff3de', '#a7bad5', 2.4); scene.add(ambient);
  const sunlight = new T.DirectionalLight('#fff5df', 3.8);
  sunlight.position.set(-6, 13, 9); sunlight.castShadow = true;
  sunlight.shadow.mapSize.set(1536, 1536);
  Object.assign(sunlight.shadow.camera, { left: -10, right: 10, top: 9, bottom: -9, near: 1, far: 35 });
  sunlight.shadow.normalBias = .04; sunlight.shadow.bias = -.0002;
  scene.add(sunlight);
  const fill = new T.DirectionalLight('#c9e4ff', 1.3); fill.position.set(8, 6, -4); scene.add(fill);
  if (!gpu) { sunlight.intensity = .48; fill.intensity = .16; scene.add(new T.AmbientLight('#e8eef3', .3)); }

  // HTML labels are anchored to furniture or the item being handled, so the
  // text stays crisp and translatable on both renderers.
  const annotations = document.createElement('div');
  annotations.setAttribute('aria-hidden', 'true');
  Object.assign(annotations.style, { position: 'absolute', inset: '0', overflow: 'hidden', pointerEvents: 'none' });
  host.appendChild(annotations);
  const labels: Label[] = [];
  let kitLabels: Label[] = [];
  function label(kind: LabelKind, at: Position = [0, 0, 0], scoped = false) {
    const element = document.createElement('span');
    Object.assign(element.style, {
      position: 'absolute', display: 'block', whiteSpace: 'nowrap', transform: 'translate(-50%,-50%)',
      fontFamily: 'system-ui,sans-serif', fontWeight: '700', lineHeight: '1.3',
    }, labelStyles[kind]);
    annotations.appendChild(element);
    const entry: Label = { element, at: new T.Vector3(...at), visible: () => true };
    (scoped ? kitLabels : labels).push(entry);
    return entry;
  }

  // The display plinth, its brass nameplate and the expansions earned by progress.
  const plinth = group();
  craft.box(plinth, [11.2, .5, 8.25], [0, -.33, .175], C.walnut, .1);
  craft.box(plinth, [11.34, .08, 8.39], [0, -.08, .175], C.darkWood, .04);
  craft.box(plinth, [4.6, .32, .03], [0, -.33, 4.31], '#c9a24a', .012);
  craft.box(plinth, [4.4, .26, .02], [0, -.33, 4.325], '#e2c27a', .008);
  plinth.traverse(object => { object.renderOrder = -20; });
  const plaque = label('plaque', [0, -.33, 4.36]);
  const decor: { level: number; object: T.Group }[] = [];
  const lights = group();
  const cableColors = [C.mustard, C.tomato, C.mint, C.white];
  craft.box(lights, [10.2, .02, .02], [0, 2.84, -3.5], C.ink, 0);
  craft.box(lights, [.02, .02, 7.3], [-5.12, 2.84, .13], C.ink, 0);
  for (let i = 0; i < 21; i++) craft.glow(lights, 'sphere', .055, [-5 + i * .5, 2.78, -3.48], cableColors[i % 4]);
  for (let i = 0; i < 14; i++) craft.glow(lights, 'sphere', .055, [-5.1, 2.78, -3.2 + i * .5], cableColors[(i + 1) % 4]);
  decor.push({ level: 2, object: lights });
  const greenery = group();
  plant(craft, greenery, [-5.25, -.04, 3.95], .7);
  plant(craft, greenery, [5.25, -.04, 3.95], .7);
  plant(craft, greenery, [5.25, -.04, -3.6], .6);
  decor.push({ level: 3, object: greenery });
  const rooftop = group();
  craft.box(rooftop, [1.1, .5, .7], [3.2, 3.0, -3.55], C.steel, .05);
  for (let i = 0; i < 4; i++) craft.box(rooftop, [.9, .025, .02], [3.2, 2.86 + i * .1, -3.19], C.charcoal, 0);
  craft.cylinder(rooftop, .34, .34, .7, [4.4, 3.1, -3.55], C.sky, 18);
  craft.cylinder(rooftop, .36, .36, .06, [4.4, 3.47, -3.55], C.navy, 18);
  craft.cylinder(rooftop, .07, .07, .5, [1.9, 3.0, -3.55], C.chrome, 10);
  decor.push({ level: 4, object: rooftop });
  const neon = group(undefined, [-2.4, 0, -3.55]);
  for (const x of [-1, 1]) craft.box(neon, [.06, .7, .06], [x, 3.0, 0], C.ink, .01);
  craft.box(neon, [2.6, .8, .1], [0, 3.55, 0], C.navy, .04);
  craft.glow(neon, 'box', [2.5, .04, .04], [0, 3.92, .06], C.pink);
  craft.glow(neon, 'box', [2.5, .04, .04], [0, 3.18, .06], C.pink);
  burgerBadge(craft, neon, [-.75, 3.55, .07], 2.4);
  for (let i = 0; i < 3; i++) craft.glow(neon, 'box', [.34, .07, .03], [.1 + i * .42, 3.55, .07], C.mustard);
  decor.push({ level: 5, object: neon });
  const awards = group();
  const rosette = group(awards, [3.3, -.33, 4.34]);
  craft.cylinder(rosette, .2, .2, .03, [0, 0, 0], C.mustard, 20).rotation.x = Math.PI / 2;
  craft.cylinder(rosette, .13, .13, .035, [0, 0, .005], '#e2c27a', 20).rotation.x = Math.PI / 2;
  for (const angle of [-.3, .3]) craft.box(rosette, [.08, .3, .01], [angle * .4, -.22, -.01], C.red, .005).rotation.z = angle;
  const trophy = group(awards, [-5.25, -.04, -3.6]);
  craft.cylinder(trophy, .16, .2, .08, [0, .04, 0], C.walnut, 16);
  craft.cylinder(trophy, .04, .06, .22, [0, .19, 0], '#d9b24c', 10);
  craft.cylinder(trophy, .2, .08, .28, [0, .44, 0], '#d9b24c', 18);
  for (const x of [-.22, .22]) craft.torus(trophy, .07, .018, [x, .46, 0], '#d9b24c');
  decor.push({ level: 6, object: awards });

  // The worker and items of the lesson walk through every themed kit.
  const runner = person(craft, scene, [0, 0, 0], { shirt: C.red, role: 'staff', skin: 0 });
  const arrivingCustomer = person(craft, scene, [0, 0, 0], { shirt: C.blue, role: 'customer', skin: 3, hair: 1 });
  arrivingCustomer.group.userData.restaurantProp = 'customer';
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
  craft.cylinder(inkStamp, .09, .09, .035, [0, 0, 0], '#568c65', 16).rotation.x = Math.PI / 2;
  craft.box(inkStamp, [.035, .11, .018], [-.015, -.005, .025], C.white, .004).rotation.z = .7;
  craft.box(inkStamp, [.035, .17, .018], [.045, .025, .025], C.white, .004).rotation.z = -.55;
  const returnStamp = group(work, [.12, .23, .08]);
  for (const angle of [-.7, .7]) craft.box(returnStamp, [.035, .2, .02], [0, 0, 0], C.red, .005).rotation.z = angle;
  const carriedApproval = inkStamp.clone(); hand.add(carriedApproval);
  const carriedReturn = returnStamp.clone(); hand.add(carriedReturn);
  const pen = group(work, [.28, .1, .07]);
  craft.cylinder(pen, .016, .016, .42, [0, 0, 0], C.navy, 6).rotation.z = -.4;
  const filingTray = group();
  craft.box(filingTray, [.85, .08, .6], [0, 0, 0], C.kraft, .025);
  for (const x of [-.41, .41]) craft.box(filingTray, [.04, .18, .58], [x, .08, 0], C.kraft, .008);
  const barrier = group();
  sawhorse(craft, barrier, [0, 0, 0]);
  const waitingNotice = group();
  craft.box(waitingNotice, [.05, 1.0, .05], [0, .5, 0], C.darkWood, .01);
  craft.box(waitingNotice, [.4, .05, .3], [0, .025, 0], C.darkWood, .01);
  craft.box(waitingNotice, [.8, .46, .04], [0, 1.15, .03], '#fff0d1', .015);
  craft.box(waitingNotice, [.8, .06, .045], [0, 1.4, .03], C.tomato, .01);
  restaurantObject(waitingNotice, 'clock', [-.25, 1.16, .07], .27).rotation.y = .1;
  const faultCone = trafficCone(craft, scene, [0, 0, 0], 1.1);
  const itemLabel = label('paper');
  const extraLabel = label('paper');
  const noticeLabel = label('notice');

  let diorama = fallbackDiorama;
  let kitKey = '';
  let kitRoot: T.Group | null = null;
  let kit: KitBuild | null = null;
  let units: UnitDecor[] = [];
  let boardLabel: Label | null = null;
  let boardCanvas: HTMLCanvasElement | null = null;
  let boardTexture: T.CanvasTexture | null = null;
  let boardAspect = 1.9;
  let boardText = '';
  let locale: 'pt' | 'en' = 'pt';
  let kitState: KitState = { flags: new Set(), values: [], gauge: 0, queue: 1, customers: false, units: [], count: 0 };

  function buildRoom(root: T.Group, walls: KitBuild['walls']) {
    const room = group(root);
    craft.box(room, [10.14, .06, 7.32], [0, -.03, .14], walls.floorA, .02);
    for (let i = 0; i < 10; i++) for (let j = 0; j < 7; j++) {
      if ((i + j) % 2) craft.box(room, [.98, .01, .98], [-4.5 + i, .005, -2.97 + j], walls.floorB, 0).castShadow = false;
    }
    craft.box(room, [10.3, 2.7, .16], [0, 1.35, -3.55], walls.back, .03);
    craft.box(room, [.16, 2.7, 7.36], [-5.15, 1.35, .13], walls.side, .03);
    craft.box(room, [10.14, .9, .03], [0, .45, -3.455], walls.wainscot, .01);
    craft.box(room, [.03, .9, 7.3], [-5.055, .45, .14], walls.wainscot, .01);
    craft.box(room, [10.14, .06, .05], [0, .92, -3.445], walls.trim, .01);
    craft.box(room, [.05, .06, 7.3], [-5.045, .92, .14], walls.trim, .01);
    craft.box(room, [10.14, .1, .04], [0, .05, -3.45], walls.trim, .01);
    craft.box(room, [.04, .1, 7.3], [-5.05, .05, .14], walls.trim, .01);
    craft.box(room, [10.34, .12, .24], [0, 2.74, -3.55], walls.trim, .03);
    craft.box(room, [.24, .12, 7.4], [-5.15, 2.74, .13], walls.trim, .03);
    // The vector renderer uses painter ordering, not a depth buffer. Floors and
    // walls must stay behind furniture and people instead of cutting across them.
    room.traverse(object => { object.renderOrder = -10; });
  }

  function buildKit(key: string) {
    if (kitRoot) scene.remove(kitRoot);
    for (const entry of kitLabels) entry.element.remove();
    kitLabels = [];
    boardTexture?.dispose(); boardTexture = null;
    (materials.get('board') as T.Material | undefined)?.dispose(); materials.delete('board');
    kitKey = key;
    const root = new T.Group(); scene.add(root); kitRoot = root;
    const names = restaurantCopy[locale].stations;
    const info = kits[diorama.kit];
    const build = kitBuilders[diorama.kit]({
      c: craft, root, locale, branch: diorama.branch ?? 2,
      stationName: station => names[station],
      sign: (text, at, kind = 'sign') => {
        const entry = label(kind, at, true);
        entry.element.textContent = localize(text, locale);
        let shown = true;
        entry.visible = () => shown;
        return { show: visible => { shown = visible; }, text: value => { entry.element.textContent = value; } };
      },
    });
    kit = build;
    buildRoom(root, build.walls);
    root.updateMatrixWorld(true);
    root.traverse(object => {
      if (!(object instanceof T.Mesh) || object.renderOrder) return;
      object.geometry.computeBoundingBox();
      const box = object.geometry.boundingBox!;
      if (object.getWorldPosition(new T.Vector3()).y + box.max.y < .06) object.renderOrder = -15;
    });
    const { at, rotationY, width = 1.9, height = 1 } = build.board;
    const board = chalkboard(craft, root, at, rotationY, width, height);
    boardAspect = width / height; boardText = '';
    boardCanvas = gpu ? document.createElement('canvas') : null;
    if (boardCanvas && drawChalk(boardCanvas, ' ', boardAspect)) {
      boardTexture = new T.CanvasTexture(boardCanvas);
      boardTexture.colorSpace = T.SRGBColorSpace;
      boardTexture.anisotropy = gpu!.capabilities.getMaxAnisotropy();
      const paint = new T.MeshBasicMaterial({ map: boardTexture, toneMapped: false });
      materials.set('board', paint);
      const face = new T.Mesh(geometry(`p${width},${height}`, () => new T.PlaneGeometry(width, height)), paint);
      face.position.set(0, 0, .042); board.add(face);
      boardLabel = null;
    } else {
      boardCanvas = null;
      const facing = new T.Vector3(Math.sin(rotationY), 0, Math.cos(rotationY)).multiplyScalar(.1);
      boardLabel = label('chalk', [at[0] + facing.x, at[1], at[2] + facing.z], true);
    }
    units = build.units.map((handle, i) => {
      const marks = {} as Record<UnitMark, T.Group>;
      for (const kind of ['yes', 'no', 'wait'] as const) {
        const token = markToken(craft, root, kind);
        token.position.copy(handle.top).add(new T.Vector3(0, .42, 0)); token.rotation.y = .6;
        marks[kind] = token;
      }
      const cone = trafficCone(craft, root, [handle.floor.x + .5, 0, handle.floor.z + .45]);
      const ring = craft.torus(root, .55, .035, [handle.floor.x, .04, handle.floor.z], C.mustard);
      ring.material = glowMaterial('#ffd36b'); ring.rotation.x = Math.PI / 2; ring.castShadow = false;
      const tag = label('tag', [handle.top.x, handle.top.y, handle.top.z], true);
      tag.element.dataset.unit = localize(info.unitNames[i], locale);
      return { handle, marks, cone, ring, tag, home: handle.root.position.clone(), shown: true };
    });
  }

  function drawBoard(text: string) {
    if (text === boardText) return;
    boardText = text;
    if (boardCanvas && boardTexture) { drawChalk(boardCanvas, text, boardAspect); boardTexture.needsUpdate = true; }
    if (boardLabel) boardLabel.element.textContent = text;
  }

  function applyUnits(states: readonly DioramaUnit[], count: number, reach: number) {
    const named = diorama.kit === 'network' || diorama.kit === 'host';
    units.forEach((unit, i) => {
      const spec = states[i] ?? {};
      const shown = !spec.hidden && i < count;
      unit.shown = shown;
      unit.handle.root.visible = shown;
      unit.handle.root.position.copy(unit.home);
      // An empty bay only appears where this lesson opens or closes a unit.
      if (unit.handle.empty) unit.handle.empty.visible = !shown && (i < reach || !!spec.hidden);
      for (const kind of ['yes', 'no', 'wait'] as const) unit.marks[kind].visible = shown && spec.mark === kind;
      unit.cone.visible = shown && !!spec.down;
      unit.ring.visible = shown && !!(spec.lit || spec.fresh);
      unit.ring.scale.setScalar(1);
      const parts = [named ? unit.tag.element.dataset.unit ?? '' : '', localize(spec.tag, locale)].filter(Boolean);
      if (spec.down) parts.push(locale === 'pt' ? 'fechado' : 'closed');
      unit.tag.element.textContent = parts.join(' · ');
      unit.tag.visible = () => unit.shown && parts.length > 0;
    });
  }

  let beat: RestaurantBeat = { action: 'handover', copies: 1, carry: true };
  let visual: LessonVisual = initial.visual ?? { from: 'entrance', to: 'counter', cue: 'flow', prop: 'order' };
  let currentProp: RestaurantProp = 'order';
  let fromPlace: StationPlace = { floor: new T.Vector3(), surface: new T.Vector3() };
  let toPlace: StationPlace = fromPlace;
  let walk: T.Vector3[] = [];
  const placeFor = (station: Station) => kit!.resolve?.(station, kitState) ?? kit!.stations[station];
  function pointOnWalk(amount: number, target: T.Vector3) {
    const lengths = walk.slice(1).map((point, i) => point.distanceTo(walk[i]));
    let remaining = amount * lengths.reduce((sum, length) => sum + length, 0);
    for (let i = 0; i < lengths.length; i++) {
      if (remaining <= lengths[i] || i === lengths.length - 1) {
        const fraction = lengths[i] ? T.MathUtils.clamp(remaining / lengths[i], 0, 1) : 0;
        target.copy(walk[i]).lerp(walk[i + 1], fraction);
        return walk[i + 1].clone().sub(walk[i]);
      }
      remaining -= lengths[i];
    }
    target.copy(walk[0]);
    return new T.Vector3();
  }
  function placeOnWalk(object: T.Object3D, amount: number) {
    const direction = pointOnWalk(amount, object.position);
    if (direction.lengthSq() > .001) object.rotation.y = Math.atan2(direction.x, direction.z);
  }
  const face = (object: T.Object3D, target: T.Vector3) => {
    const dx = target.x - object.position.x, dz = target.z - object.position.z;
    if (dx * dx + dz * dz > .001) object.rotation.y = Math.atan2(dx, dz);
  };
  const surfacePoint = (place: StationPlace) => place.surface.clone().add(new T.Vector3(0, flatProps.includes(currentProp) ? .05 : .34, 0));

  function configure(next: WorldState, first = false) {
    const changedStep = first || state.step !== next.step || state.mode !== next.mode || state.lesson !== next.lesson
      || JSON.stringify(state.visual) !== JSON.stringify(next.visual);
    state = next;
    if (changedStep) { stepTime = 0; reported = false; }
    locale = state.locale ?? 'pt';
    diorama = (state.lesson && getLessonDiorama(state.lesson)) || fallbackDiorama;
    const key = `${diorama.kit}:${diorama.branch ?? 2}:${locale}`;
    if (key !== kitKey) buildKit(key);
    visual = state.visual ?? { from: 'entrance', to: state.focus, cue: 'flow', prop: 'order' };
    currentProp = visual.prop; beat = getRestaurantBeat(visual);
    const info = kits[diorama.kit];
    const set = diorama.steps[state.step] ?? {};
    const unitStates = Array.from({ length: info.units }, (_, i) => normalizeUnit(set.units?.[i]));
    kitState = {
      flags: new Set(set.flags ?? []), values: set.values ?? [], gauge: set.gauge ?? 0,
      queue: visual.queueDepth ?? (beat.action === 'queue' ? 5 : 1), customers: currentProp === 'customer',
      units: unitStates, count: set.count ?? info.defaultCount ?? info.units,
    };
    kit!.apply(kitState);
    applyUnits(unitStates, kitState.count, Math.max(...diorama.steps.map(step => step.count ?? info.defaultCount ?? info.units)));
    drawBoard(localize(set.board ?? diorama.board, locale));
    plaque.element.innerHTML = '';
    const kitTitle = document.createElement('small');
    Object.assign(kitTitle.style, { display: 'block', fontSize: '8px', letterSpacing: '.12em', textTransform: 'uppercase', fontFamily: 'system-ui,sans-serif' });
    kitTitle.textContent = info.title[locale];
    plaque.element.append(kitTitle, document.createTextNode(state.title ?? restaurantCopy[locale].name));
    for (const item of decor) item.object.visible = state.level >= item.level;

    fromPlace = placeFor(visual.from); toPlace = placeFor(visual.to);
    walk = [fromPlace.floor, ...(kit!.route?.(fromPlace.floor, toPlace.floor) ?? []), toPlace.floor];
    work.position.copy(surfacePoint(toPlace)); work.rotation.set(0, .35, 0);
    secondWork.position.copy(work.position).add(new T.Vector3(.6, 0, .12)); secondWork.rotation.set(0, -.2, 0);
    if (beat.action === 'copy') secondWork.position.copy(surfacePoint(fromPlace));
    for (const holder of [hand, work, secondWork, ...peerWork]) showObject(holder, currentProp);
    runner.group.visible = currentProp !== 'customer' && beat.action !== 'queue';
    arrivingCustomer.group.visible = currentProp === 'customer';
    const peerIndices = (kit!.peerUnits ?? units.map((_, i) => i)).filter(i => units[i]?.shown && !unitStates[i]?.down);
    peerWork.forEach((holder, i) => {
      const unit = units[peerIndices[i]];
      holder.visible = !!unit && (beat.action === 'copy' || beat.action === 'approve') && !!visual.peers;
      if (unit) holder.position.copy(unit.handle.surface).add(new T.Vector3(0, flatProps.includes(currentProp) ? .05 : .26, 0));
      holder.rotation.set(0, .3, 0); holder.scale.setScalar(.65);
    });
    filingTray.position.copy(toPlace.surface).add(new T.Vector3(.55, .04, .15));
    filingTray.visible = ['file-duplicate', 'return', 'sort'].includes(beat.action);

    const along = new T.Vector3();
    const direction = pointOnWalk(.66, along);
    if (direction.lengthSq() < .001) direction.set(1, 0, 0);
    direction.y = 0; direction.normalize();
    barrier.visible = !!visual.blocked;
    barrier.position.copy(along).setY(0); barrier.rotation.y = Math.atan2(direction.x, direction.z);
    waitingNotice.visible = !!visual.blocked || !!visual.fault;
    faultCone.visible = !!visual.fault;
    if (visual.fault) {
      const fault = placeFor(visual.fault).floor;
      faultCone.position.set(fault.x + .45, 0, fault.z + .4);
    }
    if (visual.blocked) waitingNotice.position.copy(barrier.position).add(new T.Vector3(direction.z, 0, -direction.x).multiplyScalar(.95));
    else if (visual.fault) waitingNotice.position.copy(faultCone.position).add(new T.Vector3(.5, 0, .15));
    waitingNotice.rotation.y = .5;

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
    noticeLabel.at.copy(waitingNotice.position).add(new T.Vector3(.1, 1.15, .1));
    noticeLabel.visible = () => waitingNotice.visible;
    extraLabel.visible = () => secondWork.visible;
    host.dataset.restaurantProp = currentProp; host.dataset.restaurantAction = beat.action;
    host.dataset.restaurantDetail = visual.detail ?? '';
    if (gpu) gpu.shadowMap.needsUpdate = true;
    updateFrame(0); if (!first) resize(); render(); schedule();
  }

  function updateFrame(delta: number, activeElapsed = delta) {
    const teaching = state.playing && !state.reducedMotion;
    if (teaching) { clock += delta; stepTime += activeElapsed; }
    const phase = stepTime > 0 ? T.MathUtils.clamp(stepTime / 3.5, 0, 1) : teaching ? 0 : .88;
    let travel = T.MathUtils.smoothstep(phase, .06, .78);
    if (beat.action === 'return') travel = phase < .5 ? phase * 1.5 : 1.5 * (1 - phase);
    if (beat.action === 'retry') travel = phase < .5 ? phase * 1.5 : (phase - .5) * 2;
    if (visual.blocked) travel = Math.min(travel, .55);
    placeOnWalk(runner.group, travel); placeOnWalk(arrivingCustomer.group, travel);
    const customer = currentProp === 'customer';
    if (!beat.carry && !customer) {
      runner.group.position.copy(toPlace.floor);
      face(runner.group, toPlace.surface);
    } else if (travel > .97) {
      face(runner.group, toPlace.surface); face(arrivingCustomer.group, toPlace.surface);
    }
    runner.arms.forEach(arm => { arm.rotation.x = -.85; });
    arrivingCustomer.arms[1].rotation.x = -.3;
    for (const walker of [runner, arrivingCustomer]) walker.legs.forEach((leg, i) => {
      leg.rotation.x = teaching && travel > 0 && travel < .97 ? Math.sin(clock * 7 + i * Math.PI) * .34 : 0;
    });
    // A handover ends with the object resting on the destination's counter.
    // Doors lead outside the diorama, so the worker keeps the item in hand there.
    const atDoor = !!toPlace.door;
    const delivered = beat.carry && travel > .96 && !customer && !atDoor;
    hand.visible = !customer && (beat.carry ? !delivered : atDoor);
    work.visible = !customer && !atDoor && (!beat.carry || delivered);
    secondWork.visible = (beat.copies > 1 && !beat.carry) || beat.action === 'copy' || beat.action === 'refund';
    if (beat.action === 'file-duplicate') {
      secondWork.visible = true;
      secondWork.position.copy(filingTray.position).add(new T.Vector3(0, .09, 0));
      secondWork.rotation.x = -Math.PI / 2;
    }
    const stamping = beat.stamp && phase > .45;
    inkStamp.visible = !!stamping && beat.stamp !== 'rejected'; returnStamp.visible = !!stamping && beat.stamp === 'rejected';
    carriedApproval.visible = !!stamping && beat.stamp !== 'rejected'; carriedReturn.visible = !!stamping && beat.stamp === 'rejected';
    pen.visible = beat.action === 'write';
    pen.position.x = .12 + (teaching ? Math.sin(clock * 6) * .14 : 0);
    work.rotation.x = flatProps.includes(currentProp) ? 0 : -.12;
    work.rotation.z = beat.action === 'read' && teaching ? Math.sin(clock * 2) * .035 : 0;
    peerWork.forEach((holder, i) => { if (holder.visible) holder.rotation.y = .3 + (teaching && beat.action === 'approve' ? Math.sin(clock * 2 + i) * .08 : 0); });
    units.forEach((unit, i) => {
      const spec = kitState.units[i] ?? {};
      if (!unit.shown) return;
      const settle = spec.fresh && teaching ? T.MathUtils.smoothstep(phase, 0, .45) : 1;
      unit.handle.root.position.y = unit.home.y + (1 - settle) * 2.4;
      unit.ring.scale.setScalar(teaching ? 1 + Math.sin(clock * 4) * .08 : 1);
      for (const token of Object.values(unit.marks)) token.position.y = unit.handle.top.y + .42 + (teaching ? Math.sin(clock * 3 + i) * .04 : 0);
      unit.tag.at.set(unit.handle.top.x, unit.handle.top.y + (unit.handle.root.position.y - unit.home.y), unit.handle.top.z);
    });
    kit?.animate?.(clock, teaching, phase);
    itemLabel.at.copy(work.visible ? work.position : customer ? arrivingCustomer.group.position : runner.group.position);
    itemLabel.at.y += work.visible ? .45 : 1.85;
    extraLabel.at.copy(secondWork.position).add(new T.Vector3(0, .45, 0));
    if (teaching && stepTime >= 4 && !reported) { reported = true; initial.onStepComplete?.(); }
  }
  const projected = new T.Vector3();
  function render() {
    if (disposed) return;
    renderer.render(scene, camera); if (!gpu) canvas.style.backgroundColor = 'transparent';
    for (const entry of [...labels, ...kitLabels]) {
      projected.copy(entry.at).project(camera);
      entry.element.style.display = entry.visible() && projected.z >= -1 && projected.z <= 1 ? 'block' : 'none';
      entry.element.style.left = `${(projected.x + 1) * .5 * host.clientWidth}px`;
      entry.element.style.top = `${(1 - projected.y) * .5 * host.clientHeight}px`;
    }
  }
  function schedule() {
    previousTime = 0;
    if (state.playing && !state.reducedMotion) setLoop(time => {
      if (disposed) return;
      const elapsed = previousTime ? Math.max(0, (time - previousTime) / 1000) : 0;
      previousTime = time;
      // Bound pose interpolation, not the lesson clock. A slow GPU must not
      // stretch four seconds of active teaching into dozens of seconds.
      updateFrame(Math.min(elapsed, gpu ? .05 : .15), elapsed); render();
      if (!state.playing || state.reducedMotion) setLoop(null);
    });
    else setLoop(null);
  }
  const renderOnChange = () => render(); controls.addEventListener('change', renderOnChange);
  const resize = () => {
    const width = Math.max(host.clientWidth, 1); const height = Math.max(host.clientHeight, 1);
    const aspect = width / height;
    const view = Math.max(5.2, 7.7 / aspect);
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
      geometries.forEach(shape => shape.dispose()); materials.forEach(paint => paint.dispose()); boardTexture?.dispose();
      gpu?.dispose(); gpu?.forceContextLoss(); annotations.remove();
      if (positionHost) host.style.position = previousHostPosition;
      delete host.dataset.restaurantProp; delete host.dataset.restaurantAction; delete host.dataset.restaurantDetail;
      if (canvas.parentNode === host) host.removeChild(canvas);
    },
  };
}
