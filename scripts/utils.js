export { getProjects } from './projects.js'

// Convert kebab-case to PascalCase: artplayer-plugin-ads -> ArtplayerPluginAds
export function toPascalCase(name) {
  return name.replace(/(^|-)([a-z])/g, (_, _p, c) => c.toUpperCase())
}

// Convert kebab-case to camelCase: artplayer-plugin-ads -> artplayerPluginAds
export function toCamelCase(name) {
  return name.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

// Get the global variable name for a package
// - artplayer, artplayer-tool-* -> PascalCase (class)
// - artplayer-plugin-*, artplayer-proxy-* -> camelCase (function)
export function getGlobalName(name) {
  if (name === 'artplayer' || name.startsWith('artplayer-tool-')) {
    return toPascalCase(name)
  }
  return toCamelCase(name)
}

// Get Vite build config
export function getViteBuildConfig(options) {
  const {
    entry,
    outDir,
    name,
    format,
    fileName,
    minify = 'esbuild',
    target = 'es2020',
    banner,
    emptyOutDir = false,
  } = options

  const config = {
    configFile: false,
    publicDir: false,
    logLevel: 'warn',
    build: {
      outDir,
      emptyOutDir,
      minify,
      target,
      lib: {
        entry,
        name,
        formats: [format],
        fileName: () => fileName,
      },
      rollupOptions: {
        output: {
          exports: 'default',
        },
        plugins: banner
          ? [{
              name: 'add-banner-and-global',
              generateBundle(outputOptions, bundle) {
                for (const chunk of Object.values(bundle)) {
                  if (chunk.type === 'chunk') {
                    // Remove any inline worker banners (inside template literals)
                    // Match: `/*! ... */\n and replace with just `
                    let code = chunk.code.replace(/`\/\*![\s\S]*?\*\/\n/g, '`')
                    // Add main banner if not present
                    if (!code.startsWith('/*!')) {
                      code = `${banner}\n${code}`
                    }
                    // For UMD format, modify the wrapper to always expose global
                    // even when AMD loader is present (fix for RequireJS environments)
                    if (outputOptions.format === 'umd') {
                      const wrapper = code.replace(/^\/\*![\s\S]*?\*\/\s*/, '').match(/^[!(\s]*function\s*\(\s*([\w$]+)\s*,\s*([\w$]+)\s*\)/)
                      if (!wrapper)
                        throw new Error(`Unrecognized UMD wrapper for ${name}`)
                      const global = wrapper[1]
                      const amd = /["']function["']\s*===?\s*typeof define\s*&&\s*define\.amd\s*\?\s*define\(([\w$]+)\)\s*:/
                      if (!amd.test(code))
                        throw new Error(`Unrecognized AMD branch for ${name}`)
                      // Keep AMD and the global export identical regardless of minified parameter names.
                      code = code.replace(
                        amd,
                        `"function"==typeof define&&define.amd?(${global}.${name}=$1(),define(function(){return ${global}.${name}})):`,
                      )
                    }
                    chunk.code = code
                  }
                }
              },
            }]
          : [],
      },
    },
    // Disable banner for inline workers
    worker: {
      format: 'es',
      plugins: () => [{
        name: 'remove-worker-banner',
        generateBundle(_, bundle) {
          for (const chunk of Object.values(bundle)) {
            if (chunk.type === 'chunk' && chunk.code.startsWith('/*!')) {
              // Remove banner from worker code
              chunk.code = chunk.code.replace(/^\/\*![\s\S]*?\*\/\s*/, '')
            }
          }
        },
      }],
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(minify ? 'production' : 'development'),
    },
  }

  return config
}
