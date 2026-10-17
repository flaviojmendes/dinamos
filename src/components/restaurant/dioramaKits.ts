import * as T from 'three';
import type { LocalizedText, Station } from './learningModel';
import type { DioramaUnit, KitFlag, KitId } from './dioramas';
import {
  C, type Craft, type Position, bell, breakerPanel, burger, burgerBadge, chair, chalkboard, counter, desk, door, fries, grill, hood,
  kiosk, lamp, person, plant, podium, register, rope, sauces, scooter, shelf, soda, stanchion, stool, table, ticket, ticketRail, trafficCone,
} from './dioramaCraft';

export interface StationPlace { floor: T.Vector3; surface: T.Vector3; door?: boolean }
export interface UnitHandle {
  root: T.Object3D;
  top: T.Vector3;
  floor: T.Vector3;
  surface: T.Vector3;
  empty?: T.Object3D;
}
export interface KitState {
  flags: ReadonlySet<KitFlag>;
  values: readonly number[];
  gauge: number;
  queue: number;
  customers: boolean;
  units: readonly DioramaUnit[];
  count: number;
}
export interface SignHandle { show: (visible: boolean) => void; text: (value: string) => void }
export interface KitContext {
  c: Craft;
  root: T.Group;
  locale: 'pt' | 'en';
  branch: number;
  stationName: (station: Station) => string;
  sign: (text: string | LocalizedText, at: Position, kind?: 'sign' | 'chalk' | 'tag') => SignHandle;
}
export interface Walls { back: string; side: string; wainscot: string; floorA: string; floorB: string; trim: string }
export interface KitBuild {
  walls: Walls;
  stations: Record<Station, StationPlace>;
  units: UnitHandle[];
  peerUnits?: number[];
  board: { at: Position; rotationY: number; width?: number; height?: number };
  route?: (from: T.Vector3, to: T.Vector3) => T.Vector3[];
  resolve?: (station: Station, state: KitState) => StationPlace | undefined;
  apply: (state: KitState) => void;
  animate?: (clock: number, teaching: boolean, phase: number) => void;
}

const v = (x: number, y: number, z: number) => new T.Vector3(x, y, z);
const place = (fx: number, fz: number, sx: number, sy: number, sz: number): StationPlace => ({ floor: v(fx, .05, fz), surface: v(sx, sy, sz) });
const BACK = -3.47, LEFT = -5.07;

/** A labeled door stands in for a station that sits just outside this diorama. */
function backDoor(ctx: KitContext, station: Station, x: number, color = C.teal): StationPlace {
  door(ctx.c, ctx.root, [x, 0, BACK], 0, color);
  ctx.sign(ctx.stationName(station), [x, 2.35, BACK + .1]);
  return { ...place(x, BACK + .75, x, 1.05, BACK + .55), door: true };
}
function sideDoor(ctx: KitContext, station: Station, z: number, color = C.teal): StationPlace {
  door(ctx.c, ctx.root, [LEFT, 0, z], Math.PI / 2, color);
  ctx.sign(ctx.stationName(station), [LEFT + .1, 2.35, z]);
  return { ...place(LEFT + .75, z, LEFT + .55, 1.05, z), door: true };
}
function emptyBay(c: Craft, parent: T.Object3D, at: Position, width: number, depth: number) {
  const g = c.group(parent, at);
  const dashes = Math.round(width / .3);
  for (let i = 0; i < dashes; i++) for (const z of [-depth / 2, depth / 2]) c.box(g, [.16, .012, .05], [-width / 2 + (i + .5) * width / dashes, .02, z], C.mustard, .004).castShadow = false;
  const rows = Math.round(depth / .3);
  for (let i = 0; i < rows; i++) for (const x of [-width / 2, width / 2]) c.box(g, [.05, .012, .16], [x, .02, -depth / 2 + (i + .5) * depth / rows], C.mustard, .004).castShadow = false;
  return g;
}
function queueLine(c: Craft, parent: T.Object3D, start: Position, step: Position, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const p = person(c, parent, [start[0] + step[0] * i, 0, start[2] + step[2] * i], { shirt: [C.blue, C.mustard, C.lilac, C.green, C.pink, C.sky, C.teal][i % 7], skin: i + 1, hair: i });
    p.group.rotation.y = Math.atan2(-step[0], -step[2]);
    return p;
  });
}
function show(objects: readonly T.Object3D[], count: number) { objects.forEach((object, i) => { object.visible = i < count; }); }
function tableSet(c: Craft, parent: T.Object3D, at: Position) {
  table(c, parent, at);
  chair(c, parent, [at[0] - .75, 0, at[2]], C.red, Math.PI / 2);
  chair(c, parent, [at[0] + .75, 0, at[2]], C.red, -Math.PI / 2);
  burger(c, parent, [at[0] - .15, .82, at[2]], .55);
  fries(c, parent, [at[0] + .18, .82, at[2] - .1], .7);
  soda(c, parent, [at[0] + .2, .82, at[2] + .2], C.red, .7);
}
function heatShelf(c: Craft, parent: T.Object3D, at: Position, width: number) {
  const g = c.group(parent, at);
  for (const x of [-width / 2 + .05, width / 2 - .05]) c.box(g, [.05, .7, .05], [x, .35, 0], C.chrome, .01);
  c.box(g, [width, .06, .5], [0, .72, 0], C.chrome, .02);
  for (let i = 0; i < Math.round(width / .5); i++) c.glow(g, 'box', [.3, .03, .12], [-width / 2 + .3 + i * .5, .68, 0], '#ffb36b');
  return g;
}
function bagShelf(c: Craft, parent: T.Object3D, at: Position, width: number) {
  const g = shelf(c, parent, at, width, 1.6, .5, 'none', C.chrome);
  for (let row = 0; row < 2; row++) for (let i = 0; i < 3; i++) {
    const bag = c.group(g, [-width / 2 + .35 + i * (width - .7) / 2, .62 + row * .52, .02]);
    c.box(bag, [.32, .34, .24], [0, .17, 0], C.kraft, .02);
    burgerBadge(c, bag, [0, .19, .125], .7);
  }
  return g;
}
function supplyPallet(c: Craft, parent: T.Object3D, at: Position) {
  const g = c.group(parent, at);
  c.box(g, [1.1, .1, .9], [0, .05, 0], C.wood, .015);
  for (const x of [-.4, 0, .4]) c.box(g, [.12, .06, .9], [x, .13, 0], C.darkWood, .01);
  for (const [x, y, z] of [[-.27, .36, -.2], [.27, .36, -.2], [-.27, .36, .22], [.27, .36, .22], [0, .74, 0]] as Position[]) {
    c.box(g, [.5, .38, .4], [x, y, z], y > .5 ? '#d7b98d' : C.kraft, .02);
    burgerBadge(c, g, [x, y + .02, z + .205], .7);
  }
  return g;
}
function smoke(c: Craft, parent: T.Object3D, at: Position) {
  return Array.from({ length: 5 }, (_, i) => c.sphere(parent, .16 + i * .03, [at[0] + (i % 2 ? .1 : -.1), at[1] + i * .25, at[2]], '#8c9196'));
}
type KitBuilder = (ctx: KitContext) => KitBuild;

const line: KitBuilder = (ctx) => {
  const { c, root } = ctx;
  hood(c, root, [-1.7, 2.25, -2.95], 3.1);
  grill(c, root, [-2.5, 0, -2.95], 1.3, 3);
  grill(c, root, [-1.05, 0, -2.95], 1.3, 2);
  const rail = ticketRail(c, root, [-1.7, 1.9, -2.45], 2.9, 8);
  const cook = c.group(root);
  person(c, cook, [-1.8, 0, -2.0], { shirt: C.white, role: 'cook', skin: 1 });
  counter(c, root, [-2.5, 0, .3], 3.6, .8, C.red);
  register(c, root, [-3.4, 1.02, .3]);
  sauces(c, root, [-1.4, 1.02, .4]);
  const cashier = c.group(root);
  const cashierPerson = person(c, cashier, [-3.4, 0, -.45], { shirt: C.red, role: 'staff', skin: 3 });
  counter(c, root, [1.6, 0, .3], 2, .8, C.teal);
  heatShelf(c, root, [1.6, 1.02, .25], 1.9);
  const bellObject = bell(c, root, [2.35, 1.02, .55]);
  const trays = [burger(c, root, [1.2, 1.05, .25], .6), fries(c, root, [1.75, 1.03, .25], .7)];
  const pickup = c.group(root);
  person(c, pickup, [1.6, 0, -.45], { shirt: C.teal, role: 'staff', skin: 4, hair: 2 });
  shelf(c, root, [3.0, 0, -3.1], 1.4, 2, .55, 'crates');
  desk(c, root, [4.1, 0, -1.4], 1.2);
  chair(c, root, [4.15, 0, -2.15], C.navy);
  person(c, root, [4.6, 0, -1.0], { shirt: C.green, role: 'manager', skin: 2 }).group.rotation.y = -1.6;
  lamp(c, root, [4.45, .86, -1.6]);
  scooter(c, root, [4.0, 0, 3.05], C.mint, -.3);
  podium(c, root, [-1.9, 0, 3.0], C.red);
  for (const x of [-1.6, -.95]) stool(c, root, [x, 0, 1.15]);
  tableSet(c, root, [.9, 0, 2.5]);
  plant(c, root, [-4.6, 0, 3.2]);
  const queue = queueLine(c, root, [-3.4, 0, 1.25], [0, 0, .55], 5);
  const buzzer = c.group(root, [.6, .84, 2.5]);
  c.box(buzzer, [.18, .04, .18], [0, 0, 0], C.ink, .03);
  const buzzerLight = c.glow(buzzer, 'sphere', .05, [0, .04, 0], C.tomato);
  const buzzerReady = c.glow(buzzer, 'sphere', .055, [0, .045, 0], '#57d07f');
  const timer = c.group(root, [-.1, 1.75, -3.42]);
  c.cylinder(timer, .36, .36, .06, [0, 0, 0], C.ink, 24).rotation.x = Math.PI / 2;
  c.cylinder(timer, .31, .31, .065, [0, 0, .01], C.white, 24).rotation.x = Math.PI / 2;
  const hand = c.box(timer, [.03, .24, .02], [0, .1, .05], C.red, .005);
  const form = c.group(root, [-2.75, 1.03, .35]);
  c.box(form, [.38, .03, .48], [0, 0, 0], C.darkWood, .01);
  c.box(form, [.32, .015, .4], [0, .02, 0], C.paper, .005);
  for (let i = 0; i < 4; i++) c.box(form, [.26, .008, .02], [0, .03, -.13 + i * .09], C.teal, .002);
  const toggle = c.group(root, [-4.1, 1.03, .45]);
  c.box(toggle, [.36, .26, .06], [0, .13, 0], C.ink, .02);
  const lever = c.group(toggle, [0, .13, .04]);
  c.box(lever, [.06, .16, .05], [0, .07, 0], C.mustard, .01);
  const toggleLight = c.glow(toggle, 'sphere', .035, [.12, .22, .04], '#57d07f');
  const toggleOff = c.glow(toggle, 'sphere', .035, [.12, .22, .04], C.tomato);
  const stations: Record<Station, StationPlace> = {
    entrance: place(-2.5, 2.6, -1.9, 1.1, 3.0),
    counter: place(-2.4, -.45, -2.4, 1.05, .3),
    kitchen: place(-1.0, -1.9, -1.4, 1.08, -2.6),
    pickup: place(.95, -.5, 1.0, 1.05, .3),
    stock: place(3.0, -2.4, 3.0, 1.1, -2.85),
    terminal: place(3.4, -1.4, 3.85, .9, -1.4),
    dispatch: place(3.1, 2.4, 3.6, 1.16, 3.1),
    branch: sideDoor(ctx, 'branch', -1.6),
  };
  return {
    walls: { back: '#f3e3cf', side: '#f3e3cf', wainscot: C.red, floorA: '#f4efe6', floorB: '#2f3a52', trim: C.ink },
    stations,
    units: [
      { root: cashier, top: v(-3.4, 2.1, -.45), floor: v(-3.4, .05, -.45), surface: v(-3.4, 1.05, .3) },
      { root: cook, top: v(-1.8, 2.15, -2.0), floor: v(-1.8, .05, -2.0), surface: v(-1.8, 1.08, -2.6) },
      { root: pickup, top: v(1.6, 2.1, -.45), floor: v(1.6, .05, -.45), surface: v(1.6, 1.05, .3) },
    ],
    board: { at: [.95, 1.75, -3.44], rotationY: 0, width: 1.7 },
    route: (a, b) => (a.z > .3) !== (b.z > .3) ? [v(-.05, .05, .3)] : [],
    apply: (state) => {
      show(rail.tickets, state.customers ? 1 : Math.max(1, state.queue));
      show(queue.map(p => p.group), state.customers ? Math.max(1, state.queue) : 1);
      buzzer.visible = state.flags.has('buzzer');
      timer.visible = state.flags.has('timer');
      form.visible = state.flags.has('form');
      toggle.visible = state.flags.has('toggle');
      lever.rotation.z = state.gauge > .5 ? -.6 : .6;
      toggleLight.visible = state.gauge > .5; toggleOff.visible = state.gauge <= .5;
      trays.forEach(item => { item.visible = !state.flags.has('timer'); });
      cashierPerson.arms[1].rotation.x = -.6;
    },
    animate: (clock, teaching, phase) => {
      bellObject.rotation.z = teaching ? Math.sin(clock * 22) * .12 : 0;
      const ready = phase > .55;
      buzzerLight.visible = !ready; buzzerReady.visible = ready;
      hand.rotation.z = -phase * Math.PI * 1.6;
      hand.position.set(Math.sin(phase * Math.PI * 1.6) * .1, Math.cos(phase * Math.PI * 1.6) * .1, .05);
    },
  };
};

