# react-pure-render origin of shallowequal

The console bundle includes shallowequal 1.1.0. Its published README credits
[react-pure-render](https://github.com/gaearon/react-pure-render/) as the code
origin. The [original shallowEqual source](https://github.com/gaearon/react-pure-render/blob/729cdbd51df00068816376544738cc1fc4720cf2/src/shallowEqual.js)
and [MIT license](https://github.com/gaearon/react-pure-render/blob/729cdbd51df00068816376544738cc1fc4720cf2/LICENSE)
are preserved at a fixed upstream commit, with copyright (c) 2015 Dan Abramov.
The full license accompanies this file as [LICENSE](./LICENSE).

The included shallowequal implementation has been modified: it adds a comparison
callback and context, boolean callback results, and different loop/null-check
forms. The original source and the bundled implementation are not identical.
This attribution does not claim a uniquely installed react-pure-render version.
The separate shallowequal license, copyright (c) 2017 Alberto Leal, is retained
[alongside this notice](../shallowequal/shallowequal-1.1.0-LICENSE).
