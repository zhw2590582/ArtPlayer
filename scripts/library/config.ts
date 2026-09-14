import type { BuildOptions, InlineConfig, LibraryFormats, Plugin } from 'vite'
import { bannerPlugin, workerBannerPlugin } from './banner.ts'

export interface LibraryConfigOptions {
  entry: string
  outDir: string
  name: string
  format: LibraryFormats
  fileName: string
  minify?: boolean | 'esbuild' | 'terser'
  target?: string | string[]
  banner?: string
  emptyOutDir?: boolean
}

type LibraryConfig = InlineConfig & {
  build: BuildOptions & { rollupOptions: NonNullable<BuildOptions['rollupOptions']> & { plugins: Plugin[] } }
  define: Record<string, string>
}

export function getViteBuildConfig(options: LibraryConfigOptions): LibraryConfig {
  const { entry, outDir, name, format, fileName, minify = 'esbuild', target = 'es2020', banner, emptyOutDir = false } = options
  return {
    configFile: false,
    publicDir: false,
    logLevel: 'warn',
    build: {
      outDir,
      emptyOutDir,
      minify,
      target,
      lib: { entry, name, formats: [format], fileName: () => fileName },
      rollupOptions: {
        output: { exports: 'default' },
        plugins: banner ? [bannerPlugin(name, banner)] : [],
      },
    },
    worker: { format: 'es', plugins: () => [workerBannerPlugin()] },
    define: { 'process.env.NODE_ENV': JSON.stringify(minify ? 'production' : 'development') },
  }
}