const rail: KitBuilder = (ctx) => {
  const { c, root } = ctx;
  const pass = c.group(root, [-.2, 0, -.5]);
  c.box(pass, [5.6, .95, .7], [0, .48, 0], C.steel, .05);
  c.box(pass, [5.7, .07, .78], [0, .98, 0], C.chrome, .02);
  for (const x of [-2.75, 2.75]) c.box(pass, [.06, .9, .06], [x, 1.45, 0], C.chrome, .01);
  c.box(pass, [5.6, .07, .5], [0, 1.92, 0], C.chrome, .02);
  for (let i = 0; i < 6; i++) c.glow(pass, 'box', [.4, .03, .14], [-2.3 + i * .92, 1.87, 0], '#ffb36b');
  const ticketBar = ticketRail(c, root, [-.2, 1.78, -.2], 5.2, 8);
  const units: UnitHandle[] = [-2.2, -.2, 1.8].map((x, i) => {
    const g = c.group(root);
    hood(c, g, [x, 2.3, -3.0], 1.6);
    grill(c, g, [x, 0, -3.0], 1.3, 2 + (i % 2));
    person(c, g, [x, 0, -1.65], { shirt: C.white, role: 'cook', skin: i * 2, hair: i });
    return { root: g, top: v(x, 2.35, -1.65), floor: v(x, .05, -1.65), surface: v(x, 1.08, -2.7), empty: emptyBay(c, root, [x, 0, -2.2], 1.6, 1.6) };
  });
  counter(c, root, [-3.6, 0, 1.4], 1.6, .8, C.red);
  register(c, root, [-3.9, 1.02, 1.4]);
  person(c, root, [-3.6, 0, .65], { shirt: C.red, role: 'staff', skin: 3 });
  counter(c, root, [3.5, 0, 1.2], 1.5, .8, C.teal);
  const bellObject = bell(c, root, [3.9, 1.02, 1.4]);
  burger(c, root, [3.2, 1.05, 1.2], .55);
  shelf(c, root, [-4.0, 0, -3.1], 1.3, 1.9, .55, 'crates');
  desk(c, root, [3.95, 0, -1.6], 1.1);
  person(c, root, [4.5, 0, -2.25], { shirt: C.green, role: 'manager', skin: 2 }).group.rotation.y = -.4;
  plant(c, root, [4.6, 0, 3.2]);
  stool(c, root, [2.4, 0, 2.1]);
  const diary = c.group(root, [.7, 0, 1.9]);
  c.box(diary, [.12, 1.0, .12], [0, .5, 0], C.darkWood, .02);
  const lectern = c.box(diary, [.9, .06, .62], [0, 1.03, 0], C.darkWood, .02); lectern.rotation.x = -.3;
  const book = c.group(diary, [0, 1.1, 0]); book.rotation.x = -.3;
  c.box(book, [.86, .05, .56], [0, 0, 0], C.teal, .02);
  for (const x of [-.21, .21]) { c.box(book, [.4, .04, .5], [x, .04, 0], C.paper, .01); for (let r = 0; r < 5; r++) c.box(book, [.3, .008, .015], [x, .065, -.18 + r * .09], C.ink, .002); }
  const ribbons = [C.red, C.mustard, C.lilac].map((color, i) => c.box(book, [.04, .02, .5], [-.3 + i * .18, .02, .45], color, .005));
  const stub = ticket(c, book, [.32, .1, .1], C.mustard); stub.rotation.x = -Math.PI / 2;
  const trays = [-1.8, -.6, .6].map((x, i) => {
    const g = c.group(root, [x, 1.02, -.35]);
    c.box(g, [.7, .04, .45], [0, 0, 0], ['#d4dfe0', '#e7d7c2', '#d4dfe0'][i], .02);
    for (const sx of [-.33, .33]) c.box(g, [.03, .07, .43], [sx, .035, 0], C.steel, .005);
    for (let k = 0; k < 2 + i; k++) { const tk = ticket(c, g, [-.18 + k * .14, .03, 0], C.red); tk.rotation.x = -Math.PI / 2; }
    return g;
  });
  const trayLabels = ['12:25', '12:30', '12:35'].map((label, i) => ctx.sign(label, [-1.8 + i * 1.2, 1.25, -.1], 'tag'));
  const gate = c.group(root, [-2.6, 0, 2.75]);
  c.cylinder(gate, .1, .12, 1.0, [0, .5, 0], C.chrome, 12);
  const arms = c.group(gate, [0, .9, 0]);
  for (let i = 0; i < 3; i++) { const arm = c.box(arms, [.6, .04, .04], [.3, 0, 0], C.chrome, .01); arm.rotation.y = i * Math.PI * 2 / 3; arm.position.set(Math.cos(i * Math.PI * 2 / 3) * .3, 0, -Math.sin(i * Math.PI * 2 / 3) * .3); }
  const gateGo = c.glow(gate, 'sphere', .06, [0, 1.06, 0], '#57d07f');
  const gateStop = c.glow(gate, 'sphere', .06, [0, 1.06, 0], C.tomato);
  const pause = c.group(root, [-2.5, 0, 2.0]);
  for (const r of [-.3, .3]) { const leg = c.box(pause, [.55, .9, .04], [0, .44, r * .3], C.white, .02); leg.rotation.x = r; }
  c.box(pause, [.5, .16, .06], [0, .62, .14], C.tomato, .01);
  const pauseSign = ctx.sign({ pt: 'Pausa', en: 'Paused' }, [-2.5, 1.15, 2.0], 'tag');
  const exceptions = c.group(root, [-4.2, 0, -1.4]);
  c.box(exceptions, [.9, .06, .7], [0, .78, 0], C.wood, .02);
  for (const [x, z] of [[-.4, -.3], [.4, -.3], [-.4, .3], [.4, .3]]) c.box(exceptions, [.05, .76, .05], [x, .38, z], C.darkWood, .01);
  c.box(exceptions, [.6, .08, .45], [0, .85, 0], C.tomato, .02);
  const bad = ticket(c, exceptions, [0, .91, 0], C.tomato); bad.rotation.x = -Math.PI / 2;
  const stations: Record<Station, StationPlace> = {
    entrance: place(-3.6, 3.0, -2.6, 1.1, 2.75),
    counter: place(-2.6, .65, -3.2, 1.05, 1.4),
    kitchen: place(-.2, .3, -.2, 1.06, -.45),
    pickup: place(3.0, 1.9, 3.5, 1.05, 1.2),
    stock: place(-3.9, -.6, -4.2, .92, -1.4),
    terminal: place(3.3, -1.0, 3.8, .9, -1.6),
    dispatch: backDoor(ctx, 'dispatch', 3.9, C.red),
    branch: sideDoor(ctx, 'branch', .2),
  };
  return {
    walls: { back: '#e9eef0', side: '#e9eef0', wainscot: C.teal, floorA: '#e9e3d8', floorB: '#c9bfb0', trim: C.navy },
    stations, units,
    board: { at: [LEFT + .04, 1.7, -1.6], rotationY: Math.PI / 2, width: 1.6 },
    resolve: (station, state) => {
      if (station !== 'kitchen') return undefined;
      const index = state.units.findIndex(unit => unit.lit);
      return index >= 0 ? { floor: v(units[index].floor.x, .05, .3), surface: v(units[index].floor.x, 1.06, -.45) } : undefined;
    },
    apply: (state) => {
      show(ticketBar.tickets, Math.max(1, state.queue));
      diary.visible = state.flags.has('diary') || state.flags.has('stub');
      ribbons.forEach(r => { r.visible = state.flags.has('diary'); });
      stub.visible = state.flags.has('stub');
      trays.forEach(tray => { tray.visible = state.flags.has('trays'); });
      trayLabels.forEach(label => label.show(state.flags.has('trays')));
      gate.visible = state.flags.has('gate');
      gateGo.visible = state.gauge < .5; gateStop.visible = state.gauge >= .5;
      arms.rotation.y = state.gauge >= .5 ? 0 : .5;
      pause.visible = state.flags.has('pause'); pauseSign.show(state.flags.has('pause'));
      exceptions.visible = state.flags.has('exceptions');
    },
    animate: (clock, teaching) => { bellObject.rotation.z = teaching ? Math.sin(clock * 22) * .1 : 0; },
  };
};

