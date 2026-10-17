import type * as T from 'three';

export type Position = [number, number, number];
export interface Craft {
  group: (parent?: T.Object3D, at?: Position) => T.Group;
  box: (parent: T.Object3D, size: Position, at: Position, color: string, radius?: number) => T.Mesh;
  cylinder: (parent: T.Object3D, top: number, bottom: number, height: number, at: Position, color: string, segments?: number) => T.Mesh;
  sphere: (parent: T.Object3D, radius: number, at: Position, color: string) => T.Mesh;
  torus: (parent: T.Object3D, radius: number, tube: number, at: Position, color: string) => T.Mesh;
  cone: (parent: T.Object3D, radius: number, height: number, at: Position, color: string, segments?: number) => T.Mesh;
  /** Lit surfaces: lamps, neon and indicator lights. */
  glow: (parent: T.Object3D, kind: 'sphere' | 'box', size: number | Position, at: Position, color: string) => T.Mesh;
}

export const C = {
  cream: '#f7ecd9', tileA: '#f4efe6', tileB: '#ddd3c6', red: '#d9434e', cherry: '#b5313c', mustard: '#f0b545',
  mint: '#86c9b1', teal: '#3d8c7d', navy: '#2f3a52', wood: '#bd8759', darkWood: '#7b5337', walnut: '#5b3b27',
  steel: '#c4cdd1', chrome: '#e3e8ea', ink: '#232b38', white: '#fffaf0', pink: '#ec6f95', rose: '#f4b3c2',
  green: '#6fb985', sky: '#a7c9df', brick: '#c9765a', lettuce: '#78b459', patty: '#6a3f2e', cheese: '#f7c443',
  bun: '#e7a548', paper: '#fff4db', kraft: '#c99a66', charcoal: '#3b3d45', tomato: '#e0533f', blue: '#5b84b5',
  lilac: '#a993c9', asphalt: '#6d7479', curb: '#c9cfd0',
};
const skins = ['#e2b08f', '#c98d6a', '#9d6647', '#f0c6a5', '#7d4e35'];
const hairs = ['#3b2a22', '#6b4a33', '#1f1a18', '#a8673b', '#d9b26a'];

export interface Person { group: T.Group; arms: T.Group[]; legs: T.Object3D[] }
export interface PersonStyle { shirt: string; role?: 'cook' | 'staff' | 'manager' | 'customer' | 'guard' | 'courier' | 'advisor'; skin?: number; hair?: number }

export function person(c: Craft, parent: T.Object3D, at: Position, style: PersonStyle): Person {
  const g = c.group(parent, at);
  const skin = skins[(style.skin ?? 0) % skins.length];
  const hair = hairs[(style.hair ?? 0) % hairs.length];
  const role = style.role ?? 'customer';
  const pants = role === 'cook' ? '#4a4f5c' : role === 'guard' ? C.ink : role === 'customer' ? '#4f6a8f' : C.navy;
  const legs: T.Object3D[] = [];
  for (const x of [-.095, .095]) {
    legs.push(c.box(g, [.13, .42, .14], [x, .29, 0], pants, .045));
    c.box(g, [.15, .08, .24], [x, .06, .05], C.ink, .035);
  }
  c.cylinder(g, .2, .23, .54, [0, .8, 0], style.shirt, 14).castShadow = false;
  if (role === 'cook' || role === 'staff') {
    c.box(g, [.3, .5, .06], [0, .7, .2], role === 'cook' ? C.white : C.red, .03);
    c.box(g, [.32, .04, .05], [0, .9, .21], role === 'cook' ? C.red : C.white, .01);
  }
  if (role === 'manager') { c.box(g, [.07, .3, .03], [0, .82, .22], C.red, .01); }
  if (role === 'guard') { c.box(g, [.12, .08, .03], [.09, .92, .21], C.mustard, .01); }
  if (role === 'courier') { c.box(g, [.36, .4, .22], [0, .86, -.24], C.red, .05); }
  c.sphere(g, .22, [0, 1.24, 0], skin);
  for (const x of [-.075, .075]) c.sphere(g, .02, [x, 1.26, .205], C.ink);
  c.box(g, [.08, .018, .01], [0, 1.17, .21], '#9c5a4a', .004);
  if (role === 'cook') {
    c.cylinder(g, .21, .2, .16, [0, 1.45, 0], C.white, 16);
    for (const [x, z] of [[-.1, 0], [.1, 0], [0, .08], [0, -.08]]) c.sphere(g, .12, [x, 1.56, z], C.white);
  } else if (role === 'staff') {
    const cap = c.sphere(g, .23, [0, 1.32, -.01], C.red); cap.scale.y = .55;
    c.box(g, [.26, .03, .16], [0, 1.31, .2], C.red, .01);
  } else if (role === 'courier') {
    const helmet = c.sphere(g, .25, [0, 1.3, 0], C.mustard); helmet.scale.y = .78;
  } else if (role === 'guard') {
    const cap = c.cylinder(g, .23, .23, .1, [0, 1.42, 0], C.ink, 16); cap.scale.z = 1;
    c.box(g, [.28, .025, .14], [0, 1.38, .19], C.ink, .01);
  } else {
    const top = c.sphere(g, .235, [0, 1.31, -.02], hair); top.scale.y = .55;
    if (role === 'advisor') {
      for (const x of [-.08, .08]) c.torus(g, .045, .01, [x, 1.26, .215], C.ink);
    }
  }
  const arms: T.Group[] = [];
  for (const x of [-.27, .27]) {
    const arm = c.group(g, [x, .98, 0]);
    c.cylinder(arm, .065, .06, .38, [0, -.18, 0], style.shirt, 10);
    c.sphere(arm, .07, [0, -.39, 0], skin);
    arms.push(arm);
  }
  return { group: g, arms, legs };
}

