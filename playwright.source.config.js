import assert from 'node:assert/strict'
import process from 'node:process'
import { defineConfig } from '@playwright/test'
import base from './playwright.config.js'
import { browserScopeConfig } from './scripts/browser-validation/scope.ts'

assert(!process.env.ARTPLAYER_BROWSER_ARTIFACTS, 'Use yarn test:browser:source to isolate source fixtures')
export default defineConfig(base, browserScopeConfig('source'))
