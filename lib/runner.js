import { spawn, execFileSync } from 'node:child_process';
import { loadConfig } from './config.js';
import { repository } from './git.js';
import { digest, readLocal, writeLocal, sourceFingerprint } from './local-state.js';
const trustDigest = (root, config) => digest({ root, config });
export function trustProject(root) {
  root = repository(root); const config = loadConfig(root);
  const trust = { schemaVersion: 1, digest: trustDigest(root, config), confirmedAt: new Date().toISOString() };
  writeLocal(root, 'trust.json', trust); return trust;
}
function stopProcess(child) {
  if (!child.pid) return;
  if (process.platform === 'win32') {
    try { execFileSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore', windowsHide: true }); } catch { /* Already ended. */ }
  } else {
    try { process.kill(-child.pid, 'SIGKILL'); } catch { child.kill('SIGKILL'); }
  }
}
export function execute(command, root, timeoutMs, signal) {
  return new Promise(resolve => {
    const started = Date.now();
    const outputHash = createOutputHash();
    const child = spawn(command, { cwd: root, shell: true, windowsHide: true, detached: process.platform !== 'win32', stdio: ['ignore', 'pipe', 'pipe'] });
    let timedOut = false, cancelled = false, bytes = 0, settled = false;
    const consume = chunk => { bytes += chunk.length; outputHash.update(chunk); };
    child.stdout.on('data', consume); child.stderr.on('data', consume);
    const timer = setTimeout(() => { timedOut = true; stopProcess(child); }, timeoutMs);
    const cancel = () => { cancelled = true; stopProcess(child); };
    signal?.addEventListener('abort', cancel, { once: true });
    if (signal?.aborted) cancel();
    const finish = (code, error) => {
      if (settled) return; settled = true; clearTimeout(timer); signal?.removeEventListener('abort', cancel);
      resolve({ status: timedOut ? 'timed_out' : cancelled ? 'cancelled' : code === 0 && !error ? 'passed' : 'failed', exitCode: code,
        durationMs: Date.now() - started, outputBytes: bytes, outputDigest: outputHash.digest('hex'), error: error ? 'Process could not start' : null });
    };
    child.on('error', error => finish(null, error)); child.on('close', code => finish(code));
  });
}
import { createHash } from 'node:crypto';
const createOutputHash = () => createHash('sha256');
export async function runChecks(root, { selected, timeoutMs = 120000, signal, force = false } = {}) {
  root = repository(root); const config = loadConfig(root);
  if (!Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 3600000) throw new Error('Timeout must be 1–3600000 ms');
  if (readLocal(root, 'trust.json')?.digest !== trustDigest(root, config)) throw new Error('Review project commands/code, then run trust --accept. Config changes require renewed trust.');
  const keys = selected ?? Object.keys(config.commands).filter(k => config.commands[k]);
  if (!keys.length || keys.some(k => !config.commands[k])) throw new Error('Select at least one configured check');
  const fingerprint = sourceFingerprint(root, config);
  const previous = readLocal(root, 'runs.json', {});
  const results = [];
  for (const key of [...new Set(keys)]) {
    if (signal?.aborted) break;
    const command = config.commands[key];
    const old = previous[key];
    if (!force && old?.fingerprint === fingerprint && old?.status === 'passed') { results.push({ ...old, cached: true }); continue; }
    const observed = await execute(command, root, timeoutMs, signal);
    const result = { ...observed, key, command, fingerprint, cached: false, observedAt: new Date().toISOString(), observer: { node: process.version, platform: process.platform, framework: '2.0.0' } };
    if (sourceFingerprint(root, config) !== fingerprint) result.status = 'stale';
    previous[key] = result; results.push(result);
    writeLocal(root, 'runs.json', previous);
    if (['stale', 'cancelled'].includes(result.status)) break;
  }
  return { fingerprint, results, complete: results.length === new Set(keys).size && results.every(r => r.status === 'passed'), note: 'Observed process exits only. Review test/scanner reports independently; no output text is stored. Ignored files/environment and external services are not fingerprinted; use --force when those change.' };
}
export function verificationSummary(root) {
  root = repository(root); const config = loadConfig(root), fingerprint = sourceFingerprint(root, config);
  const records = readLocal(root, 'runs.json', {});
  return Object.entries(config.commands).filter(([, v]) => v).map(([key]) => {
    const record = records[key];
    return { key, status: !record ? 'not_run' : record.fingerprint !== fingerprint ? 'stale' : record.status, observedAt: record?.observedAt ?? null };
  });
}
