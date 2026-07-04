import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react()],
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
		rollupOptions: {
			output: {
				manualChunks: {
					"react-vendor": ["react", "react-dom", "react-router-dom"],
					"redux-vendor": ["@reduxjs/toolkit", "react-redux"],
					// ✅ Tách riêng thư viện lớn
					recharts: ["recharts"], // <--- TÁCH RIÊNG BIỆT
					ui: ["@radix-ui/react-slot", "class-variance-authority"],
					utils: ["axios", "react-hook-form", "yup", "slugify"],
				},
			},
		},
	},
});
