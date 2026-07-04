import react from "@vitejs/plugin-react";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		react(),
		visualizer({
			filename: "dist/stats.html",
			open: true,
			gzipSize: true,
			brotliSize: true,
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		port: 5173,
		proxy: {
			"/api": {
				target: "http://localhost:5000",
				changeOrigin: true,
			},
		},
	},
	css: {
		minify: false,
	},
	build: {
		outDir: "dist",
		chunkSizeWarningLimit: 2000,
		minify: "esbuild",
		rollupOptions: {
			output: {
				manualChunks: {
					"react-vendor": ["react", "react-dom", "react-router-dom"],
					"redux-vendor": ["@reduxjs/toolkit", "react-redux"],
					ui: ["@radix-ui/react-slot", "class-variance-authority"],
					chart: ["recharts"],
					form: ["react-hook-form", "yup"],
					utils: ["axios", "slugify", "date-fns"],
				},
			},
		},
	},
});
