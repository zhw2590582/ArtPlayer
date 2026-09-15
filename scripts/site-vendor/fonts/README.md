# Selected font notice references

`notices.ts` binds the selected JASSUB font bytes, complete upstream terms and
attribution to `site-font-notices-provenance.json`. Ordinary notice generation is
offline and checks every binding before writing. Five font paths represent four
families: Liberation Sans (two existing default copies), Averia Sans Libre Light,
Lato Regular and CHAWP. No font, subtitle style, family name or URL is replaced.

CHAWP is byte-identical to the pinned author repository. The other three are
references with documented font-table differences: outlines, character mapping
and horizontal metrics match, but this does not recover the original conversion
recipe or prove that the files were never modified. Lato's reference OFL header
and its embedded copyright use different year ranges; both are preserved.
The complete notices and the bounded attribution ship in `docs/licenses/jassub-fonts/`.

Averia Serif Simple Light remains unresolved: the Serif Libre reference has a
different encoded `g` glyph. It cannot be silently treated as the same font.
Allison, Architext, Arial, Franklin Gothic, Garamond and Slate Pro are also outside
this group pending redistribution evidence or a reviewed replacement. VENDOR-05,
BASE-MEDIA-01 and SITE-07 remain open; publishing an OFL reference does not itself
close font provenance or release review.

## Reproduce the comparison

The provenance record pins exact Git commits, file paths, SHA-256 and Git blob
identity for the reference fonts. Retrieve GitHub files through the contents API
at that exact `ref`, decode its base64 content to bytes and verify both hashes.
The Liberation reference comes from the recorded release attachment: verify the
archive SHA-256 before reading its exact font/LICENSE members to memory with tar.
Do not pipe binary fonts through PowerShell text redirection or substitute newer
font versions. The Serif negative reference uses the separate fixed URL and hash.

Save these reference files as `liberation.ttf`, `averia-sans.ttf`, `lato.ttf`,
`chawp.otf` and `averia-serif.ttf` in an ignored directory. Use Python 3.12 with
fonttools 4.60.1 and brotli 1.1.0 (the pre-existing isolated font inspector tools),
then run:

```sh
python refactor/scripts/site-font-comparison.py <reference-directory> --check
```

The read-only script verifies input hashes before parsing, compares every SFNT
table, all glyph outlines/order, character mapping and horizontal metrics, and
checks the full result against the recorded observations, including the negative
case. It never changes font files or writes a replacement baseline. Ordinary CI
does not need Python or these archived references; it validates local font/notice
fingerprints and runs the binding tests.

Run `yarn build:site-notices`, `yarn check:site-notices`,
`node --test test/site-notices.test.js`, and
`yarn test:browser site-vendor.spec.js --workers=1`. The browser checks original
font HTTP bytes, native FontFace loading and ink, notice bytes/links and real
mobile playback. They are not a complete libass subtitle shaping comparison.