const grills: KitBuilder = (ctx) => {
  const { c, root } = ctx;
  const xs = [-3.5, -1.5, .5, 2.5];
  const grillsBuilt: T.Group[] = [];
  const units: UnitHandle[] = xs.map((x, i) => {
    const g = c.group(root);
    hood(c, g, [x, 2.3, -3.0], 1.75);
    grillsBuilt.push(grill(c, g, [x, 0, -3.0], 1.3, 3));
    person(c, g, [x, 0, -2.1], { shirt: C.white, role: 'cook', skin: i + 1, hair: i });
    return { root: g, top: v(x, 2.3, -2.1), floor: v(x, .05, -1.45), surface: v(x, 1.08, -2.7), empty: emptyBay(c, root, [x, 0, -2.6], 1.7, 1.5) };
  });
  const tickets = ticketRail(c, root, [-.5, 1.95, -2.5], 7.2, 8);
  const hostDesk = podium(c, root, [-.5, 0, 1.6], C.red);
  const host = person(c, root, [-.5, 0, .95], { shirt: C.red, role: 'staff', skin: 4 });
  counter(c, root, [-3.4, 0, .9], 1.8, .8, C.red);
  register(c, root, [-3.6, 1.02, .9]);
  person(c, root, [-3.4, 0, .15], { shirt: C.red, role: 'staff', skin: 2, hair: 1 });
  counter(c, root, [2.0, 0, .9], 1.4, .8, C.teal);
  heatShelf(c, root, [2.0, 1.02, .85], 1.3);
  burger(c, root, [1.75, 1.05, .9], .55);
  const rack = shelf(c, root, [4.45, 0, -.6], 1.4, 1.9, .5, 'jars');
  rack.rotation.y = -Math.PI / 2;
  desk(c, root, [3.7, 0, 2.3], 1.2);
  person(c, root, [4.3, 0, 1.75], { shirt: C.green, role: 'manager', skin: 3 }).group.rotation.y = -.7;
  const roster = c.group(root, [LEFT + .04, 1.55, -1.2]); roster.rotation.y = Math.PI / 2;
  c.box(roster, [1.7, 1.0, .05], [0, 0, 0], '#c79a63', .02);
  const rosterCards = xs.map((_, i) => {
    const card = c.group(roster, [-.6 + i * .4, 0, .04]);
    c.box(card, [.3, .42, .02], [0, 0, 0], C.paper, .01);
    c.sphere(card, .06, [0, .08, .02], ['#e2b08f', '#c98d6a', '#9d6647', '#f0c6a5'][i]).scale.z = .3;
    c.box(card, [.2, .03, .01], [0, -.1, .015], C.ink, .003);
    return card;
  });
  const queue = queueLine(c, root, [-1.3, 0, 2.5], [-.6, 0, .15], 5);
  plant(c, root, [-4.6, 0, 3.2]);
  const stations: Record<Station, StationPlace> = {
    entrance: place(-.5, 2.3, -.5, 1.1, 1.6),
    counter: place(-2.5, .15, -3.0, 1.05, .9),
    kitchen: place(-.5, .05, -.5, 1.08, -2.7),
    pickup: place(2.0, .15, 2.0, 1.05, .9),
    stock: place(3.7, -.6, 4.3, 1.1, -.6),
    terminal: place(2.9, 2.3, 3.6, .9, 2.3),
    dispatch: sideDoor(ctx, 'dispatch', 2.6, C.red),
    branch: sideDoor(ctx, 'branch', -2.9),
  };
  return {
    walls: { back: '#f1e6d6', side: '#f1e6d6', wainscot: C.mustard, floorA: '#efe7da', floorB: '#d8ccb9', trim: C.walnut },
    stations, units,
    board: { at: [LEFT + .04, 1.75, .65], rotationY: Math.PI / 2, width: 1.4 },
    resolve: (station, state) => {
      if (station !== 'kitchen') return undefined;
      const index = state.units.findIndex((unit, i) => unit.lit && i < state.count);
      const target = index >= 0 ? index : state.units.findIndex((unit, i) => unit.fresh && i < state.count);
      return target >= 0 ? { floor: units[target].floor, surface: units[target].surface } : undefined;
    },
    apply: (state) => {
      show(tickets.tickets, Math.max(1, state.customers ? 1 : state.queue));
      show(queue.map(p => p.group), state.customers ? Math.max(1, state.queue) : 2);
      const big = state.flags.has('big');
      grillsBuilt[0].scale.set(big ? 1.45 : 1, 1, big ? 1.1 : 1);
      hostDesk.visible = host.group.visible = state.flags.has('host') || state.customers;
      rosterCards.forEach((card, i) => { card.visible = i < state.count && !state.units[i]?.hidden; });
      roster.visible = state.flags.has('roster');
    },
  };
};

const host: KitBuilder = (ctx) => {
  const { c, root } = ctx;
  const colors = [C.red, C.teal, C.mustard];
  const xs = [-2.6, .2, 3.0];
  const units: UnitHandle[] = xs.map((x, i) => {
    const g = c.group(root);
    counter(c, g, [x, 0, -2.55], 1.9, .7, colors[i]);
    c.box(g, [2.1, .12, .9], [x, 2.25, -2.7], colors[i], .03);
    for (let k = 0; k < 6; k++) c.box(g, [.15, .03, .92], [x - .85 + k * .34, 2.32, -2.7], C.white, .006);
    for (const sx of [-.95, .95]) c.box(g, [.06, 2.2, .06], [x + sx, 1.1, -2.2], C.darkWood, .015);
    c.box(g, [1.0, .55, .04], [x, 1.65, -3.42], C.ink, .02);
    person(c, g, [x, 0, -3.1], { shirt: i === 1 ? C.white : colors[i], role: i === 1 ? 'cook' : 'staff', skin: i + 2, hair: i });
    if (i === 1) burger(c, g, [x + .4, 1.05, -2.55], .5);
    if (i === 0) register(c, g, [x - .4, 1.0, -2.55]);
    return { root: g, top: v(x, 2.65, -2.4), floor: v(x, .05, -1.75), surface: v(x, 1.03, -2.5) };
  });
  podium(c, root, [.2, 0, 1.0], C.navy);
  person(c, root, [.2, 0, .35], { shirt: C.navy, role: 'manager', skin: 1 });
  const arrows = xs.map((x, i) => {
    const g = c.group(root, [(x + .2) / 2, .02, -.5]);
    const angle = Math.atan2(x - .2, -1.9);
    g.rotation.y = angle + Math.PI;
    c.box(g, [.2, .012, 1.0], [0, 0, 0], colors[i], .004).castShadow = false;
    const head = c.cone(g, .22, .4, [0, 0, -.65], colors[i], 3); head.rotation.x = -Math.PI / 2; head.castShadow = false;
    return g;
  });
  for (const [x, z] of [[-.9, 1.9], [1.3, 1.9]]) stanchion(c, root, [x, 0, z]);
  rope(c, root, [-.9, .8, 1.9], [1.3, .8, 1.9]);
  const queue = queueLine(c, root, [.2, 0, 1.65], [-.55, 0, .45], 5);
  const directory = c.group(root, [LEFT + .04, 1.5, -.55]); directory.rotation.y = Math.PI / 2;
  c.box(directory, [1.7, 1.15, .06], [0, 0, 0], C.darkWood, .02);
  c.box(directory, [1.55, 1.0, .03], [0, 0, .03], C.paper, .01);
  for (let r = 0; r < 5; r++) {
    c.box(directory, [.12, .12, .02], [-.62, .36 - r * .18, .05], colors[r % 3], .01);
    c.box(directory, [.9, .025, .02], [-.05, .36 - r * .18, .05], C.ink, .004);
    c.box(directory, [.22, .025, .02], [.6, .36 - r * .18, .05], C.teal, .004);
  }
  desk(c, root, [3.8, 0, 2.0], 1.2);
  person(c, root, [4.4, 0, 1.4], { shirt: C.green, role: 'manager', skin: 3 }).group.rotation.y = -.7;
  tableSet(c, root, [2.2, 0, 2.6]);
  plant(c, root, [-4.5, 0, 3.2]);
  const stations: Record<Station, StationPlace> = {
    entrance: place(.9, 1.5, .2, 1.08, 1.0),
    counter: { floor: units[0].floor, surface: units[0].surface },
    kitchen: { floor: units[1].floor, surface: units[1].surface },
    branch: { floor: units[2].floor, surface: units[2].surface },
    terminal: place(3.0, 2.0, 3.7, .9, 2.0),
    stock: sideDoor(ctx, 'stock', -2.65),
    pickup: sideDoor(ctx, 'pickup', 1.5, C.mustard),
    dispatch: sideDoor(ctx, 'dispatch', 2.95, C.red),
  };
  return {
    walls: { back: '#f6e7d2', side: '#f6e7d2', wainscot: C.navy, floorA: '#f3ece0', floorB: '#e0d3bf', trim: C.walnut },
    stations, units,
    board: { at: [LEFT + .04, 2.05, 1.5], rotationY: Math.PI / 2, width: 1.0, height: .55 },
    apply: (state) => {
      show(queue.map(p => p.group), Math.max(2, state.customers ? state.queue : 2));
      directory.visible = state.flags.has('directory');
      arrows.forEach((arrow, i) => { arrow.visible = state.flags.has('arrows') || !!state.units[i]?.lit; });
    },
  };
};

