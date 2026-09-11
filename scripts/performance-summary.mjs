import { summarizePerformance } from '../refactor/scripts/performance.mjs'

export function performanceSummary(report) {
  const lines = [
    `## ArtPlayer performance: ${report.environment.browser} ${report.environment.version}`,
    '',
    `Status: **${report.status}**. Timing and size signals require review; lifecycle checks must pass independently.`,
    '',
    '| Group | Configuration | Metric | Published median (ms) | Candidate median (ms) | Review |',
    '| --- | --- | --- | ---: | ---: | --- |',
  ]
  for (const group of report.groups) {
    const before = summarizePerformance(report.runs.find(run => run.group === group.group && run.variant === 'published').measurements)
    for (const [configuration, metrics] of Object.entries(group.summary)) {
      for (const [metric, result] of Object.entries(metrics)) {
        const review = group.reviewSignals.some(signal => signal.configuration === configuration && signal.metric === metric)
        lines.push(`| ${group.group + 1} | ${configuration} | ${metric} | ${before[configuration][metric].median.toFixed(2)} | ${result.median.toFixed(2)} | ${review ? 'Required' : '-'} |`)
      }
    }
  }
  lines.push('', '| Package entry | Raw bytes (old → new) | gzip 9 | Brotli 6 | Review |', '| --- | ---: | ---: | ---: | --- |')
  for (const size of report.sizes)
    lines.push(`| ${size.member} | ${size.before.raw} → ${size.after.raw} | ${size.before.gzip9} → ${size.after.gzip9} | ${size.before.brotli6} → ${size.after.brotli6} | ${size.reviewSignals.length ? 'Required' : '-'} |`)
  const resources = report.runs.filter(run => run.variant === 'candidate').reduce((count, run) => count + run.measurements.resources.length, 0)
  lines.push('', `${resources} candidate resource probes passed: no retained timers, late callbacks, RAF, proxy entries, instances or DOM after destruction. This does not measure native heap or GPU memory.`, '', 'One warm-up and five measured samples per configuration, per group; three alternating paired groups. Compression is per file, not HTTP transfer size.', '')
  return lines.join('\n')
}
