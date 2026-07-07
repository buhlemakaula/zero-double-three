import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Builds one self-contained index.html (JS + CSS + fonts inlined as data URIs)
// for publishing the functional preview as an Artifact.
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  build: {
    outDir: 'dist-artifact',
    cssCodeSplit: false,
    assetsInlineLimit: 100_000_000, // inline every asset (fonts, etc.) as data URIs
    chunkSizeWarningLimit: 100_000,
  },
})