const network: KitBuilder = (ctx) => {
  const { c, root } = ctx;
  // Street between the main restaurant and the neighborhood branches.
  c.box(root, [1.5, .02, 7.0], [.45, .015, .1], C.asphalt, .01).castShadow = false;
  for (let z = -3.0; z < 3.4; z += .8) c.box(root, [.07, .025, .4], [.45, .03, z], C.white, .005).castShadow = false;
  for (let i = 0; i < 6; i++) c.box(root, [.2, .026, 1.4], [-.05 + i * .2, .032, 2.75], C.white, .004).castShadow = false;
  for (const x of [-.35, 1.25]) c.box(root, [.12, .08, 7.0], [x, .04, .1], C.curb, .02);
  const hq = c.group(root);
  c.box(hq, [4.3, .06, 4.4], [-2.85, .03, -1.15], '#efe3cf', .02).castShadow = false;
  hood(c, hq, [-3.7, 2.2, -3.0], 1.6);
  grill(c, hq, [-3.7, 0, -3.0], 1.25, 3);
  person(c, hq, [-3.7, 0, -2.2], { shirt: C.white, role: 'cook', skin: 1 });
  shelf(c, hq, [-1.6, 0, -3.1], 1.3, 2, .55, 'crates');
  counter(c, hq, [-2.5, 0, .45], 2.6, .75, C.red);
  register(c, hq, [-3.3, 1.0, .45]);
  person(c, hq, [-3.2, 0, -.3], { shirt: C.red, role: 'staff', skin: 3 });
  const hqMenu = c.group(hq, [-2.1, 1.0, .5]);
  c.box(hqMenu, [.55, .7, .05], [0, .38, 0], C.ink, .02); c.box(hqMenu, [.47, .6, .02], [0, .38, .03], C.paper, .01); burgerBadge(c, hqMenu, [0, .52, .05], .8);
  const managerDesk = desk(c, hq, [-4.45, 0, -1.25], 1.1); managerDesk.rotation.y = Math.PI / 2;
  person(c, hq, [-4.7, 0, -.55], { shirt: C.green, role: 'manager', skin: 2 }).group.rotation.y = 1.2;
  c.box(hq, [.9, .7, .65], [-1.05, .35, .45], C.teal, .05);
  c.box(hq, [1.0, .06, .75], [-1.05, .72, .45], C.wood, .02);
  const queue = queueLine(c, root, [-2.5, 0, 1.4], [-.5, 0, .4], 4);
  const xs = [-2.4, -.1, 2.2];
  const awnings = [C.teal, C.mustard, C.pink];
  const branches: UnitHandle[] = xs.map((z, i) => {
    const g = kiosk(c, root, [3.35, 0, z], awnings[i]);
    g.rotation.y = -Math.PI / 2;
    const chef = person(c, g, [0, 0, -.2], { shirt: C.white, role: 'cook', skin: i + 2 });
    chef.group.scale.setScalar(.85);
    burger(c, g, [.35, .96, .4], .45);
    return { root: g, top: v(3.35, 2.6, z), floor: v(1.9, .05, z), surface: v(2.85, .98, z), empty: emptyBay(c, root, [3.35, 0, z], 1.4, 1.5) };
  });
  const units: UnitHandle[] = [{ root: hq, top: v(-2.1, 2.05, .5), floor: v(-2.0, .05, -.35), surface: v(-2.1, 1.02, .4) }, ...branches];
  const clockPost = c.group(root, [1.8, 0, -2.8]);
  c.cylinder(clockPost, .05, .06, 2.0, [0, 1.0, 0], C.ink, 8);
  c.cylinder(clockPost, .3, .3, .1, [0, 2.1, 0], C.ink, 20).rotation.x = Math.PI / 2;
  c.cylinder(clockPost, .25, .25, .11, [0, 2.1, 0], C.white, 20).rotation.x = Math.PI / 2;
  c.box(clockPost, [.03, .18, .02], [0, 2.17, .06], C.ink, .004);
  c.box(clockPost, [.13, .03, .02], [.05, 2.1, .06], C.red, .004);
  const parked = scooter(c, root, [.45, 0, 3.05], C.mint, 0);
  for (const z of [-1.3, 1.0]) plant(c, root, [4.6, 0, z], .8);
  const branchIndex = Math.min(3, Math.max(1, ctx.branch));
  const branchUnit = units[branchIndex];
  const stations: Record<Station, StationPlace> = {
    entrance: place(-2.5, 1.95, -2.1, 1.05, .5),
    counter: place(-2.4, -.3, -2.4, 1.02, .4),
    kitchen: place(-3.0, -2.2, -3.4, 1.06, -2.7),
    stock: place(-1.6, -2.3, -1.6, 1.1, -2.85),
    terminal: place(-3.8, -1.25, -4.45, .88, -1.25),
    pickup: place(-1.05, 1.15, -1.05, .78, .45),
    dispatch: place(-.05, 2.9, .2, 1.13, 3.05),
    branch: { floor: branchUnit.floor, surface: branchUnit.surface },
  };
  return {
    walls: { back: '#e8eef2', side: '#efe3cf', wainscot: C.brick, floorA: '#dfe3d6', floorB: '#cdd5c2', trim: C.ink },
    stations, units, peerUnits: [1, 2, 3],
    board: { at: [.45, 1.75, -3.44], rotationY: 0, width: 1.5 },
    apply: (state) => {
      show(queue.map(p => p.group), state.customers ? Math.max(1, state.queue) : 1);
      clockPost.visible = state.flags.has('clock');
      parked.visible = true;
    },
  };
};

const pantry: KitBuilder = (ctx) => {
  const { c, root } = ctx;
  const xs = [-3.8, -2.1, -.4];
  const units: UnitHandle[] = xs.map((x, i) => {
    const g = c.group(root);
    shelf(c, g, [x, 0, -3.12], 1.5, 2.15, .55, i === 1 ? 'binders' : 'books');
    return { root: g, top: v(x, 2.5, -2.95), floor: v(x, .05, -2.3), surface: v(x, 1.15, -2.82), empty: emptyBay(c, root, [x, 0, -3.0], 1.5, .7) };
  });
  desk(c, root, [-1.6, 0, -.75], 1.7);
  chair(c, root, [-1.6, 0, -1.5], C.teal);
  const keeper = person(c, root, [-2.0, 0, -1.55], { shirt: C.teal, role: 'staff', skin: 2, hair: 3 });
  keeper.group.rotation.y = .2;
  lamp(c, root, [-2.25, .86, -.95]);
  const ledger = c.group(root, [-1.5, .88, -.7]);
  c.box(ledger, [.85, .05, .58], [0, 0, 0], C.navy, .02);
  for (const x of [-.21, .21]) { c.box(ledger, [.4, .04, .52], [x, .035, 0], C.paper, .01); for (let r = 0; r < 6; r++) c.box(ledger, [.3, .008, .014], [x, .058, -.2 + r * .08], C.ink, .002); }
  const pages = c.group(root, [-.95, .88, -.9]);
  c.box(pages, [.36, .2, .46], [0, .1, 0], C.red, .02);
  for (let i = 0; i < 5; i++) c.box(pages, [.05, .05, .04], [.2, .17 - i * .035, -.18 + i * .09], [C.mustard, C.teal, C.pink, C.green, C.blue][i], .005);
  const batches = c.group(root, [-.95, .88, -.5]);
  for (let i = 0; i < 3; i++) for (let k = 0; k <= i; k++) c.box(batches, [.24, .05, .3], [-.12 + i * .02, .03 + k * .055, -.05 + i * .02], k % 2 ? C.paper : '#efe1c2', .01);
  const profiles = c.group(root, [-2.3, .88, -.55]);
  for (let i = 0; i < 4; i++) {
    const card = c.group(profiles, [i * .2 - .1, .01, (i % 2) * .12]);
    c.box(card, [.18, .012, .24], [0, 0, 0], C.paper, .004);
    [C.tomato, C.patty, C.lettuce].forEach((color, k) => c.sphere(card, .025 + ((i + k) % 3) * .008, [-.05 + k * .05, .015, -.05], color).scale.y = .4);
  }
  const ring = c.group(root, [2.4, 0, .35]);
  c.cylinder(ring, .05, .06, .74, [0, .37, 0], C.chrome, 8);
  c.cylinder(ring, .85, .85, .06, [0, .77, 0], C.wood, 32);
  const turntable = c.group(ring, [0, .82, 0]);
  c.cylinder(turntable, .7, .7, .04, [0, 0, 0], C.cream, 32);
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * Math.PI * 2;
    const card = c.box(turntable, [.12, .16, .02], [Math.cos(a) * .58, .1, Math.sin(a) * .58], i % 4 === 0 ? C.mustard : C.paper, .005);
    card.rotation.y = -a + Math.PI / 2;
  }
  const owners = [C.red, C.teal, C.lilac].map((color, i) => {
    const a = (i * 4 + 1) / 12 * Math.PI * 2;
    return c.cylinder(turntable, .06, .06, .18, [Math.cos(a) * .35, .1, Math.sin(a) * .35], color, 12);
  });
  const catalog = c.group(root, [.9, 0, 2.6]);
  c.box(catalog, [1.2, .95, .6], [0, .48, 0], C.walnut, .03);
  for (let r = 0; r < 3; r++) for (let k = 0; k < 4; k++) {
    c.box(catalog, [.24, .22, .02], [-.42 + k * .28, .78 - r * .28, .305], C.darkWood, .01);
    c.box(catalog, [.08, .03, .03], [-.42 + k * .28, .78 - r * .28, .32], C.mustard, .005);
  }
  for (let i = 0; i < 4; i++) { const card = c.box(catalog, [.22, .02, .3], [-.3 + i * .2, .97 + i * .01, 0], [C.paper, '#e8f1ea', C.paper, '#f6e3e6'][i], .005); card.rotation.y = (i - 1.5) * .15; }
  const boxes = c.group(root, [4.1, 0, -2.8]);
  for (let i = 0; i < 5; i++) { c.box(boxes, [.7, .38, .5], [(i % 2) * .1 - .05, .2 + i * .4, (i % 2) * .05], C.kraft, .02); c.box(boxes, [.25, .12, .01], [(i % 2) * .1 - .05, .22 + i * .4, .26 + (i % 2) * .05], C.paper, .004); }
  const bits = c.group(root, [4.1, 2.2, -3.44]);
  c.box(bits, [1.5, .45, .05], [0, 0, 0], C.darkWood, .02);
  const cells = Array.from({ length: 8 }, (_, i) => {
    c.box(bits, [.15, .15, .02], [-.6 + i * .17, 0, .04], C.paper, .01);
    return c.box(bits, [.1, .1, .02], [-.6 + i * .17, 0, .06], C.teal, .01);
  });
  counter(c, root, [-2.6, 0, 2.4], 1.6, .75, C.mustard);
  register(c, root, [-2.9, 1.0, 2.4]);
  desk(c, root, [3.8, 0, 2.0], 1.2);
  person(c, root, [4.4, 0, 1.45], { shirt: C.green, role: 'manager', skin: 3 }).group.rotation.y = -.7;
  plant(c, root, [1.7, 0, -3.0], .9);
  supplyPallet(c, root, [.5, 0, 1.0]);
  supplyPallet(c, root, [-.3, 0, 3.0]);
  const stations: Record<Station, StationPlace> = {
    stock: place(-1.6, .1, -1.6, .92, -.65),
    counter: place(-2.6, 1.7, -2.4, 1.0, 2.4),
    terminal: place(3.0, 2.0, 3.6, .9, 2.0),
    kitchen: sideDoor(ctx, 'kitchen', -2.6),
    pickup: sideDoor(ctx, 'pickup', -1.4, C.mustard),
    entrance: sideDoor(ctx, 'entrance', 2.9, C.red),
    branch: backDoor(ctx, 'branch', 1.0),
    dispatch: backDoor(ctx, 'dispatch', 2.25, C.red),
  };
  return {
    walls: { back: '#eadfcd', side: '#eadfcd', wainscot: C.walnut, floorA: '#caa47c', floorB: '#b48d66', trim: C.walnut },
    stations, units,
    board: { at: [LEFT + .04, 1.7, .45], rotationY: Math.PI / 2, width: 1.5 },
    apply: (state) => {
      pages.visible = state.flags.has('pages');
      batches.visible = state.flags.has('batches');
      profiles.visible = state.flags.has('profiles');
      ring.visible = state.flags.has('ring');
      owners.forEach((owner, i) => { owner.visible = i < state.count && !state.units[i]?.hidden; });
      catalog.visible = state.flags.has('catalog');
      boxes.visible = state.flags.has('boxes');
      bits.visible = state.flags.has('bits');
      cells.forEach((cell, i) => { cell.visible = state.values.includes(i); });
      ledger.visible = !state.flags.has('profiles');
    },
    animate: (clock, teaching) => { if (teaching) turntable.rotation.y = clock * .25; },
  };
};

