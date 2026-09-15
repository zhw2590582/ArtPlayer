# Node path in Monaco 0.30.1

The editor and core worker include VS Code's browser port of Node.js path. The
source identifies Node v14.16.0 ([fixed Node source](https://github.com/nodejs/node/blob/bd60e93357a118204ea238d94e7a9e4209d93062/lib/path.js)),
ported in [VS Code 829382514cb1065f5ebb90f436e1c6103e153953](https://github.com/microsoft/vscode/blob/829382514cb1065f5ebb90f436e1c6103e153953/src/vs/base/common/path.ts).

The full Joyent/Node contributor copyright and permission text is already in
[the original third-party notices](../ThirdPartyNotices.txt). That upstream index
links an older Node commit; this supplement identifies the actual ported source
without removing or rewriting the original notice. Its license text matches both
the v14.16.0 source and VS Code's retained comment.

VS Code adds types and a browser process adapter, local argument validation and
an Error subclass, exports platform-selected functions, and omits Node's legacy
_makeLong alias. Reviewed algorithm edits include a string guard in Windows join
and shared loop-variable declarations in both basename implementations. These
are existing upstream adaptations, not new ArtPlayer behavior changes.

Six unused top-level exports are removed from the prepared sources. Both actual
source maps retain identical complete path-module sources after those removals;
TypeScript 4.5.0-dev.20211021 reproduces the full module in editor and worker builds.
The full VS Code compiler pipeline is a separate verification scope.
