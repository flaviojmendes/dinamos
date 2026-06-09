// In the merged Dinamos app, global navigation/chrome is provided by the host
// shell (sidebar + TopStatusBar in src/App.tsx). The vendored designLab pages
// still render <Navbar /> internally, so this is intentionally a no-op to avoid
// a duplicated header. DinaCoins balance and the Admin menu live in the shell's
// TopStatusBar instead.
export default function Navbar() {
  return null;
}
