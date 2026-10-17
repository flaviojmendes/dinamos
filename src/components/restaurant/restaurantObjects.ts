import type * as T from 'three';
import type { RestaurantProp } from './visualModel';

type Position = [number, number, number];
export interface RestaurantCraft {
  group: (parent?: T.Object3D, at?: Position) => T.Group;
  box: (parent: T.Object3D, size: Position, at: Position, color: string, radius?: number) => T.Mesh;
  cylinder: (parent: T.Object3D, top: number, bottom: number, height: number, at: Position, color: string, segments?: number) => T.Mesh;
  sphere: (parent: T.Object3D, radius: number, at: Position, color: string) => T.Mesh;
}

export const restaurantPropNames: Record<'en' | 'pt', Record<RestaurantProp, string>> = {
  pt: { customer: 'Cliente', order: 'Comanda', receipt: 'Recibo', ledger: 'Livro de registros', menu: 'Cardápio', tray: 'Bandeja de hambúrguer', ingredient: 'Caixa de ingredientes', recipe: 'Caderno de receitas', 'delivery-bag': 'Sacola de entrega', checklist: 'Lista de conferência', clock: 'Relógio de atendimento', badge: 'Crachá da equipe', 'sealed-order': 'Comanda lacrada', key: 'Chave do estoque' },
  en: { customer: 'Customer', order: 'Order ticket', receipt: 'Receipt', ledger: 'Record book', menu: 'Menu', tray: 'Burger tray', ingredient: 'Ingredient crate', recipe: 'Recipe book', 'delivery-bag': 'Delivery bag', checklist: 'Checklist', clock: 'Service clock', badge: 'Staff badge', 'sealed-order': 'Sealed order', key: 'Stockroom key' },
};

