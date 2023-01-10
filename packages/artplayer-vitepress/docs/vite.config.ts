import { SearchPlugin } from "vitepress-plugin-search";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    SearchPlugin({
      placeholder: "Search docs",
      buttonLabel: "Search",
      previewLength: 62,
    }),
  ],
});