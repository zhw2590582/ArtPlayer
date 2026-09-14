# Frozen site vendor notices

`manifest.json` pins the already-identified Monaco 0.30.1 and vConsole 3.15.0
archives, corresponding files and upstream notice texts. It does not clear other
site dependencies or grant rights to samples/fonts. The vConsole LICENSE is
preserved verbatim but is incomplete: it promises an MIT copy that is absent.
Its completion and bundled dependency notices remain open under SITE-07.
Monaco's supplied notices also lack a Codicons entry. Match the included font to
its historical source and attribution before claiming the font review complete;
the Monaco MIT statement does not establish the separate font's license.

`notices.ts` validates the exact file inventory and fingerprints before preparing
outputs. JavaScript/CSS comparisons normalize CRLF to LF; font bytes are exact.
This preserves the previously verified Monaco CSS newline-only difference while
rejecting code or added/removed files. It never rewrites runtime assets. Notice
files retain their exact upstream bytes, including final blank lines.

`../build-site-notices.mjs` provides `yarn build:site-notices` and read-only
`yarn check:site-notices`. The write command cannot bless altered vendor assets;
review the new archive and license evidence before changing the manifest. The
CLI prevents accidentally dropping either verified component. Source notices
live in `refactor/baselines/site-vendor/`; generated delivery files live under
`docs/licenses/` with an explicitly limited `docs/THIRD_PARTY_NOTICES.md` index.

CI runs the read-only check before building, and generation during ci:build.
Library builds remain independent. Pages preparation copies the notices into its
own fingerprinted site. `.gitattributes` preserves text bytes across Windows/Linux.

`yarn test:site-notices` tests missing/extra/modified assets, changed or incomplete
inputs, path escape and read-only output drift. The browser fixture
`test/browser/site-vendor.spec.js` checks actual mobile logging, native playback,
HTTP notice contents and destruction. Its WebKit destruction error is a real
open vendor issue; do not skip the test or catch the page error to turn it green.
Existing desktop TypeScript editor tests cover the real Monaco worker and Run.

Follow-up: reproduce the pending vConsole log-store callback after destruction,
restore complete licensing from fixed upstream evidence, then recover the
console.js build and resolve remaining fonts/media. Do not upgrade these assets
without verifying globals, AMD/worker paths, CSS, consoleLog and user interaction.