/** Small, recognizable objects from the restaurant. Never computer or network symbols. */
export function makeRestaurantObject(craft: RestaurantCraft, parent: T.Object3D, kind: RestaurantProp) {
  const { group, box, cylinder, sphere } = craft;
  const object = group(parent);
  const paper = '#fff4db', ink = '#514739', pink = '#d75073', mint = '#76aa78', gold = '#d8a34c';
  const lines = (holder: T.Object3D, width = .3, count = 3, y = .1, z = .024) => {
    for (let row = 0; row < count; row++) box(holder, [width - (row % 2) * .06, .018, .008], [0, y - row * .075, z], ink, .002);
  };
  const burgerEmblem = (holder: T.Object3D, y: number, z: number) => {
    box(holder, [.24, .075, .025], [0, y + .065, z], gold, .025);
    box(holder, [.26, .028, .03], [0, y + .005, z], mint, .006);
    box(holder, [.23, .04, .025], [0, y - .035, z], '#75503a', .008);
    box(holder, [.24, .055, .025], [0, y - .085, z], gold, .02);
  };
  if (kind === 'customer') return object; // The director uses a complete walking customer.
  if (kind === 'tray') {
    box(object, [.85, .055, .6], [0, 0, 0], '#b9c3c3', .05);
    for (const x of [-.39, .39]) box(object, [.035, .08, .56], [x, .04, 0], '#899e9f', .012);
    cylinder(object, .19, .21, .065, [0, .065, 0], gold);
    cylinder(object, .22, .2, .045, [0, .12, 0], mint);
    cylinder(object, .2, .2, .06, [0, .17, 0], '#75503a');
    const bun = sphere(object, .21, [0, .23, 0], gold); bun.scale.y = .58;
    for (const x of [-.29, -.23, -.17]) box(object, [.035, .04, .2], [x, .08, .1], '#f1c361', .007);
  } else if (kind === 'ingredient') {
    box(object, [.72, .34, .52], [0, -.04, 0], '#a6754b', .025);
    box(object, [.62, .045, .43], [0, .15, 0], '#76573a', .008);
    for (const x of [-.21, 0, .21]) {
      const lettuce = sphere(object, .13, [x, .2, 0], x === 0 ? '#d36e50' : '#7ea563'); lettuce.scale.y = .7;
    }
    box(object, [.3, .15, .015], [0, -.035, .27], paper, .008);
  } else if (kind === 'delivery-bag') {
    box(object, [.48, .52, .32], [0, .03, 0], '#bd8957', .025);
    box(object, [.43, .045, .29], [0, .3, 0], '#d4a56b', .012);
    for (const x of [-.1, .1]) box(object, [.025, .18, .025], [x, .38, 0], ink, .006);
    box(object, [.22, .025, .025], [0, .47, 0], ink, .006);
    burgerEmblem(object, .06, .174);
  } else if (kind === 'clock') {
    cylinder(object, .3, .3, .08, [0, 0, 0], ink, 24).rotation.x = Math.PI / 2;
    cylinder(object, .26, .26, .085, [0, 0, .015], paper, 24).rotation.x = Math.PI / 2;
    box(object, [.025, .19, .02], [0, .085, .07], ink, .005).rotation.z = -.25;
    box(object, [.14, .025, .02], [.055, .01, .075], pink, .005);
    for (const y of [-.21, .21]) box(object, [.022, .035, .02], [0, y, .07], ink, .003);
    for (const x of [-.21, .21]) box(object, [.035, .022, .02], [x, 0, .07], ink, .003);
    box(object, [.15, .09, .14], [0, -.31, 0], ink, .01);
  } else if (kind === 'key') {
    cylinder(object, .12, .12, .045, [0, .14, 0], gold, 12).rotation.x = Math.PI / 2;
    cylinder(object, .067, .067, .05, [0, .14, .008], ink, 12).rotation.x = Math.PI / 2;
    box(object, [.045, .34, .045], [0, -.11, 0], gold, .006);
    for (const y of [-.19, -.25]) box(object, [.12, .045, .045], [.04, y, 0], gold, .005);
    box(object, [.21, .16, .02], [-.2, .12, .01], paper, .015);
  } else if (kind === 'ledger' || kind === 'recipe') {
    box(object, [.75, .065, .53], [0, -.035, 0], kind === 'ledger' ? '#5e816d' : pink, .025);
    for (const x of [-.185, .185]) {
      box(object, [.345, .07, .47], [x, .025, 0], paper, .012);
      for (let row = 0; row < 4; row++) box(object, [.27, .006, .012], [x, .064, -.15 + row * .09], ink, .002);
    }
    box(object, [.02, .085, .47], [0, .03, 0], '#d7c7a2', .005);
    for (let i = 0; i < 3; i++) box(object, [.08, .013, .07], [.32, .073, -.13 + i * .12], [pink, mint, gold][i], .003);
    if (kind === 'recipe') {
      const card = group(object, [0, .08, -.12]); card.rotation.x = -Math.PI / 2;
      box(card, [.28, .2, .02], [0, 0, 0], paper, .01); burgerEmblem(card, 0, .02); card.scale.setScalar(.6);
    }
  } else if (kind === 'sealed-order') {
    box(object, [.57, .39, .045], [0, 0, 0], '#e2c89f', .015);
    box(object, [.33, .018, .012], [-.09, .04, .03], ink, .003).rotation.z = -.5;
    box(object, [.33, .018, .012], [.09, .04, .03], ink, .003).rotation.z = .5;
    cylinder(object, .07, .07, .025, [0, -.015, .045], pink, 12).rotation.x = Math.PI / 2;
  } else if (kind === 'menu') {
    box(object, [.57, .72, .045], [0, .06, 0], '#3f6458', .025);
    box(object, [.48, .61, .015], [0, .06, .03], paper, .012);
    burgerEmblem(object, .17, .05); lines(object, .32, 3, -.03, .05);
    box(object, [.48, .06, .2], [0, -.31, -.035], '#8f6647', .01);
  } else if (kind === 'badge') {
    for (const x of [-.1, .1]) box(object, [.025, .35, .025], [x, .26, 0], pink, .005).rotation.z = x * 1.4;
    box(object, [.4, .46, .04], [0, -.08, 0], paper, .025);
    box(object, [.31, .045, .012], [0, .1, .03], pink, .003);
    sphere(object, .065, [-.075, -.025, .04], '#c39372').scale.z = .15;
    box(object, [.12, .1, .015], [-.075, -.12, .04], '#668975', .015); lines(object, .13, 2, -.04, .045);
  } else {
    const clipboard = kind === 'checklist';
    if (clipboard) box(object, [.55, .72, .06], [0, 0, -.025], '#98734f', .025);
    box(object, [kind === 'receipt' ? .31 : .46, kind === 'receipt' ? .76 : .62, .025], [0, 0, .015], paper, .012);
    if (clipboard) box(object, [.2, .07, .045], [0, .31, .02], '#8b9c9d', .008);
    box(object, [.31, .055, .012], [0, .21, .035], pink, .004);
    lines(object, kind === 'receipt' ? .23 : .3, 4, .1, .035);
    if (clipboard) for (let row = 0; row < 3; row++) box(object, [.045, .045, .015], [-.17, .1 - row * .075, .04], mint, .004);
  }
  object.userData.restaurantProp = kind;
  return object;
}