export function burger(c: Craft, parent: T.Object3D, at: Position, scale = 1) {
  const g = c.group(parent, at); g.scale.setScalar(scale);
  c.cylinder(g, .22, .24, .08, [0, .04, 0], C.bun, 18);
  c.cylinder(g, .25, .24, .04, [0, .1, 0], C.lettuce, 18);
  c.cylinder(g, .23, .23, .07, [0, .155, 0], C.patty, 18);
  c.box(g, [.38, .022, .38], [0, .2, 0], C.cheese, .01).rotation.y = .4;
  const bun = c.sphere(g, .235, [0, .23, 0], C.bun); bun.scale.y = .58;
  for (const [x, z] of [[-.08, -.06], [.1, -.03], [0, .1], [-.02, -.12]]) c.sphere(g, .017, [x, .36, z], C.white).scale.set(1, .4, .5);
  return g;
}
export function fries(c: Craft, parent: T.Object3D, at: Position, scale = 1) {
  const g = c.group(parent, at); g.scale.setScalar(scale);
  c.box(g, [.2, .22, .12], [0, .11, 0], C.red, .02);
  for (let i = 0; i < 6; i++) c.box(g, [.03, .2, .03], [-.07 + i * .028, .27 + (i % 2) * .03, (i % 3 - 1) * .025], C.cheese, .006).rotation.z = (i - 2.5) * .08;
  return g;
}
export function soda(c: Craft, parent: T.Object3D, at: Position, color = C.red, scale = 1) {
  const g = c.group(parent, at); g.scale.setScalar(scale);
  c.cylinder(g, .1, .08, .28, [0, .14, 0], C.white, 14);
  c.cylinder(g, .101, .085, .1, [0, .16, 0], color, 14);
  c.cylinder(g, .105, .105, .03, [0, .29, 0], C.white, 14);
  c.box(g, [.022, .2, .022], [.03, .38, 0], color, .005).rotation.z = -.2;
  return g;
}
export function sauces(c: Craft, parent: T.Object3D, at: Position) {
  const g = c.group(parent, at);
  for (const [x, color] of [[-.07, C.red], [.07, C.mustard]] as const) {
    c.cylinder(g, .055, .06, .22, [x, .11, 0], color, 12);
    c.cone(g, .05, .09, [x, .26, 0], color, 10);
  }
  return g;
}