const vault: KitBuilder = (ctx) => {
  const { c, root } = ctx;
  door(c, root, [-2.8, 0, BACK], 0, '#b9c4c8');
  c.box(root, [.12, .5, .1], [-2.4, 1.0, BACK + .1], C.chrome, .03);
  ctx.sign({ pt: 'Geladeira', en: 'Fridge' }, [-2.8, 2.35, BACK + .1]);
  door(c, root, [-.4, 0, BACK], 0, C.wood);
  ctx.sign({ pt: 'Despensa', en: 'Pantry' }, [-.4, 2.35, BACK + .1]);
  const holders = [-2.8, -.4].map((x, i) => {
    const g = c.group(root);
    const cook = person(c, g, [x, 0, -2.3], { shirt: C.white, role: 'cook', skin: i * 2 + 1, hair: i });
    cook.arms[1].rotation.x = -1.0;
    const key = c.group(cook.arms[1], [0, -.42, .06]);
    c.torus(key, .07, .022, [0, 0, 0], C.mustard);
    c.box(key, [.035, .2, .03], [0, -.15, 0], C.mustard, .005);
    return { group: g, key };
  });
  const units: UnitHandle[] = holders.map((h, i) => ({ root: h.group, top: v(i ? -.4 : -2.8, 2.1, -2.3), floor: v(i ? -.4 : -2.8, .05, -1.7), surface: v(i ? -.4 : -2.8, 1.0, -2.1) }));
  desk(c, root, [.7, 0, -.25], 1.6);
  person(c, root, [.4, 0, -1.0], { shirt: C.teal, role: 'staff', skin: 4 }).group.rotation.y = .2;
  const book = c.group(root, [.9, .88, -.2]);
  c.box(book, [.8, .05, .55], [0, 0, 0], C.navy, .02);
  for (const x of [-.2, .2]) c.box(book, [.38, .04, .5], [x, .035, 0], C.paper, .01);
  const item = c.group(root, [.2, .88, -.15]);
  c.cylinder(item, .25, .23, .03, [0, .015, 0], C.white, 20);
  const bun = c.sphere(item, .16, [0, .1, 0], C.bun); bun.scale.y = .6;
  c.box(item, [.24, .02, .24], [0, .04, 0], C.cheese, .005).rotation.y = .5;
  const tally = c.group(root, [1.5, .88, -.45]);
  c.box(tally, [.5, .4, .04], [0, .25, 0], '#2f4a3e', .015).rotation.x = -.2;
  for (let i = 0; i < 4; i++) c.box(tally, [.025, .2, .01], [-.15 + i * .07, .27, .03], C.white, .003).rotation.x = -.2;
  c.box(tally, [.3, .02, .01], [-.05, .27, .035], C.white, .003).rotation.z = .5;
  const hooks = c.group(root, [LEFT + .04, 1.55, -.8]); hooks.rotation.y = Math.PI / 2;
  c.box(hooks, [.9, .65, .12], [0, 0, 0], C.walnut, .02);
  c.box(hooks, [.8, .55, .03], [0, 0, .06], C.cream, .01);
  const hanging = [0, 1, 2, 3].map(i => {
    c.cylinder(hooks, .015, .015, .08, [-.3 + i * .2, .15, .1], C.chrome, 6).rotation.x = Math.PI / 2;
    const key = c.group(hooks, [-.3 + i * .2, .05, .12]);
    c.torus(key, .045, .015, [0, 0, 0], C.mustard);
    c.box(key, [.025, .14, .02], [0, -.1, 0], C.mustard, .004);
    return key;
  });
  grill(c, root, [3.1, 0, -3.0], 1.3, 3);
  hood(c, root, [3.1, 2.25, -3.0], 1.5);
  counter(c, root, [-3.2, 0, 1.85], 1.8, .75, C.red);
  register(c, root, [-3.6, 1.0, 1.85]);
  person(c, root, [-3.2, 0, 1.15], { shirt: C.red, role: 'staff', skin: 2 });
  desk(c, root, [3.7, 0, 1.7], 1.2);
  person(c, root, [4.3, 0, 1.15], { shirt: C.green, role: 'manager', skin: 3 }).group.rotation.y = -.7;
  const decision = c.group(root, [3.5, .88, 1.75]);
  c.box(decision, [.6, .05, .42], [0, 0, 0], C.cherry, .02);
  c.box(decision, [.55, .04, .38], [0, .035, 0], C.paper, .01);
  c.cylinder(decision, .07, .08, .1, [.2, .1, -.05], C.walnut, 12);
  c.cylinder(decision, .03, .03, .14, [.2, .2, -.05], C.walnut, 8);
  plant(c, root, [4.6, 0, -.8], .85);
  const stations: Record<Station, StationPlace> = {
    stock: place(.7, .55, .7, .92, -.2),
    kitchen: place(3.1, -2.1, 3.1, 1.08, -2.7),
    counter: place(-2.4, 1.15, -2.8, 1.0, 1.85),
    terminal: place(2.9, 1.7, 3.5, .9, 1.7),
    branch: sideDoor(ctx, 'branch', .55),
    pickup: sideDoor(ctx, 'pickup', -2.45, C.mustard),
    entrance: sideDoor(ctx, 'entrance', 2.95, C.red),
    dispatch: backDoor(ctx, 'dispatch', 4.45, C.red),
  };
  return {
    walls: { back: '#e5ecef', side: '#efe5d6', wainscot: C.steel, floorA: '#e9e4dc', floorB: '#c8c1b6', trim: C.navy },
    stations, units,
    board: { at: [.95, 1.85, -3.44], rotationY: 0, width: 1.15 },
    apply: (state) => {
      holders.forEach((h, i) => { h.key.visible = !!state.units[i]?.tag; });
      item.visible = state.flags.has('item');
      tally.visible = state.flags.has('tally');
      hooks.visible = true;
      const taken = state.units.filter(unit => unit.tag && !unit.hidden).length;
      hanging.forEach((key, i) => { key.visible = state.flags.has('hooks') ? i >= taken : true; });
      decision.visible = state.flags.has('decision');
    },
  };
};

const cache: KitBuilder = (ctx) => {
  const { c, root } = ctx;
  const glass = '#cfe3ea';
  c.box(root, [.08, 2.1, 2.3], [-1.6, 1.05, -2.35], glass, .01);
  c.box(root, [2.4, 2.1, .08], [-3.85, 1.05, -1.2], glass, .01);
  c.box(root, [.08, .1, 2.3], [-1.6, 2.12, -2.35], C.darkWood, .01);
  c.box(root, [3.5, .1, .08], [-3.3, 2.12, -1.2], C.darkWood, .01);
  ctx.sign({ pt: 'Fichário original', en: 'Master binder' }, [-3.4, 2.4, -1.2]);
  const lectern = c.group(root, [-3.4, 0, -2.6]);
  c.box(lectern, [.14, 1.0, .14], [0, .5, 0], C.darkWood, .02);
  c.box(lectern, [.9, .06, .6], [0, 1.03, 0], C.darkWood, .02).rotation.x = -.3;
  const binder = c.group(lectern, [0, 1.12, 0]); binder.rotation.x = -.3;
  c.box(binder, [.8, .12, .55], [0, 0, 0], C.navy, .02);
  burgerBadge(c, binder, [0, .07, 0], 1).rotation.x = -Math.PI / 2;
  const price = c.group(lectern, [.3, 1.22, .1]);
  c.cylinder(price, .09, .09, .02, [0, 0, 0], C.mustard, 14);
  shelf(c, root, [-4.4, 0, -2.5], .9, 1.8, .45, 'binders').rotation.y = Math.PI / 2;
  counter(c, root, [.6, 0, .6], 2.6, .8, C.red);
  register(c, root, [-.2, 1.02, .6]);
  person(c, root, [.0, 0, -.15], { shirt: C.red, role: 'staff', skin: 3 });
  counter(c, root, [3.3, 0, .6], 1.8, .8, C.teal);
  heatShelf(c, root, [3.3, 1.02, .5], 1.6);
  person(c, root, [3.3, 0, -.15], { shirt: C.teal, role: 'staff', skin: 1, hair: 2 });
  const stands = [[1.4, .6], [3.7, .6]].map(([x, z], i) => {
    const g = c.group(root, [x, 1.02, z]);
    c.box(g, [.6, .78, .05], [0, .42, 0], C.ink, .02).rotation.x = -.15;
    c.box(g, [.52, .68, .02], [0, .43, .03], C.paper, .01).rotation.x = -.15;
    burgerBadge(c, g, [0, .62, .07], .9).rotation.x = -.15;
    for (let r = 0; r < 3; r++) c.box(g, [.36, .02, .01], [0, .38 - r * .1, .06], C.ink, .003).rotation.x = -.15;
    c.box(g, [.5, .06, .26], [0, .02, -.06], C.darkWood, .01);
    const ttl = c.group(g, [.4, .2, .05]);
    c.cylinder(ttl, .1, .1, .03, [0, 0, 0], C.ink, 14).rotation.x = Math.PI / 2;
    c.cylinder(ttl, .08, .08, .035, [0, 0, .005], C.white, 14).rotation.x = Math.PI / 2;
    c.box(ttl, [.015, .07, .01], [0, .03, .03], C.red, .003);
    return { group: g, ttl, index: i };
  });
  const readers = queueLine(c, root, [3.0, 0, 1.5], [.55, 0, .35], 2);
  const queue = queueLine(c, root, [.3, 0, 1.5], [-.5, 0, .45], 3);
  grill(c, root, [2.2, 0, -3.0], 1.3, 3);
  hood(c, root, [2.2, 2.25, -3.0], 1.6);
  person(c, root, [2.2, 0, -2.2], { shirt: C.white, role: 'cook', skin: 2 });
  desk(c, root, [-3.8, 0, 1.4], 1.2);
  person(c, root, [-3.3, 0, .75], { shirt: C.green, role: 'manager', skin: 4 }).group.rotation.y = .4;
  plant(c, root, [-4.6, 0, 3.2]);
  tableSet(c, root, [1.6, 0, 2.7]);
  const units: UnitHandle[] = stands.map(s => ({ root: s.group, top: v(s.group.position.x, 2.3, s.group.position.z), floor: v(s.group.position.x, .05, -.15), surface: v(s.group.position.x - .35, 1.05, .6) }));
  const stations: Record<Station, StationPlace> = {
    stock: place(-2.9, -2.0, -3.4, 1.2, -2.55),
    counter: place(.8, -.15, .8, 1.05, .6),
    pickup: place(2.6, -.15, 2.9, 1.05, .6),
    kitchen: place(2.2, -2.15, 2.6, 1.08, -2.7),
    terminal: place(-3.0, 1.4, -3.7, .9, 1.4),
    entrance: place(-1.2, 2.9, -1.2, 1.0, 2.9),
    dispatch: sideDoor(ctx, 'dispatch', 2.8, C.red),
    branch: backDoor(ctx, 'branch', 4.3),
  };
  const inside = (p: T.Vector3) => p.x < -1.6 && p.z < -1.2;
  return {
    walls: { back: '#f5e9d6', side: '#f5e9d6', wainscot: C.teal, floorA: '#f2ece2', floorB: '#d24a54', trim: C.ink },
    stations, units,
    board: { at: [.2, 1.75, -3.44], rotationY: 0, width: 1.6 },
    route: (a, b) => {
      if (inside(a) && inside(b)) return [];
      const doorway = v(-1.6, .05, -.7), inner = v(-2.4, .05, -1.7), gap = v(2.15, .05, .6);
      const front = (p: T.Vector3) => p.z > 1.0;
      const path: T.Vector3[] = [];
      if (inside(a)) path.push(inner, doorway);
      if (front(a) !== front(b)) path.push(gap);
      if (inside(b)) path.push(doorway, inner);
      return path;
    },
    apply: (state) => {
      stands.forEach(s => { s.ttl.visible = state.flags.has('ttl'); });
      show(readers.map(p => p.group), state.flags.has('readers') ? 2 : 0);
      show(queue.map(p => p.group), state.customers ? Math.max(1, state.queue) : 1);
      price.visible = state.flags.has('price');
    },
  };
};

