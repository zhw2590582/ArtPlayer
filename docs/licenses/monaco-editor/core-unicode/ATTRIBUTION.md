# Unicode data embedded in Monaco Editor 0.30.1

The editor and base worker contain generated Unicode data through Microsoft VS Code's vs/base/common/strings.ts. Existing Microsoft notices remain applicable to the surrounding code.

The original alexdima/unicode-utils generators reproduce all four selected data expressions from fixed VS Code commit 829382514cb1065f5ebb90f436e1c6103e153953 and both original Monaco source maps:

- RTL regular expression: UnicodeData-10.0.0d5.txt (draft), frozen at 5c256860b1e4e54b0375165b8451cf7cdabc953a. The version label comes from that commit's fetch recipe; this is not a claim about final Unicode 10.
- Emoji regular expression and imprecise code-point predicate: Emoji 13.1 emoji-test.txt and Unicode 13.0 UnicodeData.txt, frozen at 6d37cf4362203bfb5431c560cd8809b2cc3b51c1.
- Grapheme break tree: 5,034 integers from GraphemeBreakProperty-13.0.0d4.txt and the accompanying 2019 emoji-data.txt snapshot, frozen at 2068fd0695b2798d8debb3646c860f5d37ba75b2. Do not silently substitute final or later Unicode data.

Data files retain their original Unicode copyright headers. LICENSE.txt is the complete Unicode data/software license from unicode-org/unicodetools commit b1c21ef7e972ea0c783c19cf25494bde645fbf21, copyright 1991-2020 Unicode, Inc.; it is a fixed historical reference, not a claim that the generator distributed its own license file.

The generator repository's package.json identifies Alex Dima and declares MIT; that frozen tree has no standalone LICENSE file. Its lockfile resolves regexpu 3.3.0 despite conflicting dependency/devDependency ranges. Reproduction tools use the exact locked dependencies in an isolated cache; those tools and dependencies are not shipped with the site runtime.

The source/input hashes, recipes, archive integrity and reproduction command are maintained in refactor/baselines/monaco-unicode-provenance.json and scripts/site-vendor/monaco/README.md in the ArtPlayer source repository. This records data origins, not complete Unicode conformance or a complete historical Monaco build.
