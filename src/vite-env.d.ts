/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MATRIX_DEFAULT_SERVER: string
  readonly VITE_MATRIX_FALLBACK_SERVER: string
  readonly VITE_MATRIX_DEFAULT_ROOM: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}