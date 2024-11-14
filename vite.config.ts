import { defineConfig } from 'vite'
import path from 'node:path'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'
import TsconfigPaths from 'vite-plugin-tsconfig-paths';

const root = (p: string) => path.join(path.resolve(__dirname), p);

console.log(root("electron/lib"))

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			"@lib": path.join(__dirname, "electron/lib")
		}
	},
	build: {
		rollupOptions: {
			external: ["@lib/events/handle"]
		}
	},
  plugins: [
    react(),
		TsconfigPaths(),
    electron({
      main: {
        // Shortcut of `build.lib.entry`.
        entry: 'electron/main.ts',
      },
      preload: {
        // Shortcut of `build.rollupOptions.input`.
        // Preload scripts may contain Web assets, so use the `build.rollupOptions.input` instead `build.lib.entry`.
        input: path.join(__dirname, 'electron/preload.ts'),
      },
      // Ployfill the Electron and Node.js API for Renderer process.
      // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
      // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
      renderer: process.env.NODE_ENV === 'test'
        // https://github.com/electron-vite/vite-plugin-electron-renderer/issues/78#issuecomment-2053600808
        ? undefined
        : {},
    }),
  ],
	publicDir: "ui/public"
	// resolve: {
	// 	alias: {
	// 		"@lib": root("lib"),
	// 		"@ui/*": root("ui/src/*"),
	// 		"@electron/*": root("electron/*"),
	// 		"@components/*": root("ui/src/components/*")
	// 	}
	// },
});