import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: "autoUpdate",
            manifest: {
                name: "MilaTalk Mobile",
                short_name: "MilaTalk",
                start_url: "/",
                display: "standalone",
                theme_color: "#3498db",
                background_color: "#ffffff",
                icons: [
                    {
                        src: "/logo192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "/logo512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                ],
            },
            workbox: {
                globPatterns: ["**/*.{js,css,html,png,jpg}"],
            },
        }),
    ],
});
