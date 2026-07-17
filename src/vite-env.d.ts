/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** When `"true"`, skip CDN manifest/body reads and use the content API only. */
  readonly VITE_FORCE_CONTENT_API?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
