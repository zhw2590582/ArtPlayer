# TypeScript in Monaco 0.30.1

The shipped TypeScript worker contains TypeScript 4.4.4, as pinned by the
[Monaco release commit](https://github.com/microsoft/monaco-editor/tree/5a7ba61be909ae9e4889768a3453ebb0dec392e2)
and verified by matching the adapted service source and rebuilding the worker.
The original Monaco ThirdPartyNotices.txt names TypeScript 2.7.2; that historical
text is retained unchanged. This supplement identifies the actual included version.

TypeScript's original [LICENSE.txt](./LICENSE.txt),
[CopyrightNotice.txt](./CopyrightNotice.txt), and
[ThirdPartyNoticeText.txt](./ThirdPartyNoticeText.txt) accompany this file.
The third-party text includes its original Unicode, W3C, WHATWG and Khronos
notices. The upstream bytes and their encoding are preserved without rewriting.

Monaco's import script disables the Node system, selected require calls and a
debugger statement, removes the source map, and adds a named AMD export.
RequireJS removes the top-level strict directive; Terser 5.9.0 minifies the worker.
These are existing upstream changes, retained by ArtPlayer. No worker runtime
code changes are made by this notice supplement. Other Monaco components remain
subject to their separate source and notice review.
