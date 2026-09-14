# vConsole 3.15.0 distribution notices

Copyright (C) 2017 THL A29 Limited, a Tencent company. All rights reserved.

The [original LICENSE](LICENSE) is preserved unchanged. Its promised MIT body
is absent from the upstream file. [MIT-LICENSE](MIT-LICENSE) supplies the MIT
text explicitly referenced by the original published bundle, with its copyright
notice. ArtPlayer assembled this supplemental file; it is not presented as a
verbatim file from Tencent's archive.

- [Original npm archive](https://registry.npmjs.org/vconsole/-/vconsole-3.15.0.tgz)
- [Source revision](https://github.com/Tencent/vConsole/tree/05d80398bae35e793774f74e3c052b4e530e293a)
- [MIT text referenced by upstream](https://opensource.org/license/mit)

The fixed source and original lockfile reproduce the upstream bundle byte for
byte (SHA-256 671f47427e1e3048919147c765e9fb71e4ea40d79a8c2829089f499d3e9b9bf4). The build includes the following runtime
components, whose original notices are preserved alongside this document:

- @babel/runtime 7.17.9: [license](babel-runtime/LICENSE)
- core-js 3.21.1: [license](core-js/LICENSE)
- copy-text-to-clipboard 3.0.1: [license](copy-text-to-clipboard/LICENSE)
- mutation-observer 1.0.3: [license](mutation-observer/LICENSE)
- svelte 3.47.0: [license](svelte/LICENSE)
- regenerator-runtime 0.13.9: [license](regenerator-runtime/LICENSE)
- style-loader 3.3.1: [license](style-loader/LICENSE)
- css-loader 6.7.1: [license](css-loader/LICENSE)
- webpack 5.72.0: [license](webpack/LICENSE)

Mutation-observer contains separate Automattic and Polymer Authors BSD notices;
both are retained in full. Webpack's generated bootstrap is included in the
notice set, as are the runtime helpers from style-loader and css-loader.

ArtPlayer applies a local lifecycle patch to queued logs, panel insertion and
late scroller callbacks. The original bundle is preserved and the patch is
reproducible; the public script URL, UMD export and CSS remain compatible.
This notice set covers this vConsole distribution, not other site assets.
