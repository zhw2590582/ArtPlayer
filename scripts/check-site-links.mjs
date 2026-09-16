import process from 'node:process'
import { checkSiteLinks } from './site-build/links.ts'

try {
  const report = await checkSiteLinks(`${process.cwd()}/docs`)
  console.log(JSON.stringify(report, null, 2))
  if (report.issues.length)
    process.exitCode = 1
}
catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
}
