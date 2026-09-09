// Usage: node check-coverage.cjs coverage/coverage-summary.json 80
const fs = require('node:fs');
function checkCoverage(report, threshold) {
  const value = report?.total?.lines?.pct;
  if (!Number.isFinite(threshold) || threshold < 0 || threshold > 100) throw new Error('Invalid coverage threshold');
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 100) throw new Error('Missing or invalid line coverage');
  if (value < threshold) throw new Error(`Coverage ${value}% is below ${threshold}%`);
  return value;
}
module.exports = { checkCoverage };
if (require.main === module) {
  try {
    const value = checkCoverage(JSON.parse(fs.readFileSync(process.argv[2], 'utf8')), Number(process.argv[3] ?? 80));
    console.log(`Coverage: ${value}%`);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