export function counter(c: Craft, parent: T.Object3D, at: Position, width: number, depth = .8, front = C.red, top = C.wood) {
  const g = c.group(parent, at);
  c.box(g, [width, .92, depth], [0, .46, 0], front, .06);
  c.box(g, [width + .14, .1, depth + .16], [0, .97, 0], top, .05);
  c.box(g, [width - .1, .08, .03], [0, .12, depth / 2 + .005], C.ink, .01);
  c.box(g, [width - .16, .05, .02], [0, .7, depth / 2 + .01], C.white, .01);
  return g;
}
export function register(c: Craft, parent: T.Object3D, at: Position) {
  const g = c.group(parent, at);
  c.box(g, [.42, .14, .32], [0, .07, 0], C.navy, .04);
  const screen = c.box(g, [.36, .26, .05], [0, .3, -.06], C.ink, .02); screen.rotation.x = -.3;
  c.box(g, [.3, .2, .012], [0, .31, -.03], C.mint, .01).rotation.x = -.3;
  c.box(g, [.2, .02, .1], [0, .15, .08], C.paper, .005);
  return g;
}
export function grill(c: Craft, parent: T.Object3D, at: Position, width = 1.2, patties = 3) {
  const g = c.group(parent, at);
  c.box(g, [width, .9, .9], [0, .45, 0], C.steel, .05);
  c.box(g, [width + .06, .08, .96], [0, .94, 0], C.charcoal, .02);
  c.box(g, [width - .12, .02, .78], [0, .99, 0], '#2a2c31', .01);
  for (let i = 0; i < patties; i++) {
    const x = -width / 2 + (i + .5) * (width / patties);
    c.cylinder(g, .14, .14, .05, [x, 1.02, (i % 2 ? .12 : -.1)], C.patty, 14);
  }
  for (let i = 0; i < 3; i++) c.cylinder(g, .045, .045, .05, [-width / 3 + i * width / 3, .76, .46], C.ink, 10).rotation.x = Math.PI / 2;
  c.box(g, [width - .2, .03, .03], [0, .58, .46], C.ink, .01);
  return g;
}
export function hood(c: Craft, parent: T.Object3D, at: Position, width: number) {
  const g = c.group(parent, at);
  c.box(g, [width, .32, .9], [0, 0, 0], C.chrome, .06);
  c.box(g, [width - .2, .04, .7], [0, -.17, .02], '#ffe7b6', .02);
  return g;
}
export function shelf(c: Craft, parent: T.Object3D, at: Position, width = 1.4, height = 2, depth = .55, fill: 'crates' | 'books' | 'jars' | 'binders' | 'none' = 'crates', frame = C.darkWood) {
  const g = c.group(parent, at);
  for (const x of [-width / 2, width / 2]) c.box(g, [.06, height, depth], [x, height / 2, 0], frame, .015);
  const levels = Math.max(3, Math.round(height / .5));
  for (let i = 0; i < levels; i++) {
    const y = .08 + i * (height - .12) / (levels - 1);
    c.box(g, [width, .05, depth], [0, y, 0], frame, .01);
    if (i === levels - 1 || fill === 'none') continue;
    const items = fill === 'crates' ? 2 : fill === 'jars' ? 4 : 7;
    for (let j = 0; j < items; j++) {
      const x = -width / 2 + .12 + (j + .5) * ((width - .24) / items);
      if (fill === 'crates') c.box(g, [(width - .4) / 2, .3, depth - .1], [x, y + .18, 0], j % 2 ? C.kraft : '#d7b98d', .02);
      else if (fill === 'jars') { c.cylinder(g, .09, .09, .24, [x, y + .15, 0], [C.tomato, C.cheese, C.lettuce, C.white][(j + i) % 4], 12); c.cylinder(g, .095, .095, .04, [x, y + .29, 0], C.ink, 12); }
      else { const book = c.box(g, [.12, .32 + (j % 3) * .03, depth - .14], [x, y + .2, 0], [C.red, C.teal, C.mustard, C.navy, C.pink, C.green, C.blue][(j + i * 2) % 7], .01); if (fill === 'binders') book.scale.x = 1.2; }
    }
  }
  return g;
}
export function desk(c: Craft, parent: T.Object3D, at: Position, width = 1.3, color = C.wood) {
  const g = c.group(parent, at);
  c.box(g, [width, .08, .72], [0, .82, 0], color, .03);
  c.box(g, [.42, .74, .66], [width / 2 - .24, .4, 0], C.darkWood, .03);
  for (let i = 0; i < 2; i++) c.box(g, [.3, .02, .02], [width / 2 - .24, .58 - i * .3, .335], C.chrome, .005);
  for (const [x, z] of [[-width / 2 + .06, -.3], [-width / 2 + .06, .3]]) c.box(g, [.06, .78, .06], [x, .4, z], C.darkWood, .01);
  return g;
}
export function chair(c: Craft, parent: T.Object3D, at: Position, color = C.red, facing = 0) {
  const g = c.group(parent, at); g.rotation.y = facing;
  c.cylinder(g, .22, .24, .08, [0, .5, 0], color, 16);
  c.box(g, [.42, .4, .06], [0, .76, -.2], color, .03);
  c.cylinder(g, .04, .04, .44, [0, .26, 0], C.chrome, 8);
  c.cylinder(g, .2, .22, .04, [0, .03, 0], C.chrome, 14);
  return g;
}
export function stool(c: Craft, parent: T.Object3D, at: Position, color = C.red) {
  const g = c.group(parent, at);
  c.cylinder(g, .2, .2, .09, [0, .66, 0], color, 16);
  c.cylinder(g, .04, .04, .62, [0, .33, 0], C.chrome, 8);
  c.cylinder(g, .17, .19, .04, [0, .03, 0], C.chrome, 14);
  c.torus(g, .13, .015, [0, .3, 0], C.chrome).rotation.x = Math.PI / 2;
  return g;
}
export function lamp(c: Craft, parent: T.Object3D, at: Position) {
  const g = c.group(parent, at);
  c.cylinder(g, .1, .12, .03, [0, 0, 0], C.ink, 12);
  c.box(g, [.025, .36, .025], [0, .18, 0], C.ink, .005).rotation.z = .25;
  c.cone(g, .1, .14, [.06, .36, 0], C.mustard, 12).rotation.z = Math.PI;
  c.glow(g, 'sphere', .045, [.06, .3, 0], '#fff1b8');
  return g;
}
export function podium(c: Craft, parent: T.Object3D, at: Position, color = C.navy) {
  const g = c.group(parent, at);
  c.box(g, [.62, .98, .46], [0, .49, 0], color, .05);
  const top = c.box(g, [.7, .06, .5], [0, 1.04, -.02], C.wood, .02); top.rotation.x = -.18;
  c.box(g, [.42, .03, .3], [0, 1.08, 0], C.paper, .008).rotation.x = -.18;
  c.box(g, [.5, .05, .02], [0, .7, .24], C.mustard, .01);
  return g;
}
export function door(c: Craft, parent: T.Object3D, at: Position, rotationY: number, color = C.teal) {
  const g = c.group(parent, at); g.rotation.y = rotationY;
  c.box(g, [1.04, 2.04, .1], [0, 1.02, 0], C.darkWood, .02);
  c.box(g, [.86, 1.9, .07], [0, .97, .04], color, .02);
  c.box(g, [.5, .44, .02], [0, 1.45, .085], C.sky, .01);
  c.sphere(g, .045, [.32, .95, .1], C.mustard);
  c.box(g, [.6, .08, .02], [0, 2.1, .04], C.ink, .01);
  return g;
}
export function kiosk(c: Craft, parent: T.Object3D, at: Position, awning = C.red) {
  const g = c.group(parent, at);
  c.box(g, [1.5, .08, 1.3], [0, .04, 0], '#d9d0c1', .03);
  c.box(g, [1.4, 1.9, .08], [0, 1.03, -.58], C.cream, .02);
  for (const x of [-.68, .68]) c.box(g, [.07, 2.05, .07], [x, 1.05, .55], C.darkWood, .015);
  c.box(g, [1.6, .12, 1.4], [0, 2.1, .05], awning, .03);
  for (let i = 0; i < 5; i++) c.box(g, [.15, .03, 1.42], [-.6 + i * .3, 2.17, .05], C.white, .006);
  for (let i = 0; i < 6; i++) { const flap = c.cone(g, .13, .16, [-.66 + i * .265, 1.97, .76], i % 2 ? C.white : awning, 3); flap.rotation.x = Math.PI; }
  counter(c, g, [0, 0, .4], 1.3, .45, awning, C.wood);
  c.box(g, [.7, .5, .04], [0, 1.45, -.53], C.ink, .02);
  return g;
}
export function scooter(c: Craft, parent: T.Object3D, at: Position, color = C.mint, rotationY = 0) {
  const g = c.group(parent, at); g.rotation.y = rotationY;
  for (const x of [-.5, .5]) {
    c.cylinder(g, .22, .22, .13, [x, .22, 0], C.ink, 16).rotation.x = Math.PI / 2;
    c.cylinder(g, .11, .11, .14, [x, .22, 0], C.steel, 12).rotation.x = Math.PI / 2;
  }
  c.box(g, [1.06, .16, .34], [0, .44, 0], color, .07);
  c.box(g, [.46, .14, .34], [-.12, .66, 0], C.ink, .05);
  c.box(g, [.11, .72, .14], [.42, .74, 0], color, .03).rotation.z = -.22;
  c.box(g, [.5, .05, .05], [.5, 1.1, 0], C.ink, .01);
  c.box(g, [.46, .44, .44], [-.42, .9, 0], C.red, .05);
  burgerBadge(c, g, [-.42, .92, .225]);
  return g;
}
export function burgerBadge(c: Craft, parent: T.Object3D, at: Position, scale = 1) {
  const g = c.group(parent, at); g.scale.setScalar(scale);
  c.box(g, [.22, .07, .02], [0, .06, 0], C.bun, .02);
  c.box(g, [.24, .025, .025], [0, .01, 0], C.lettuce, .005);
  c.box(g, [.21, .04, .02], [0, -.03, 0], C.patty, .008);
  c.box(g, [.22, .05, .02], [0, -.075, 0], C.bun, .018);
  return g;
}
export function plant(c: Craft, parent: T.Object3D, at: Position, scale = 1) {
  const g = c.group(parent, at); g.scale.setScalar(scale);
  c.cylinder(g, .24, .17, .38, [0, .19, 0], C.brick, 14);
  c.cylinder(g, .22, .22, .04, [0, .37, 0], '#6b5540', 14);
  for (let i = 0; i < 7; i++) {
    const a = i * 2.4;
    const leaf = c.sphere(g, .19, [Math.cos(a) * .14, .6 + (i % 3) * .12, Math.sin(a) * .14], i % 2 ? '#6fa58b' : '#3f7a62');
    leaf.scale.set(.6, 1.6, .45); leaf.rotation.z = Math.cos(a) * .45;
  }
  return g;
}
export function table(c: Craft, parent: T.Object3D, at: Position, radius = .55) {
  const g = c.group(parent, at);
  c.cylinder(g, radius, radius, .07, [0, .78, 0], C.cream, 24);
  c.torus(g, radius, .025, [0, .78, 0], C.chrome).rotation.x = Math.PI / 2;
  c.cylinder(g, .05, .05, .74, [0, .4, 0], C.chrome, 8);
  c.cylinder(g, .26, .3, .04, [0, .02, 0], C.chrome, 16);
  return g;
}
export function chalkboard(c: Craft, parent: T.Object3D, at: Position, rotationY: number, width = 1.9, height = 1) {
  const g = c.group(parent, at); g.rotation.y = rotationY;
  c.box(g, [width + .12, height + .12, .06], [0, 0, 0], C.darkWood, .02);
  c.box(g, [width, height, .03], [0, 0, .025], '#2f4a3e', .01);
  c.box(g, [width * .6, .03, .05], [0, -height / 2 - .02, .05], C.darkWood, .01);
  return g;
}
export function trafficCone(c: Craft, parent: T.Object3D, at: Position, scale = 1) {
  const g = c.group(parent, at); g.scale.setScalar(scale);
  c.box(g, [.34, .04, .34], [0, .02, 0], C.tomato, .01);
  c.cone(g, .14, .48, [0, .27, 0], C.tomato, 14);
  c.cylinder(g, .085, .1, .07, [0, .27, 0], C.white, 14);
  return g;
}
export function sawhorse(c: Craft, parent: T.Object3D, at: Position) {
  const g = c.group(parent, at);
  for (const x of [-.5, .5]) for (const z of [-.12, .12]) c.box(g, [.05, .7, .05], [x, .33, z], C.ink, .01).rotation.x = z > 0 ? -.2 : .2;
  c.box(g, [1.2, .16, .05], [0, .62, 0], C.white, .02);
  for (let i = 0; i < 4; i++) c.box(g, [.14, .165, .055], [-.45 + i * .3, .62, 0], C.tomato, .01).rotation.z = .6;
  return g;
}
export function ticket(c: Craft, parent: T.Object3D, at: Position, accent = C.red) {
  const g = c.group(parent, at);
  c.box(g, [.22, .3, .015], [0, 0, 0], C.paper, .01);
  c.box(g, [.17, .04, .01], [0, .09, .012], accent, .003);
  for (let i = 0; i < 2; i++) c.box(g, [.14 - i * .04, .018, .008], [0, .01 - i * .06, .012], C.ink, .002);
  return g;
}
export function ticketRail(c: Craft, parent: T.Object3D, at: Position, length: number, slots: number) {
  const g = c.group(parent, at);
  c.box(g, [length, .06, .08], [0, 0, 0], C.chrome, .02);
  const tickets: T.Group[] = [];
  for (let i = 0; i < slots; i++) {
    const x = -length / 2 + (i + .5) * (length / slots);
    tickets.push(ticket(c, g, [x, -.18, .05], i % 3 === 0 ? C.red : i % 3 === 1 ? C.teal : C.mustard));
  }
  return { group: g, tickets };
}
export function bell(c: Craft, parent: T.Object3D, at: Position) {
  const g = c.group(parent, at);
  c.cylinder(g, .12, .13, .03, [0, .015, 0], C.ink, 16);
  const dome = c.sphere(g, .1, [0, .05, 0], C.mustard); dome.scale.y = .8;
  c.sphere(g, .025, [0, .14, 0], C.mustard);
  return g;
}
export function stanchion(c: Craft, parent: T.Object3D, at: Position) {
  const g = c.group(parent, at);
  c.cylinder(g, .15, .18, .06, [0, .03, 0], C.ink, 14);
  c.cylinder(g, .03, .03, .78, [0, .42, 0], C.chrome, 8);
  c.sphere(g, .06, [0, .84, 0], C.mustard);
  return g;
}
export function rope(c: Craft, parent: T.Object3D, from: Position, to: Position, color = C.red) {
  const dx = to[0] - from[0], dz = to[2] - from[2];
  const length = Math.hypot(dx, dz);
  const piece = c.box(parent, [length, .05, .05], [(from[0] + to[0]) / 2, from[1], (from[2] + to[2]) / 2], color, .02);
  piece.rotation.y = -Math.atan2(dz, dx);
  return piece;
}
export function breakerPanel(c: Craft, parent: T.Object3D, at: Position, rotationY: number) {
  const g = c.group(parent, at); g.rotation.y = rotationY;
  c.box(g, [.7, .9, .12], [0, 0, 0], '#8e9aa0', .03);
  c.box(g, [.56, .74, .03], [0, 0, .06], '#dfe4e6', .01);
  c.box(g, [.12, .36, .05], [0, 0, .08], C.ink, .01);
  const lever = c.group(g, [0, 0, .12]);
  c.box(lever, [.08, .26, .06], [0, .12, 0], C.red, .02);
  const lights = [c.glow(g, 'sphere', .045, [-.2, .28, .09], C.green), c.glow(g, 'sphere', .045, [.2, .28, .09], C.tomato)];
  return { group: g, lever, lights };
}
export function markToken(c: Craft, parent: T.Object3D, kind: 'yes' | 'no' | 'wait') {
  const g = c.group(parent);
  const color = kind === 'yes' ? '#3f9d63' : kind === 'no' ? '#d0423d' : '#e3a33a';
  c.cylinder(g, .17, .17, .05, [0, 0, 0], color, 20).rotation.x = Math.PI / 2;
  c.torus(g, .17, .018, [0, 0, 0], C.white);
  if (kind === 'yes') {
    c.box(g, [.05, .11, .03], [-.045, -.02, .035], C.white, .008).rotation.z = .75;
    c.box(g, [.05, .2, .03], [.035, .02, .035], C.white, .008).rotation.z = -.6;
  } else if (kind === 'no') {
    for (const angle of [-.78, .78]) c.box(g, [.05, .22, .03], [0, 0, .035], C.white, .008).rotation.z = angle;
  } else {
    c.cone(g, .065, .08, [0, .045, .035], C.white, 10).rotation.x = Math.PI;
    c.cone(g, .065, .08, [0, -.045, .035], C.white, 10);
  }
  c.cylinder(g, .015, .015, .4, [0, -.36, 0], C.darkWood, 6);
  return g;
}
