import { randomUUID } from 'node:crypto';
import { readLocal, writeLocal } from './local-state.js';
export const pilotTools = ['copilot', 'claude', 'cursor', 'devin'];
export function startPilot(root, tool) {
  if (!pilotTools.includes(tool)) throw new Error('Choose copilot, claude, cursor or devin');
  const old = readLocal(root, 'pilot.json');
  const data = old ?? { schemaVersion: 1, participant: randomUUID(), startedAt: new Date().toISOString(), events: [] };
  data.enabled = true; data.tool = tool; writeLocal(root, 'pilot.json', data);
  return { enabled: true, tool, note: 'Local-only opt-in. No source, prompts, paths or command output are recorded or uploaded.' };
}
export function pilotEvent(root, type, fields = {}) {
  let data;
  try { data = readLocal(root, 'pilot.json'); } catch { return; }
  if (!data?.enabled) return;
  if (!['init', 'check', 'feedback', 'setup_help'].includes(type)) throw new Error('Unknown pilot event');
  const event = { type, at: new Date().toISOString(), tool: data.tool };
  for (const [key, value] of Object.entries(fields)) {
    if (['durationMs', 'findings', 'missingTools'].includes(key)) {
      if (!Number.isFinite(value) || value < 0) throw new Error(`Invalid pilot metric: ${key}`);
    } else if (key === 'rating') {
      if (!['useful', 'dismissed'].includes(value)) throw new Error('Rating must be useful or dismissed');
    } else if (key === 'rule') {
      if (!/^[A-Z]+-\d{3}$/.test(value)) throw new Error('Use a rule ID only; no file paths or free text');
    } else throw new Error('Pilot event field is not permitted');
    event[key] = value;
  }
  data.events.push(event); data.events = data.events.slice(-1000); writeLocal(root, 'pilot.json', data);
}
export function summarizePilot(data) {
  if (!data || data.schemaVersion !== 1 || !Array.isArray(data.events)) throw new Error('No valid pilot data');
  const checks = data.events.filter(e => e.type === 'check');
  const feedback = data.events.filter(e => e.type === 'feedback');
  const days = [...new Set(checks.map(e => e.at.slice(0, 10)))];
  const useful = feedback.find(e => e.rating === 'useful');
  return { participant: data.participant, tool: data.tool, enabled: data.enabled, startedAt: data.startedAt,
    checks: checks.length, activeDays: days.length,
    firstCheckMs: checks.length ? Date.parse(checks[0].at) - Date.parse(data.startedAt) : null,
    firstUsefulFeedbackMs: useful ? Date.parse(useful.at) - Date.parse(data.startedAt) : null,
    usefulFindings: feedback.filter(e => e.rating === 'useful').length, dismissedFindings: feedback.filter(e => e.rating === 'dismissed').length,
    setupHelpRequests: data.events.filter(e => e.type === 'setup_help').length,
    averageCheckMs: checks.length ? Math.round(checks.reduce((n, e) => n + e.durationMs, 0) / checks.length) : null,
    activeInWeekTwo: checks.some(e => { const days = (Date.parse(e.at) - Date.parse(data.startedAt)) / 86400000; return days >= 7 && days < 14; }),
    note: 'Self-reported feedback and local use only; no proof of defect prevention or organization-wide adoption. Stores at most 1000 events.' };
}
export function stopPilot(root) {
  const data = readLocal(root, 'pilot.json');
  if (data) { data.enabled = false; writeLocal(root, 'pilot.json', data); }
}