const security: KitBuilder = (ctx) => {
  const { c, root } = ctx;
  c.box(root, [.14, 2.4, 2.45], [-1.4, 1.2, -2.27], '#9aa7ad', .02);
  c.box(root, [1.75, 2.4, .14], [-4.2, 1.2, -1.0], '#9aa7ad', .02);
  c.box(root, [.9, 2.4, .14], [-1.85, 1.2, -1.0], '#9aa7ad', .02);
  c.box(root, [.9, .3, .14], [-2.75, 2.25, -1.0], '#9aa7ad', .02);
  const heavy = c.group(root, [-2.75, 0, -1.0]);
  const leaf = c.group(heavy, [-.43, 0, 0]);
  c.box(leaf, [.86, 2.06, .1], [.43, 1.03, 0], '#7d8b91', .02);
  for (let i = 0; i < 3; i++) c.box(leaf, [.7, .04, .02], [.43, .5 + i * .55, .06], C.chrome, .006);
  c.cylinder(leaf, .07, .07, .06, [.75, 1.0, .07], C.chrome, 14).rotation.x = Math.PI / 2;
  const reader = c.group(root, [-2.15, 1.25, -.9]);
  c.box(reader, [.18, .28, .05], [0, 0, 0], C.ink, .02);
  const go = c.glow(reader, 'sphere', .04, [0, .08, .03], '#57d07f');
  const stop = c.glow(reader, 'sphere', .04, [0, .08, .03], C.tomato);
  shelf(c, root, [-3.4, 0, -3.1], 1.6, 2, .55, 'crates');
  const safe = c.group(root, [-2.0, 0, -2.75]);
  c.box(safe, [.75, .9, .6], [0, .45, 0], '#59626b', .04);
  c.cylinder(safe, .1, .1, .05, [.15, .55, .31], C.chrome, 14).rotation.x = Math.PI / 2;
  c.box(safe, [.04, .2, .04], [-.2, .5, .31], C.chrome, .01);
  podium(c, root, [-2.6, 0, 2.0], C.navy);
  person(c, root, [-2.6, 0, 1.35], { shirt: C.navy, role: 'guard', skin: 2 });
  for (const [x, z] of [[-3.6, 2.0], [-1.6, 2.0]]) stanchion(c, root, [x, 0, z]);
  rope(c, root, [-3.6, .8, 2.0], [-3.0, .8, 2.0]);
  const intruder = person(c, root, [-3.2, 0, 3.05], { shirt: '#4b4f5c', role: 'customer', skin: 1, hair: 2 });
  intruder.group.rotation.y = Math.PI * .9;
  const hoodie = c.sphere(intruder.group, .25, [0, 1.3, -.03], '#4b4f5c'); hoodie.scale.set(1, .9, 1);
  desk(c, root, [3.4, 0, -2.4], 1.3);
  person(c, root, [3.95, 0, -1.85], { shirt: C.green, role: 'manager', skin: 3 }).group.rotation.y = -.8;
  lamp(c, root, [3.0, .86, -2.6]);
  const schedule = c.group(root, [3.4, 1.85, -3.44]);
  c.box(schedule, [1.3, .8, .04], [0, 0, 0], C.darkWood, .02);
  c.box(schedule, [1.2, .7, .02], [0, 0, .03], C.paper, .01);
  for (let r = 0; r < 4; r++) for (let k = 0; k < 5; k++) c.box(schedule, [.16, .1, .01], [-.45 + k * .22, .22 - r * .15, .045], (r + k) % 3 ? C.mint : C.rose, .005);
  const logbook = c.group(root, [3.6, .88, -2.35]);
  c.box(logbook, [.6, .04, .42], [0, 0, 0], C.cherry, .02);
  c.box(logbook, [.56, .03, .38], [0, .03, 0], C.paper, .01);
  counter(c, root, [1.0, 0, .6], 2.2, .8, C.red);
  register(c, root, [.4, 1.02, .6]);
  person(c, root, [.6, 0, -.15], { shirt: C.red, role: 'staff', skin: 4 });
  const seal = c.group(root, [1.5, 1.03, .6]);
  c.box(seal, [.42, .03, .3], [0, 0, 0], '#e2c89f', .01);
  c.cylinder(seal, .06, .06, .03, [0, .025, 0], C.cherry, 12);
  grill(c, root, [.8, 0, -3.0], 1.3, 3);
  hood(c, root, [.8, 2.25, -3.0], 1.6);
  person(c, root, [.8, 0, -2.2], { shirt: C.white, role: 'cook', skin: 1 });
  counter(c, root, [3.4, 0, .8], 1.3, .7, C.teal);
  scooter(c, root, [3.95, 0, 3.0], C.mint, -.3);
  const stations: Record<Station, StationPlace> = {
    entrance: place(-2.0, 2.7, -2.6, 1.1, 2.0),
    stock: place(-3.0, -2.0, -2.0, .95, -2.6),
    terminal: place(2.7, -1.8, 3.3, .9, -2.4),
    counter: place(1.4, -.15, 1.2, 1.05, .6),
    kitchen: place(1.6, -2.2, 1.0, 1.08, -2.7),
    pickup: place(3.0, .0, 3.4, 1.0, .8),
    dispatch: place(3.0, 2.5, 3.6, 1.15, 3.05),
    branch: sideDoor(ctx, 'branch', .4),
  };
  const inside = (p: T.Vector3) => p.x < -1.4 && p.z < -1.0;
  const units: UnitHandle[] = [
    { root: c.group(root), top: v(-2.6, 2.25, 2.0), floor: v(-2.6, .05, 2.6), surface: v(-2.6, 1.1, 2.0) },
    { root: heavy, top: v(-2.3, 2.75, -1.0), floor: v(-2.75, .05, -.5), surface: v(-2.15, 1.2, -.9) },
    { root: c.group(root), top: v(3.4, 1.9, -2.4), floor: v(2.7, .05, -1.8), surface: v(3.3, .9, -2.4) },
  ];
  return {
    walls: { back: '#e7ecee', side: '#e7ecee', wainscot: C.navy, floorA: '#e8e6e1', floorB: '#bfc6c9', trim: C.ink },
    stations, units,
    board: { at: [LEFT + .04, 1.75, 2.0], rotationY: Math.PI / 2, width: 1.6 },
    route: (a, b) => {
      const outer = v(-2.75, .05, -.3), inner = v(-2.75, .05, -1.6);
      if (inside(a) && !inside(b)) return [inner, outer];
      if (!inside(a) && inside(b)) return [outer, inner];
      return [];
    },
    apply: (state) => {
      intruder.group.visible = state.flags.has('intruder');
      seal.visible = state.flags.has('seal');
      schedule.visible = state.flags.has('schedule');
      logbook.visible = state.flags.has('logbook');
      const doorMark = state.units[1]?.mark;
      go.visible = doorMark === 'yes'; stop.visible = doorMark === 'no' || !doorMark;
      leaf.rotation.y = doorMark === 'yes' ? -1.1 : 0;
    },
  };
};

