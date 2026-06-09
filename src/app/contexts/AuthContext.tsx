// Shim: vendored designLab pages/components import useAuth from here.
// Re-export the unified Dinamos AuthContext (a superset of both APIs).
export { AuthProvider, useAuth } from '../../contexts/AuthContext';
export type { AppUser } from '../../contexts/AuthContext';
