import type { RuntimeFactory } from './api.js'

declare const {{export}}: RuntimeFactory
// eslint-disable-next-line ts/no-redeclare -- Expose types on the CommonJS factory.
declare namespace {{export}} {
  type Option = import('./api.js').Option
  type Result = import('./api.js').Result
  type Factory = import('./api.js').Factory
  type RuntimeFactory = import('./api.js').RuntimeFactory
}
export = {{export}}
