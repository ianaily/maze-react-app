import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslintPlugin from 'vite-plugin-eslint';
import viteSvgr from 'vite-plugin-svgr';
import viteCompression from 'vite-plugin-compression';
import * as path from 'path';

const enginePackages = path.resolve(__dirname, 'vendor/packages');

export default defineConfig({
  define: {
    process: process,
  },
  plugins: [
    react(),
    viteSvgr(),
    eslintPlugin({
      include: ['src/**/+(js|jsx|ts|tsx)'],
    }),
    viteCompression(),
  ],
  resolve: {
    alias: [
      {
        find: 'src',
        replacement: path.resolve(__dirname, 'src'),
      },
      {
        find: /^engine-([a-z-]+)$/,
        replacement: path.join(enginePackages, 'engine-$1', 'src/index.ts'),
      },
    ],
  },
});
