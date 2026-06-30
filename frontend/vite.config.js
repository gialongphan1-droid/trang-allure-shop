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
			"/sitemap.xml": {
				target: "http://localhost:5000",
				changeOrigin: true,
			},
		},
	},
	// QUAN TRỌNG: Tắt cái vụ minify CSS gây lỗi
	css: {
		minify: false,
	},
	// Bỏ hết manualChunks, terserOptions... để Vercel build nhẹ nhàng
});
