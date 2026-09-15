import process from 'node:process'
import { defineConfig } from '@playwright/test'
import base from './playwright.config.js'
import { browserScopeConfig, installedPackages, verifyInstalledBrowserEnvironment } from './scripts/browser-validation/scope.ts'
import { verifyInstalledArtifacts } from './scripts/installed-artifacts.mjs'

verifyInstalledBrowserEnvironment(process.env)
verifyInstalledArtifacts(process.cwd(), process.env.ARTPLAYER_BROWSER_ARTIFACTS, installedPackages)
export default defineConfig(base, browserScopeConfig('installed'))
