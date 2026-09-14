import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { build } from 'esbuild'
import ts from 'typescript'

export const upstreamSha256 = '671f47427e1e3048919147c765e9fb71e4ea40d79a8c2829089f499d3e9b9bf4'
export const hooks = {
  factory: '(this||self,(function(){return function(){',
  signal: 'e._signalLog=function(t){var n=this;this.flushLogScheduled||(this.flushLogScheduled=!0,window.requestAnimationFrame((function(){n.flushLogScheduled=!1,n._flushLogs()}))),this.logQueue.push(t)}',
  unbind: '0===this.ADDED_LOG_PLUGIN_ID.length&&this.unmockConsole()',
  panel: 'o&&setTimeout((function(){var e=document.querySelector("#__vc_plug_"+t.id);n.HD(o)?e.innerHTML+=o:n.mf(o.appendTo)?o.appendTo(e):n.kK(o)&&e.insertAdjacentElement("beforeend",o)}),0)',
  resizeResume: 'case 9:F(p),X(p,W.getPosition(),k),0!==k&&H(N&&L),K();',
  itemResume: 'case 12:X(p,W.getPosition(),k),e(6,s.style.height=P+"px",s),K();',
}

function replaceOne(source: string, from: string, to: string): string {
  assert.equal(source.split(from).length, 2, 'Frozen vConsole hook must occur exactly once')
  return source.replace(from, to)
}

export async function generateVconsole(root: string): Promise<string> {
  const directory = path.join(root, 'scripts/site-vendor/vconsole')
  const upstream = fs.readFileSync(path.join(directory, 'upstream.js'), 'utf8')
  assert.equal(createHash('sha256').update(upstream).digest('hex'), upstreamSha256, 'Frozen vConsole source changed')
  const source = fs.readFileSync(path.join(directory, 'lifecycle.ts'), 'utf8')
  const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES5, module: ts.ModuleKind.ESNext } }).outputText
  const result = await build({ stdin: { contents: compiled, loader: 'js' }, bundle: true, write: false, platform: 'browser', format: 'iife', globalName: '__artplayerVConsoleLogLifecycle', target: 'es5', minify: true, legalComments: 'none', logLevel: 'silent' })
  const helper = result.outputFiles?.[0]?.text.trim()
  assert(helper, 'Missing vConsole lifecycle helper')
  let candidate = replaceOne(upstream, hooks.signal, 'e._signalLog=function(t){__artplayerVConsoleLogLifecycle.enqueue(this,t,window)}')
  candidate = replaceOne(candidate, hooks.unbind, '0===this.ADDED_LOG_PLUGIN_ID.length&&__artplayerVConsoleLogLifecycle.unbind(this,window)')
  candidate = replaceOne(candidate, hooks.panel, 'o&&__artplayerVConsoleLogLifecycle.renderTab(e,t,(function(){var e=document.querySelector("#__vc_plug_"+t.id);n.HD(o)?e.innerHTML+=o:n.mf(o.appendTo)?o.appendTo(e):n.kK(o)&&e.insertAdjacentElement("beforeend",o)}))')
  // Svelte clears the bound items element on destroy; these continuations resume after a timer.
  candidate = replaceOne(candidate, hooks.resizeResume, 'case 9:if(!s)return n.abrupt("return");F(p),X(p,W.getPosition(),k),0!==k&&H(N&&L),K();')
  candidate = replaceOne(candidate, hooks.itemResume, 'case 12:if(!s)return o.abrupt("return");X(p,W.getPosition(),k),e(6,s.style.height=P+"px",s),K();')
  candidate = replaceOne(candidate, hooks.factory, `(this||self,(function(){${helper}return function(){`)
  return candidate
}
