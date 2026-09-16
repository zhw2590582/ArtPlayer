import { SearchPlugin } from "vitepress-plugin-search";
import { searchInteractions } from '../build/search.ts';

export default {
  plugins: [
    searchInteractions(),
    SearchPlugin({
      placeholder: "Search docs",
      buttonLabel: "Search",
      previewLength: 62,
    }),
  ],
};
