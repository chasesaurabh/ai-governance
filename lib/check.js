import { dirname } from 'node:path';
import { changes, contentAt } from './git.js';
import { loadConfig } from './config.js';
import { createPacket } from './packet.js';
export const findingRules = {
  'DEP-001': { severity: 'error', title: 'Dependency change has no corresponding lockfile change', why: 'A manifest/lock mismatch can produce different installations.', next: 'Update the applicable lockfile with the project package manager and review it.' },
  'TEST-001': { severity: 'warning', title: 'Code changed without test changes', why: 'Existing tests may cover the change, but that has not been verified.', next: 'Run relevant tests; add a regression test for a bug fix or explain existing coverage.' },
  'AUTH-001': { severity: 'warning', title: 'Authorization-sensitive change needs verification', why: 'Access-control changes can alter who can perform protected operations.', next: 'Verify denied and allowed access cases and obtain the required security review.' },
  'API-001': { severity: 'warning', title: 'Public interface compatibility needs review', why: 'An interface change may affect existing consumers.', next: 'Compare the previous interface and run available contract checks.' },
  'DB-001': { severity: 'warning', title: 'Migration requires recovery and compatibility evidence', why: 'A migration can break older application versions or data recovery.', next: 'Test the migration using synthetic data and document the recovery procedure.' },
  'CI-001': { severity: 'warning', title: 'CI execution or permissions changed', why: 'Pipeline changes affect code execution and credential boundaries.', next: 'Review permissions, untrusted input handling and required gate behavior.' },
  'DOC-001': { severity: 'info', title: 'Documentation-only change', why: 'No implementation files were found in this change set.', next: 'Check links, examples and factual accuracy; code tests are not selected automatically.' },
};
export function checkChanges(root, options = {}) {
  const snapshot = changes(root, options);
  const config = loadConfig(snapshot.root);
  const files = snapshot.files.map(f => f.path);
  const docOnly = files.length > 0 && files.every(p => /\.(md|mdx|rst|txt|adoc)$/i.test(p));
  const detectedRisks = new Set();
  for (const p of files) {
    if (/(^|\/)(auth|authentication|authorization|security)(\/|\.)|password|credential/i.test(p)) detectedRisks.add('security');
    if (/migration|schema\.(sql|prisma)$/i.test(p)) detectedRisks.add('migration');
    if (/(^|\/)(api|routes|controllers|openapi)(\/|\.)/i.test(p)) detectedRisks.add('api');
  }
  const packet = createPacket(docOnly ? 'Update documentation' : 'Review these changes', config, { files, risks: [...detectedRisks], action: docOnly ? 'docs' : 'review' });
  const findings = [];
  const add = (rule, path) => findings.push({ id: `${rule}:${path}`, rule, path, ...findingRules[rule] });
  const testsChanged = files.some(p => /(^|\/)(__tests__|tests?|specs?)(\/|\.)|[._-](test|spec)\./i.test(p));
  if (docOnly) add('DOC-001', files[0]);
  for (const file of snapshot.files) {
    const p = file.path;
    if (p.endsWith('package.json') && file.status !== 'D') {
      const before = JSON.parse(contentAt(snapshot, file, true) || '{}');
      const after = JSON.parse(contentAt(snapshot, file) || '{}');
      const deps = value => JSON.stringify(['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'].map(k => Object.entries(value[k] ?? {}).sort()));
      const folder = dirname(p).replaceAll('\\', '/');
      const hasLock = files.some(lock => /(^|\/)(package-lock\.json|npm-shrinkwrap\.json|pnpm-lock\.yaml|yarn\.lock|bun\.lockb?)$/.test(lock) && (dirname(lock) === '.' || folder === dirname(lock) || folder.startsWith(`${dirname(lock)}/`)) && snapshot.files.find(f => f.path === lock)?.status !== 'D');
      if (deps(before) !== deps(after) && !hasLock) add('DEP-001', p);
    }
    if (/\.(js|jsx|ts|tsx|py|go|java|cs|rs)$/.test(p) && !testsChanged && !/([._-](test|spec)\.|(^|\/)(tests?|__tests__)\/)/.test(p)) add('TEST-001', p);
    if (/(^|\/)(auth|authentication|authorization|security)(\/|\.)|password|credential/i.test(p)) add('AUTH-001', p);
    if (/migration|schema\.(sql|prisma)$/i.test(p)) add('DB-001', p);
    if (/(^|\/)(api|routes|controllers|openapi)(\/|\.)/i.test(p)) add('API-001', p);
    if (/^\.github\/workflows\/|azure-pipelines|Jenkinsfile|\.gitlab-ci/.test(p)) add('CI-001', p);
  }
  const commands = docOnly || !files.length ? {} : config.commands;
  return { schemaVersion: 1, scope: snapshot.staged ? 'staged' : options.base ? `changes since ${options.base} merge base` : 'working tree including untracked files', head: snapshot.head,
    files: snapshot.files, findings, risks: packet.routing.risks, commands,
    coverage: { executableChecks: Object.entries(commands).filter(([, v]) => v).map(([k]) => k), humanReviewControls: packet.controls.map(c => c.id), missingTools: docOnly || !files.length ? [] : ['test', 'secrets'].filter(k => !commands[k]) },
    note: 'Static findings are review prompts, not proof of vulnerabilities or complete compliance. No project commands executed.' };
}
export function renderCheck(report) {
  const lines = [`${report.files.length} changed files (${report.scope}). ${report.findings.length} findings.`];
  for (const f of report.findings) lines.push(`[${f.severity}] ${f.rule} ${JSON.stringify(f.path)}: ${f.title}\n  ${f.next}`);
  if (report.coverage.missingTools.length) lines.push(`Not configured: ${report.coverage.missingTools.join(', ')}.`);
  lines.push(report.note);
  return lines.join('\n');
}
