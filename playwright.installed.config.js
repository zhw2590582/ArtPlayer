import assert from 'node:assert/strict'
import process from 'node:process'
import { defineConfig } from '@playwright/test'
import base from './playwright.config.js'
import { browserScopeConfig, installedPackages } from './scripts/browser-validation/scope.ts'
import { verifyInstalledArtifacts } from './scripts/installed-artifacts.mjs'

assert(process.env.ARTPLAYER_BROWSER_ARTIFACTS, 'Use yarn test:browser:installed with checked tarballs')
verifyInstalledArtifacts(process.cwd(), process.env.ARTPLAYER_BROWSER_ARTIFACTS, installedPackages)
export default defineConfig(base, browserScopeConfig('installed'))
