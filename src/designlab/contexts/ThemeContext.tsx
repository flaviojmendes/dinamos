// Shim: vendored designLab code imports ThemeContext from here.
// Re-export the single shared Dinamos ThemeProvider/useTheme so there is one
// theme source of truth across the merged app.
export { ThemeProvider, useTheme } from '../../contexts/ThemeContext';
