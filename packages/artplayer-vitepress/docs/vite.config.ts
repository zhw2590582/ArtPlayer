import { SearchPlugin } from "vitepress-plugin-search";

export default {
  plugins: [
    SearchPlugin({
      placeholder: "Search docs",
      buttonLabel: "Search",
      previewLength: 62,
    }),
  ],
};