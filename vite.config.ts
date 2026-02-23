import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { oxContentVue } from "@ox-content/vite-plugin-vue";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [vue(), oxContentVue({ highlight: true })],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  assetsInclude: ["**/*.frag", "**/*.vert", "**/*.glsl"],
  base: "/shadorial/",
});
