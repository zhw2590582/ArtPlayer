# Frozen site vendor notices

`manifest.json` pins the already-identified Monaco 0.30.1, vConsole 3.15.0 and console
archives, corresponding files and upstream notice texts. It does not clear other
site dependencies or grant rights to samples/fonts. The vConsole LICENSE is
preserved verbatim. A separately identified MIT text supplies the body referenced
by the original bundle, alongside the full notices for eight bundled dependencies
and webpack's generated bootstrap. Fixed-source reconstruction verifies their
identity; see `vconsole/README.md` and `vconsole/reproduce.ts`.
Monaco's supplied notices lack a Codicons entry. The bundled font now has an
exact byte match to the official `@vscode/codicons@0.0.26` archive. Its historical
README, CC BY 4.0 content license and MIT code license are preserved, alongside
ArtPlayer's attribution, in `docs/licenses/monaco-editor/codicons/`. This evidence
does not derive the font license from Monaco's MIT statement or today's Codicons.

`notices.ts` validates the exact file inventory and fingerprints before preparing
outputs. JavaScript/CSS comparisons normalize CRLF to LF; font bytes are exact.
This preserves the previously verified Monaco CSS newline-only difference while
rejecting code or added/removed files. It never rewrites runtime assets. Notice
files retain their exact upstream bytes, including final blank lines.

`../build-site-notices.mjs` provides `yarn build:site-notices` and read-only
`yarn check:site-notices`. The write command cannot bless altered vendor assets;
review the new archive and license evidence before changing the manifest. The
CLI prevents accidentally dropping any of the three groups, the eleven reviewed
Monaco/vConsole components, the 44 identified console components or their notice
count, and vConsole's original license, supplemental MIT body and attribution.
Component references require their runtime assets and every notice before writing.
Source notices
live in `refactor/baselines/site-vendor/`; generated delivery files live under
`docs/licenses/` with an explicitly limited `docs/THIRD_PARTY_NOTICES.md` index.

CI runs the read-only check before building, and generation during ci:build.
Library builds remain independent. Pages preparation copies the notices into its
own fingerprinted site. `.gitattributes` preserves text bytes across Windows/Linux.
The historical Codicons files use explicit `-text` overrides to retain archive
CRLF bytes. Their frozen README source uses `.txt` to avoid interpreting upstream
repository links as local refactor links; delivery restores `README.md` unchanged.
Only these immutable upstream paths allow their original trailing whitespace;
the notice hash check, rather than formatting, protects their contents.

`yarn test:site-notices` tests missing/extra/modified assets, changed or incomplete
inputs, path escape and read-only output drift. The browser fixture
`test/browser/site-vendor.spec.js` checks actual mobile logging, native playback,
HTTP notice contents and destruction. The fixed-source lifecycle patch and its
old-build reproduction are maintained in `vconsole/README.md`; generated asset
checks run before the notice checks. Do not skip destruction or catch page errors.
Existing desktop TypeScript editor tests cover the real Monaco worker and Run.

The Codicons archive identity, integrity, notice members and negative comparison
with version 0.0.25 are recorded in `refactor/baselines/site-codicons-provenance.json`.
For an independent reproduction, download the pinned `comparisons[0].tarball` into
an ignored cache directory. In Node, verify its SHA-512 SRI and SHA-256 against
that record before using `execFileSync('tar', ['-xOzf', archive, member])` to read
members as Buffers. Compare `package/dist/codicon.ttf` directly with `fontPath`,
and each non-null notice member with its frozen `source`. Do not pipe binary font
output through PowerShell text redirection. No dependency installation is needed.

The desktop console's owned TS entry/view and lifecycle now build through
`build:console` / `check:console`; see [console maintenance](console/README.md).
Its other 100 Parcel modules remain frozen and now reproduce exactly from fixed
archives, including the Parcel loader. Its package/loader licenses, two embedded
headers, embedded dependency licenses and upstream author notices now ship as 47 files
under `docs/licenses/console/`. Each component is bound to its verified upstream
notice by `console/notices.ts`. The consolidated review and historical reconstruction
limits are recorded in `refactor/console-notice-review.md`.

Follow-up: finish Monaco's broader bundled-component notice audit and remaining
fonts/media. Do not upgrade these assets
without verifying globals, AMD/worker paths, CSS, consoleLog and user interaction.

Monaco's actual TypeScript 4.4.4 worker now has a separate source proof and notice
supplement; its original notice's 2.7.2 label is retained and explained. See
[Monaco maintenance](monaco/README.md) for the fixed six source adaptations,
minifier reconstruction, exact-byte checks and remaining component review scope.