const office: KitBuilder = (ctx) => {
  const { c, root } = ctx;
  const board = c.group(root, [-1.0, 1.5, -3.44]);
  c.box(board, [2.7, 1.7, .06], [0, 0, 0], C.darkWood, .02);
  c.box(board, [2.55, 1.55, .03], [0, 0, .03], '#c79a63', .01);
  c.box(board, [2.2, 1.2, .02], [0, .02, .05], C.paper, .01);
  c.box(board, [2.0, .02, .02], [0, -.5, .065], C.ink, .003);
  c.box(board, [.02, 1.05, .02], [-1.0, .02, .065], C.ink, .003);
  const bars = [0, 1, 2, 3].map(i => {
    const bar = c.group(board, [-.62 + i * .48, -.5, .075]);
    c.box(bar, [.32, 1, .025], [0, .5, 0], [C.teal, C.mustard, C.red, C.lilac][i], .006);
    return bar;
  });
  const limit = c.box(board, [2.0, .025, .025], [0, .3, .08], C.red, .004);
  const units: UnitHandle[] = bars.map((bar, i) => ({ root: c.group(root), top: v(-1.62 + i * .48, .6, -3.25), floor: v(-1.62 + i * .48, .05, -2.6), surface: v(-1.62 + i * .48, 1, -3.3) }));
  const beacon = c.group(root, [.55, 2.42, -3.35]);
  c.cylinder(beacon, .12, .14, .06, [0, 0, 0], C.ink, 14);
  const beaconLight = c.glow(beacon, 'sphere', .13, [0, .1, 0], '#ff4a3d');
  const beaconOff = c.sphere(beacon, .13, [0, .1, 0], '#b85a54');
  const trace = c.group(root, [LEFT + .04, 1.55, .2]); trace.rotation.y = Math.PI / 2;
  c.box(trace, [1.9, 1.1, .05], [0, 0, 0], '#c79a63', .02);
  const pins = [[-.7, .25], [-.2, -.15], [.3, .2], [.75, -.2]];
  pins.forEach(([x, y], i) => { const tk = ticket(c, trace, [x, y, .05], [C.red, C.teal, C.mustard, C.lilac][i]); tk.scale.setScalar(1.3); c.sphere(trace, .03, [x, y + .2, .08], C.red); });
  for (let i = 0; i < pins.length - 1; i++) {
    const [x1, y1] = pins[i], [x2, y2] = pins[i + 1];
    const s = c.box(trace, [Math.hypot(x2 - x1, y2 - y1), .015, .01], [(x1 + x2) / 2, (y1 + y2) / 2 + .2, .085], C.red, .002);
    s.rotation.z = Math.atan2(y2 - y1, x2 - x1);
  }
  desk(c, root, [-1.4, 0, -1.25], 1.8);
  chair(c, root, [-1.4, 0, -2.0], C.navy);
  person(c, root, [-1.85, 0, -1.95], { shirt: C.green, role: 'manager', skin: 2 }).group.rotation.y = .2;
  lamp(c, root, [-2.05, .86, -1.45]);
  const phone = c.group(root, [-.8, .86, -1.4]);
  c.box(phone, [.3, .08, .22], [0, .04, 0], C.red, .03);
  c.box(phone, [.34, .07, .09], [0, .12, 0], C.red, .03);
  const log = c.group(root, [-1.4, .87, -1.2]);
  c.box(log, [.7, .04, .48], [0, 0, 0], C.navy, .02);
  for (const x of [-.17, .17]) { c.box(log, [.32, .03, .44], [x, .03, 0], C.paper, .01); for (let r = 0; r < 5; r++) c.box(log, [.24, .006, .014], [x, .05, -.16 + r * .08], C.ink, .002); }
  const budget = c.group(root, [-2.2, .86, -.95]);
  c.cylinder(budget, .17, .17, .03, [0, .015, 0], C.ink, 16);
  c.cylinder(budget, .16, .16, .44, [0, .24, 0], '#cfe7ef', 16);
  c.cylinder(budget, .17, .17, .05, [0, .48, 0], C.mustard, 16);
  const tokens = Array.from({ length: 6 }, (_, i) => c.cylinder(budget, .12, .12, .06, [0, .06 + i * .065, 0], C.mustard, 14));
  counter(c, root, [2.0, 0, 1.0], 1.7, .8, C.red);
  register(c, root, [1.6, 1.02, 1.0]);
  person(c, root, [1.7, 0, .25], { shirt: C.red, role: 'staff', skin: 3 });
  grill(c, root, [3.6, 0, -3.0], 1.3, 3);
  hood(c, root, [3.6, 2.25, -3.0], 1.6);
  person(c, root, [3.6, 0, -2.2], { shirt: C.white, role: 'cook', skin: 1 });
  counter(c, root, [4.15, 0, .3], 1.1, .7, C.teal);
  scooter(c, root, [4.0, 0, 3.05], C.mint, -.3);
  const queue = queueLine(c, root, [1.9, 0, 1.75], [-.55, 0, .3], 5);
  plant(c, root, [-4.6, 0, -2.9], .9);
  const stations: Record<Station, StationPlace> = {
    terminal: place(-1.2, -.4, -1.0, .9, -1.1),
    counter: place(2.4, .25, 2.3, 1.05, 1.0),
    kitchen: place(2.9, -2.2, 3.2, 1.08, -2.7),
    pickup: place(3.5, .3, 4.1, .98, .3),
    dispatch: place(3.1, 2.5, 3.65, 1.15, 3.05),
    entrance: place(-.4, 2.9, -.4, 1.0, 2.9),
    stock: sideDoor(ctx, 'stock', -2.4),
    branch: sideDoor(ctx, 'branch', 2.4),
  };
  return {
    walls: { back: '#efe4d3', side: '#efe4d3', wainscot: C.navy, floorA: '#d9c5a8', floorB: '#c4ad8d', trim: C.walnut },
    stations, units,
    board: { at: [1.55, 1.85, -3.44], rotationY: 0, width: 1.5 },
    apply: (state) => {
      bars.forEach((bar, i) => {
        bar.scale.y = Math.max(.04, (state.values[i] ?? .25) * 1.05);
        units[i].top.set(-1.62 + i * .48, 1.0 + bar.scale.y + .12, -3.25);
      });
      limit.visible = state.flags.has('budget') || state.flags.has('alarm') || state.values.some(value => value > .8);
      beacon.visible = true; beaconLight.visible = state.flags.has('alarm'); beaconOff.visible = !state.flags.has('alarm');
      trace.visible = state.flags.has('trace');
      log.visible = state.flags.has('log');
      budget.visible = state.flags.has('budget');
      show(tokens, Math.round(state.gauge * tokens.length));
      show(queue.map(p => p.group), state.queue > 1 ? state.queue : 1);
    },
    animate: (clock, teaching) => { beaconLight.scale.setScalar(teaching ? 1 + Math.sin(clock * 9) * .15 : 1); },
  };
};

const delivery: KitBuilder = (ctx) => {
  const { c, root } = ctx;
  c.box(root, [10, .02, 1.55], [0, .015, 2.75], C.asphalt, .01).castShadow = false;
  for (let x = -4.5; x < 5; x += .9) c.box(root, [.45, .025, .07], [x, .03, 2.75], C.white, .005).castShadow = false;
  c.box(root, [10, .09, .14], [0, .045, 1.95], C.curb, .02);
  const houseRoot = c.group(root, [4.35, 0, 2.6]);
  c.box(houseRoot, [1.0, 1.3, 1.0], [0, .65, 0], C.rose, .03);
  const roof = c.cone(houseRoot, .85, .6, [0, 1.6, 0], C.cherry, 4); roof.rotation.y = Math.PI / 4;
  c.box(houseRoot, [.3, .55, .04], [-.5, .3, 0], C.darkWood, .01).rotation.y = Math.PI / 2;
  bagShelf(c, root, [-1.4, 0, -3.15], 2.0);
  podium(c, root, [.8, 0, -.9], C.red);
  person(c, root, [.8, 0, -1.55], { shirt: C.red, role: 'staff', skin: 2, hair: 1 });
  const map = c.group(root, [.9, 1.75, -3.44]);
  c.box(map, [1.2, .9, .05], [0, 0, 0], C.darkWood, .02);
  c.box(map, [1.1, .8, .02], [0, 0, .03], '#dfeccd', .01);
  for (const [x, y, w, h] of [[0, 0, 1.0, .06], [-.2, 0, .06, .7], [.25, .1, .06, .55]]) c.box(map, [w, h, .015], [x, y, .045], C.white, .003);
  const mapPins = [[-.35, .2, C.red], [.1, -.22, C.teal], [.38, .25, C.mustard], [-.1, .28, C.red]].map(([x, y, color]) => c.sphere(map, .04, [x as number, y as number, .07], color as string));
  const scooters: UnitHandle[] = [-2.6, -.8, 1.0].map((x, i) => {
    const g = c.group(root);
    scooter(c, g, [x, 0, 1.45], [C.mint, C.sky, C.rose][i], 0);
    const courier = person(c, g, [x + .1, 0, .7], { shirt: [C.teal, C.blue, C.pink][i], role: 'courier', skin: i + 1 });
    courier.group.rotation.y = Math.PI * .1;
    return { root: g, top: v(x, 2.15, .9), floor: v(x + .7, .05, .75), surface: v(x - .42, 1.13, 1.45) };
  });
  const panel = breakerPanel(c, root, [LEFT + .08, 1.7, -.4], Math.PI / 2);
  grill(c, root, [-4.0, 0, -3.0], 1.2, 3);
  hood(c, root, [-4.0, 2.25, -3.0], 1.5);
  person(c, root, [-3.9, 0, -2.25], { shirt: C.white, role: 'cook', skin: 3 });
  counter(c, root, [-3.4, 0, -.4], 1.8, .8, C.red);
  register(c, root, [-3.8, 1.02, -.4]);
  person(c, root, [-3.4, 0, -1.15], { shirt: C.red, role: 'staff', skin: 4 });
  desk(c, root, [3.8, 0, -2.4], 1.3);
  person(c, root, [4.35, 0, -1.85], { shirt: C.green, role: 'manager', skin: 2 }).group.rotation.y = -.8;
  const stations: Record<Station, StationPlace> = {
    pickup: place(-1.4, -2.35, -1.4, 1.15, -2.9),
    dispatch: place(.85, -.25, .8, 1.08, -.9),
    counter: place(-2.4, -1.1, -2.8, 1.05, -.4),
    kitchen: place(-3.0, -2.2, -3.6, 1.08, -2.7),
    terminal: place(3.0, -1.8, 3.6, .9, -2.4),
    entrance: place(-4.0, 1.2, -3.4, 1.0, .1),
    stock: sideDoor(ctx, 'stock', -1.75),
    branch: backDoor(ctx, 'branch', 2.5),
  };
  return {
    walls: { back: '#f0e4d2', side: '#f0e4d2', wainscot: C.red, floorA: '#e5ddd0', floorB: '#cbbfae', trim: C.walnut },
    stations, units: scooters,
    board: { at: [-1.4, 2.15, -3.44], rotationY: 0, width: 1.9, height: .6 },
    apply: (state) => {
      panel.group.visible = state.flags.has('breaker');
      panel.lever.rotation.z = state.gauge > .75 ? Math.PI : state.gauge > .25 ? Math.PI / 2 : 0;
      panel.lights[0].visible = state.gauge <= .25; panel.lights[1].visible = state.gauge > .25;
      map.visible = state.flags.has('map');
      mapPins.forEach(pin => { pin.visible = state.flags.has('map'); });
    },
  };
};

