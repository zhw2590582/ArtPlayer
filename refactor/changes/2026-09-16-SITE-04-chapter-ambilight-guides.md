# SITE-04 checkpoint: Chapter and Ambilight bilingual guides

SITE-04 moves from todo to doing. This is planned documentation implementation,
not one of the user-guided release reviews. Core's 963 declaration-member rows
and the remaining ecosystem content still need semantic checks.

Added four pages for Chapter and Ambilight, with local sidebar destinations and
links to the existing online examples. Each Run Code block is copied unchanged
from its actual `docs/assets/example` source. The shared version menu now states
`6.0.0 (unreleased)` instead of the obsolete `5.3.x`. New HTML paths are recorded
with `introducedAfter: dba354f8cd752bc2f82f5299997fb1ff60b553b5`; no future commit
or publication is invented.

The [content mapping](../site-content-review.md) records the source, declaration,
README and architecture checks. Chapter documentation covers fields, finite
duration, in-place sorting/gap insertion/Infinity replacement, synchronous
update and error behavior, once-only metadata initialization, source changes,
DOM hooks and cleanup. Ambilight covers all option defaults, ignored zIndex,
sampling frequency and playback conditions, synchronous start/stop, readiness,
pixel access, canvas proxies and the approved root/runtime type distinction.
Both languages state the unpublished status and applicable validation limits.

Visual inspection found empty Run Code elements rendered as tiny green blocks.
Their existing hooks and code are preserved, with visible `▶ Run Code` text
added to these four new pages and the four existing Audio/VTT pages. This is a
label fix, not a change to the navigation handler or media implementation.

## Verification

- Node 24.21.0, Yarn 1.22.22 and TypeScript 5.9.3. Four exact TS snippets pass
  strict NodeNext checks with `skipLibCheck:false` and `types:[]`.
- Each new generated page has 29 distinct local link/fragment targets, all
  checked against the generated files and actual IDs. All eight labeled pages
  retain their exact original demo code and data-libs settings.
- Desktop Chromium 153.0.8010.12, Firefox 155.0 and Windows WebKit 26.6 pass all
  12 page cases: HTTP page load, sidebar destination, visible Run Code label,
  exact code and libs forwarding, language link and no uncaught page errors.
  Popups receive an isolated empty editor response: this verifies navigation,
  not editor execution or media playback. No physical-device claim is made.
- Two screenshot inspections show the initial missing label and the final
  readable control/layout. The in-app browser also displayed the local Chinese
  Chapter guide; its tool did not supply a version and no playback was observed.
- Existing site-loading/documentation-pipeline tests: 17 pass, no failures or
  skips, 1411.5968 ms. Targeted config lint, build:llm, build:docs, check:llm,
  demo path checks and site inventory checks pass. Final build:docs took 8.96 s.

Two initial static probes failed because the lightweight HTML parser preserved
`className` casing while its CSS selector normalized that name. Direct attribute
inspection corrected the probe. This did not require altering page markup to
make the probe pass. The first full navigation run passed before the visual
label finding; after fixing the labels the pages were rebuilt and all 12 cases
were rerun. Original logs, reports and screenshots remain available in
[the validation record](../baselines/site04-chapter-ambilight-guides.json).

All generated HTML, site browser assets and LLM output came from the project
build commands. Current inventory is 40 Markdown files, 49 HTML paths and 30
examples; the original 29 examples and 36 HTML paths remain accounted for.
The 21 library candidates retain valid build fingerprints; no library source,
type, distribution, dependency or public API changed.

SITE-04 remains doing, with 224 done / 22 doing / 39 todo across 285 tasks.
Continue from the content mapping; SITE-05/EX-03 still own full page/demo
acceptance and device requirements. Reverting this checkpoint removes the new
guides/navigation and restores labels/generated outputs without touching library
behavior. No formal review, push, remote dispatch, deployment or publication.

The unstaged whitespace check did not include the four then-untracked generated
HTML files. After staging, the full check reports eight whitespace-only template
lines in those four files. Each location was inspected; the remaining staged
files pass the check with exactly those four paths excluded. The full check is
not reported as passing, and the generated HTML was not hand-edited to hide the
template whitespace. The validation record retains the locations and exit codes.
