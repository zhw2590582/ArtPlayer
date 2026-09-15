# WinJS-derived DOM helpers in Monaco

Monaco 0.30.1 embeds VS Code dom.ts from commit
829382514cb1065f5ebb90f436e1c6103e153953. Its Microsoft/MIT source explicitly
marks SizeUtils, getTopLeftOffset, getTotalWidth, getContentHeight and
getTotalHeight as adapted from WinJS; getContentWidth uses the same dimension
helpers. These six declaration blocks match the editor's archived source map.

The comment does not name an original WinJS release. That original version
remains unknown. For a reproducible comparison, WinJS 4.4.5 at commit
4329b1133b243d9ded3b5a1f98d096ee8e80e889 supplies _ElementUtilities.js and the
complete Microsoft MIT license included alongside this note. This does not
assert that Monaco bundled unmodified WinJS 4.4.5 or the entire WinJS library.

Existing adaptations include CSS property access and pixel conversion changes,
separate typed dimension helpers, and position calculations with borders, RTL
scroll handling and shadow-root checks. The WinJS reference has its own computed
style, unit conversion and position implementation. These differences are not
changes introduced by the ArtPlayer refactor. No editor runtime bytes changed.

Sources:
- https://github.com/microsoft/vscode/blob/829382514cb1065f5ebb90f436e1c6103e153953/src/vs/base/browser/dom.ts
- https://github.com/winjs/winjs/blob/4329b1133b243d9ded3b5a1f98d096ee8e80e889/src/js/WinJS/Utilities/_ElementUtilities.js
- https://github.com/winjs/winjs/blob/4329b1133b243d9ded3b5a1f98d096ee8e80e889/License.txt

Complete reference terms: [WinJS license](./LICENSE.txt). The editor's existing
Microsoft MIT license and original ThirdPartyNotices are retained. Unicode
data, other embedded sources and complete original core compilation remain
separate review work; this notice is not a claim of complete source clearance.
