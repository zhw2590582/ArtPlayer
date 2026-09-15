# Monaco core Markdown components

The site's unchanged Monaco 0.30.1 editor includes the following components from
VS Code commit 829382514cb1065f5ebb90f436e1c6103e153953. The original Monaco notices
remain in place; this supplement identifies missing or more precise information.

- DOMPurify 2.3.1, Copyright 2015 Mario Heiderich, Cure53 and other contributors.
  [Complete original license](./DOMPurify-LICENSE). The upstream text offers a
  choice of Apache 2.0 or MPL 2.0; both complete texts are retained verbatim.
  Source: https://github.com/cure53/DOMPurify/tree/6cfcdf56269b892550af80baa7c1fa5b680e5db7
- marked 3.0.2, MarkedJS and Christopher Jeffrey.
  [Original package license](./marked-LICENSE) and
  [VS Code's retained older notice](./marked-vscode-license.txt).
  Source: https://github.com/markedjs/marked/tree/d1b7d521c41bcf915f81f0218b0e5acd607c1b72

VS Code adapts DOMPurify's ESM export into an AMD factory and records alternative
ESM exports in comments. It adds commented ESM wrappers to marked. Monaco's build
assigns names to these two AMD definitions. The full adapted sources match their
fixed upstream Git files, the core archive's source map and development bundle.
The shipped editor retains the exact archived core code with its original
editor.main-to-edcore.main entry rename and appended language registrations.
ArtPlayer has not modified either component's runtime in this change.

The original Monaco notice omitted DOMPurify and used less precise marked
information. This supplement does not replace those original records or claim
that the entire Monaco core build, other embedded origins, or all sanitizer
behavior have been audited. Reproduction and browser regression instructions
are maintained in the repository's scripts/site-vendor/monaco/README.md.
