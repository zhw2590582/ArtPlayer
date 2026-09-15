# Monaco CSS, HTML and JSON language-service notices

The site retains Monaco 0.30.1. The seven service dependencies below are identified
from its fixed upstream lock and exact embedded-source comparisons, not from
current npm latest versions. ArtPlayer does not change their runtime code here.

- jsonc-parser 3.0.0: [LICENSE.md](./jsonc-parser/LICENSE.md)
- vscode-css-languageservice 5.1.8: [LICENSE.md](./vscode-css-languageservice/LICENSE.md)
- vscode-html-languageservice 4.1.1: [LICENSE.md](./vscode-html-languageservice/LICENSE.md), [thirdpartynotices.txt](./vscode-html-languageservice/thirdpartynotices.txt)
- vscode-json-languageservice 4.1.9: [LICENSE.md](./vscode-json-languageservice/LICENSE.md)
- vscode-languageserver-textdocument 1.0.2: [License.txt](./vscode-languageserver-textdocument/License.txt), [thirdpartynotices.txt](./vscode-languageserver-textdocument/thirdpartynotices.txt)
- vscode-languageserver-types 3.16.0: [License.txt](./vscode-languageserver-types/License.txt)
- vscode-uri 3.0.2: [LICENSE.md](./vscode-uri/LICENSE.md)

Original LICENSE and third-party notice files are reproduced verbatim, including
encoding, line endings and legacy wording. The JSON service license includes
Nick Fitzgerald's glob-to-regexp copyright and BSD conditions in addition to
Microsoft's MIT terms. Neither the source header's short MIT label nor an npm
license field replaces that full text. The embedded glob is distributed as part
of vscode-json-languageservice 4.1.9; no independent glob package version is claimed.

The HTML service's thirdpartynotices.txt retains its original JS Beautifier
2007-2017 notice and HTML 5.1 W3C Working Draft attribution. Its actual CSS/HTML
beautifier source headers say 2007-2018 and additionally credit Harutyun Amirjanyan
and Nochum Sossonko. Both complete headers are retained as
[CSS formatter notice](./beautify-css-NOTICE.txt) and
[HTML formatter notice](./beautify-html-NOTICE.txt). The separately named
beautify.js module is Microsoft's no-op JavaScript formatter adapter; no upstream
JavaScript formatter implementation or independent js-beautify version is claimed.

The vscode-nls module is Monaco's own identical localization filler in monaco-css,
monaco-html and monaco-json at commit 5a7ba61be909ae9e4889768a3453ebb0dec392e2.
It is covered by the existing [Monaco license](../LICENSE); the same-named npm
package from the upstream install is not the embedded implementation.

This supplement documents the identified worker sources and their original notice
texts. It does not replace the original Monaco notices or conclude the review of
mode bundles, editor-core dependencies, language definitions, or other site assets.
