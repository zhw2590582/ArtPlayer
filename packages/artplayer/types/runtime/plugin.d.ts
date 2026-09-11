// Generated from public/runtime/plugin.ts by yarn build:types. Do not edit.
export type PluginFactory<Host, Result = unknown> = (this: Host, art: Host) => Result
export type PluginRegistration<Result, Registry> = unknown extends Result ? Registry | Promise<Registry> : Result extends Promise<unknown> ? Promise<Registry> : Registry
/** The same registry is returned immediately or after its Promise factory settles. */
export interface Plugins<Host> {
  art: Host
  id: number
  add: <Result>(plugin: PluginFactory<Host, Result>) => PluginRegistration<Result, this>
  next: (plugin: PluginFactory<Host>, result: unknown) => this
}