const library: KitBuilder = (ctx) => {
  const { c, root } = ctx;
  for (const x of [-3.6, -1.6, .4]) shelf(c, root, [x, 0, -3.12], 1.8, 2.2, .55, 'binders', C.walnut);
  const xs = [-2.4, .2, 2.8];
  const ribbons: T.Group[] = [];
  const spikes: T.Group[] = [];
  const units: UnitHandle[] = xs.map((x, i) => {
    const g = c.group(root);
    desk(c, g, [x, 0, -.6], 1.5, C.wood);
    chair(c, g, [x, 0, -1.3], C.teal);
    person(c, g, [x - .2, 0, -1.4], { shirt: [C.lilac, C.teal, C.mustard][i], role: 'advisor', skin: i + 1, hair: i + 1 }).group.rotation.y = .15;
    lamp(c, g, [x - .55, .86, -.75]);
    const book = c.group(g, [x + .05, .87, -.5]);
    c.box(book, [.7, .04, .46], [0, 0, 0], C.cherry, .02);
    for (const sx of [-.17, .17]) { c.box(book, [.32, .03, .42], [sx, .03, 0], C.paper, .01); for (let r = 0; r < 4; r++) c.box(book, [.24, .006, .012], [sx, .05, -.14 + r * .09], C.ink, .002); }
    const ribbon = c.group(g, [x + .45, .87, -.22]);
    c.box(ribbon, [.22, 1, .01], [0, -.5, 0], C.paper, .002);
    ribbons.push(ribbon);
    const spike = c.group(g, [x + .5, .87, -.75]);
    c.cylinder(spike, .08, .09, .03, [0, .015, 0], C.ink, 12);
    c.box(spike, [.015, .3, .015], [0, .16, 0], C.chrome, .003);
    for (let k = 0; k < 7; k++) { const tk = ticket(c, spike, [0, .04 + k * .035, 0], C.teal); tk.rotation.x = -Math.PI / 2; tk.rotation.z = k * .5; }
    spikes.push(spike);
    return { root: g, top: v(x, 2.15, -.6), floor: v(x, .05, .2), surface: v(x + .3, .9, -.45), empty: emptyBay(c, root, [x, 0, -.8], 1.6, 1.4) };
  });
  const catalog = c.group(root, [1.0, 0, 2.2]);
  table(c, catalog, [0, 0, 0], .75);
  const clusters = [[C.tomato, -.3, -.2], [C.patty, .25, -.25], [C.lettuce, 0, .28]] as const;
  for (const [color, cx, cz] of clusters) for (let k = 0; k < 3; k++) {
    const card = c.box(catalog, [.16, .012, .22], [cx + (k - 1) * .1, .83, cz + (k % 2) * .06], C.paper, .004);
    card.rotation.y = k * .3;
    c.sphere(catalog, .025, [cx + (k - 1) * .1, .845, cz + (k % 2) * .06 - .05], color).scale.y = .4;
  }
  const guard = person(c, root, [-4.3, 0, -1.9], { shirt: C.navy, role: 'guard', skin: 3 });
  guard.group.rotation.y = .8;
  const clip = c.group(guard.arms[1], [0, -.42, .1]);
  c.box(clip, [.18, .24, .02], [0, 0, 0], C.darkWood, .01);
  c.box(clip, [.15, .18, .01], [0, 0, .015], C.paper, .004);
  const notes = c.group(root, [LEFT + .04, 1.5, -1.4]); notes.rotation.y = Math.PI / 2;
  c.box(notes, [1.2, .8, .04], [0, 0, 0], '#c79a63', .02);
  for (let i = 0; i < 6; i++) c.box(notes, [.22, .2, .015], [-.4 + (i % 3) * .4, .18 - Math.floor(i / 3) * .34, .03], [C.mustard, C.rose, C.mint][i % 3], .01).rotation.z = (i % 2 ? .08 : -.06);
  const classics = c.group(root, [-2.7, 1.0, 1.85]);
  c.box(classics, [.55, .72, .05], [0, .38, 0], C.cherry, .02).rotation.x = -.15;
  c.box(classics, [.47, .62, .02], [0, .39, .03], C.paper, .01).rotation.x = -.15;
  burger(c, classics, [0, .5, .1], .32);
  const margin = c.group(root, [-3.0, 1.18, -2.86]);
  c.box(margin, [.36, .46, .015], [0, 0, 0], C.paper, .008);
  for (let r = 0; r < 4; r++) c.box(margin, [.24, .015, .008], [-.02, .12 - r * .08, .01], C.ink, .002);
  for (let r = 0; r < 3; r++) c.box(margin, [.05, .1, .008], [.14, .1 - r * .12, .012], C.red, .002).rotation.z = .3;
  counter(c, root, [-3.4, 0, 1.85], 1.8, .75, C.red);
  register(c, root, [-3.9, 1.0, 1.85]);
  person(c, root, [-3.4, 0, 1.15], { shirt: C.red, role: 'staff', skin: 4 });
  plant(c, root, [4.6, 0, 1.2], .85);
  tableSet(c, root, [3.3, 0, 2.7]);
  tableSet(c, root, [3.3, 0, .9]);
  const queue = queueLine(c, root, [-2.4, 0, 2.55], [.5, 0, .3], 4);
  const stations: Record<Station, StationPlace> = {
    terminal: { floor: units[0].floor, surface: units[0].surface },
    stock: place(-3.6, -2.2, -3.6, 1.18, -2.86),
    counter: place(-2.5, 1.15, -2.9, 1.0, 1.85),
    entrance: place(-1.1, 2.95, -1.1, 1.0, 2.95),
    kitchen: sideDoor(ctx, 'kitchen', -.3),
    pickup: backDoor(ctx, 'pickup', 2.25, C.mustard),
    dispatch: backDoor(ctx, 'dispatch', 3.45, C.red),
    branch: backDoor(ctx, 'branch', 4.5),
  };
  return {
    walls: { back: '#efe5d5', side: '#efe5d5', wainscot: C.walnut, floorA: '#c39a72', floorB: '#ad8660', trim: C.walnut },
    stations, units,
    board: { at: [LEFT + .04, 1.8, 1.9], rotationY: Math.PI / 2, width: 1.3 },
    resolve: (station, state) => {
      if (station !== 'terminal') return undefined;
      const index = state.units.findIndex((unit, i) => (unit.lit || unit.fresh) && i < state.count && !unit.down);
      return index >= 0 ? { floor: units[index].floor, surface: units[index].surface } : undefined;
    },
    apply: (state) => {
      catalog.visible = state.flags.has('catalog');
      guard.group.visible = state.flags.has('guard');
      notes.visible = state.flags.has('notes');
      classics.visible = state.flags.has('classics');
      margin.visible = state.flags.has('margin');
      const active = Math.max(0, state.units.findIndex(unit => unit.lit));
      spikes.forEach((spike, i) => {
        spike.visible = i === active && state.queue > 1;
        spike.children.slice(2).forEach((tk, k) => { tk.visible = k < state.queue; });
      });
      show(queue.map(p => p.group), state.customers ? Math.max(1, state.queue) : 1);
      ribbons.forEach((ribbon, i) => { ribbon.visible = state.flags.has('stream') && i === active; });
    },
    animate: (_clock, teaching, phase) => {
      ribbons.forEach(ribbon => { ribbon.scale.y = teaching ? .1 + phase * .78 : .7; });
    },
  };
};

const backup: KitBuilder = (ctx) => {
  const { c, root } = ctx;
  c.box(root, [.14, 1.5, 3.0], [0, .75, -2.0], '#d9cdbd', .02);
  c.box(root, [.2, .08, 3.0], [0, 1.54, -2.0], C.darkWood, .01);
  const sides = [-2.5, 2.5];
  const smokes: T.Mesh[][] = [];
  const utilities: T.Group[] = [];
  const kitchens: UnitHandle[] = sides.map((x, i) => {
    const g = c.group(root);
    c.box(g, [4.6, .03, 3.0], [x * 1.02, .02, -2.0], i ? '#dfe8e2' : '#efe2d2', .01).castShadow = false;
    hood(c, g, [x - .4, 2.25, -3.0], 1.9);
    grill(c, g, [x - .4, 0, -3.0], 1.5, 3);
    person(c, g, [x - .4, 0, -2.15], { shirt: C.white, role: 'cook', skin: i * 2 + 1, hair: i });
    shelf(c, g, [x + 1.35, 0, -3.15], .9, 1.6, .45, 'jars');
    const util = c.group(g, [x + 1.35, 1.95, -3.44]);
    c.box(util, [.5, .5, .1], [-.2, 0, 0], '#9aa7ad', .02);
    c.glow(util, 'sphere', .05, [-.2, .1, .07], '#57d07f');
    c.box(util, [.06, .5, .06], [-.2, -.45, .05], C.ink, .01);
    c.cylinder(util, .2, .2, .5, [.3, 0, .1], C.sky, 16);
    utilities.push(util);
    smokes.push(smoke(c, g, [x - .4, 1.4, -2.9]));
    return { root: g, top: v(x - .4, 2.75, -2.6), floor: v(x - .4, .05, -1.35), surface: v(x - .4, 1.08, -2.65) };
  });
  ctx.sign({ pt: 'Cozinha A', en: 'Kitchen A' }, [-2.9, 2.62, -3.4]);
  ctx.sign({ pt: 'Cozinha B', en: 'Kitchen B' }, [2.1, 2.62, -3.4]);
  counter(c, root, [.2, 0, 1.3], 2.6, .8, C.red);
  register(c, root, [-.5, 1.02, 1.3]);
  person(c, root, [.2, 0, .55], { shirt: C.red, role: 'staff', skin: 3 });
  counter(c, root, [3.5, 0, 1.5], 1.4, .75, C.teal);
  desk(c, root, [-3.7, 0, 1.0], 1.2);
  person(c, root, [-3.2, 0, .4], { shirt: C.green, role: 'manager', skin: 2 }).group.rotation.y = .4;
  const copy = c.group(root, [1.5, 0, -1.0]);
  c.box(copy, [.7, .55, .5], [0, .28, 0], '#59626b', .04);
  c.box(copy, [.5, .06, .36], [0, .6, 0], C.navy, .02);
  c.box(copy, [.18, .07, .01], [0, .3, .26], C.mustard, .005);
  const drill = c.group(root, [-1.0, 0, -.6]);
  c.box(drill, [.05, 1.2, .05], [0, .6, 0], C.ink, .01);
  c.box(drill, [.6, .45, .04], [0, 1.25, 0], C.mustard, .02);
  c.cylinder(drill, .14, .14, .05, [0, 1.25, .03], C.white, 16).rotation.x = Math.PI / 2;
  c.box(drill, [.02, .1, .02], [0, 1.29, .06], C.ink, .004);
  scooter(c, root, [4.0, 0, 3.05], C.mint, -.3);
  plant(c, root, [-4.6, 0, 3.2]);
  const stations: Record<Station, StationPlace> = {
    kitchen: { floor: kitchens[0].floor, surface: kitchens[0].surface },
    branch: { floor: kitchens[1].floor, surface: kitchens[1].surface },
    counter: place(.9, .55, .9, 1.05, 1.3),
    terminal: place(-2.9, 1.0, -3.6, .9, 1.0),
    pickup: place(3.4, 2.2, 3.5, 1.0, 1.5),
    entrance: place(-1.4, 2.9, -1.4, 1.0, 2.9),
    dispatch: place(3.1, 2.6, 3.65, 1.15, 3.05),
    stock: sideDoor(ctx, 'stock', -1.3),
  };
  return {
    walls: { back: '#f2e7d8', side: '#f2e7d8', wainscot: C.teal, floorA: '#f1ebe1', floorB: '#d8cdbf', trim: C.walnut },
    stations, units: kitchens,
    board: { at: [0, 2.05, -3.44], rotationY: 0, width: 1.4, height: .7 },
    route: (a, b) => (a.z < .2 && b.z < .2 && Math.sign(a.x) !== Math.sign(b.x)) ? [v(a.x < 0 ? -.6 : .6, .05, .1), v(b.x < 0 ? -.6 : .6, .05, .1)] : [],
    apply: (state) => {
      smokes.forEach((puffs, i) => puffs.forEach(puff => { puff.visible = !!state.units[i]?.down; }));
      utilities.forEach(util => { util.visible = state.flags.has('utilities'); });
      copy.visible = state.flags.has('copy');
      drill.visible = state.flags.has('drill');
    },
    animate: (clock, teaching) => {
      smokes.forEach(puffs => puffs.forEach((puff, i) => {
        const cycle = ((teaching ? clock * .35 : .3) + i / puffs.length) % 1;
        puff.position.y = 1.3 + cycle * 1.3; puff.scale.setScalar(.6 + cycle * .8);
      }));
    },
  };
};

export const kitBuilders: Record<KitId, KitBuilder> = { line, rail, grills, host, network, pantry, vault, cache, security, office, delivery, library, backup };