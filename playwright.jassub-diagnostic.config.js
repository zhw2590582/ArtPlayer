import base from './playwright.config.js'

// Diagnostic profile only; canonical browser acceptance uses playwright.config.js.
export default {
  ...base,
  testMatch: /jassub-(?:native|hybrid|platform)\.spec\.js$/,
  projects: base.projects.filter(project => project.name === 'firefox').map(project => ({
    ...project,
    use: {
      ...project.use,
      launchOptions: { firefoxUserPrefs: { 'gfx.webrender.software': true } },
    },
  })),
}
