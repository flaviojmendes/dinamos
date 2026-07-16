export const COMMAND_PALETTE_OPEN_EVENT = 'command-palette:open';

/** Imperatively open the global command palette from anywhere. */
export function openCommandPalette() {
  window.dispatchEvent(new CustomEvent(COMMAND_PALETTE_OPEN_EVENT));
}
