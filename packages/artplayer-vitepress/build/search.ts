import type { Plugin } from 'vite'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'

// Keep the pinned upstream template, CSS, index and URLs; patch interaction ownership only.
const componentHash = 'c53a0d2a5b5380123f775b0852b5805a4b0a3d97248d5c296972de30c35f6f9c'

export function patchSearchComponent(source: string): string {
  assert.equal(createHash('sha256').update(source).digest('hex'), componentHash, 'Review the search interaction adapter before upgrading vitepress-plugin-search')
  let result = source.replaceAll('\r\n', '\n')
  const replace = (before: string, after: string) => {
    assert.equal(result.split(before).length, 2, `Expected one search patch target: ${before}`)
    result = result.replace(before, after)
  }
  replace('ref, onMounted, computed, nextTick', 'ref, onMounted, onUnmounted, computed, nextTick, watch')
  replace('if (searchTerm.value) {', 'if (searchTerm.value && searchIndex.value) {')
  replace(`const openSearch = () => {
  setTimeout(() => {
    if (input.value) input.value.focus();
  }, 100);
  cleanSearch();
  open.value = true;
};`, `const openSearch = () => {
  cleanSearch();
  open.value = true;
  nextTick(() => { if (alive && open.value) input.value?.focus(); });
};`)
  replace('onMounted(async () => {', `let alive = true;
let removeHotKey = () => {};
onUnmounted(() => { alive = false; removeHotKey(); });
watch(searchTerm, () => { focused.value = 0; }, { flush: "sync" });
onMounted(async () => {`)
  replace('const data = await import("virtual:search-data");', 'const data = await import("virtual:search-data");\n  if (!alive) return;')
  replace('if (searchTerm.value?.length == 0 && open.value)\n        open.value = false', 'if (open.value) {\n        e.preventDefault();\n        cleanSearch();\n        documentButton()?.focus();\n      }')
  replace('window.addEventListener("keydown", handleSearchHotKey);', 'window.addEventListener("keydown", handleSearchHotKey);\n  removeHotKey = () => window.removeEventListener("keydown", handleSearchHotKey);')
  replace('<form class="DocSearch-Form">', '<form class="DocSearch-Form" @submit.prevent>')

  const start = result.indexOf('const handleNavigation = (e: KeyboardEvent) => {')
  const end = result.indexOf('</script>', start)
  assert(start > 0 && end > start, 'Missing pinned search keyboard handler')
  result = `${result.slice(0, start)}function documentButton() {
  return document.querySelector<HTMLButtonElement>("#docsearch button");
}
const handleNavigation = (e: KeyboardEvent) => {
  if (e.isComposing || !["ArrowUp", "ArrowDown", "Enter"].includes(e.key)) return;
  e.preventDefault();
  const links = Array.from(modal.value?.querySelectorAll<HTMLAnchorElement>(".search-group a") || []);
  if (!links.length) return;
  const current = links.findIndex(link => link.classList.contains("link-focused"));
  if (e.key === "Enter") {
    const href = links[Math.max(current, 0)].href;
    cleanSearch();
    void router.go(href);
    return;
  }
  const delta = e.key === "ArrowDown" ? 1 : -1;
  const next = (Math.max(current, 0) + delta + links.length) % links.length;
  focused.value = linksOrder.value[next];
  links[next].scrollIntoView({ block: "nearest" });
};
${result.slice(end)}`
  return result
}

export function searchInteractions(): Plugin {
  return {
    name: 'artplayer-search-interactions',
    enforce: 'pre',
    transform(source, id) {
      if (id.replaceAll('\\', '/').endsWith('/vitepress-plugin-search/dist/Search.vue'))
        return { code: patchSearchComponent(source), map: null }
    },
  }
}
