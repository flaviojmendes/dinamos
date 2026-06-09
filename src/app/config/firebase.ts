// Shim: the vendored designLab code imports firebase from here.
// Re-export the single shared Dinamos Firebase app/auth instance.
export { auth } from '../../config/firebase';
export { default } from '../../config/firebase';
