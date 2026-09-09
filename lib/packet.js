import { catalog } from './config.js';
import { route } from './router.js';
import { workflows } from './workflows.js';
import { createHash } from 'node:crypto';
const readOnly = ['explain', 'clarify', 'clear-context'];
export function selectControls(routing, config) {
  return catalog.controls.filter(control => {
    const a = control.applies_when;
    if (a.projectTypes.length && !a.projectTypes.includes(config.projectType)) return false;
    if (routing.sequence.every(action => readOnly.includes(action))) return control.floor && !a.actions.length && !a.risks.length;
    return (!a.actions.length && !a.risks.length) || a.actions.some(action => routing.sequence.includes(action)) || a.risks.some(risk => routing.risks.includes(risk));
  }).map(control => ({ ...control, severity: config.overrides[control.id]?.severity ?? control.severity }));
}
export function createPacket(prompt, config, options = {}) {
  const routing = route(prompt, config, options);
  const controls = selectControls(routing, config);
  const taskFingerprint = createHash('sha256').update(JSON.stringify({ prompt, files: [...(options.files ?? [])].sort(), action: options.action ?? null, risks: [...(options.risks ?? [])].sort() })).digest('hex');
  return { schemaVersion: 1, taskFingerprint, routing, profile: config.profile, projectType: config.projectType, execution: config.execution, thresholds: config.thresholds,
    steps: routing.sequence.flatMap(action => workflows[action].map(instruction => ({ action, instruction }))),
    commands: config.commands,
    controls: controls.map(({ id, requirement, verification, evidence, severity, source, exceptionAllowed }) => ({ id, requirement, verification, evidence, severity, source, exceptionAllowed })),
  };
}
export function renderPacket(packet) {
  const lines = ['# Task instructions', `Action order: ${packet.routing.sequence.join(' → ')}. Scope: ${packet.routing.scope}.`, `Risks: ${packet.routing.risks.join(', ') || 'none detected; inspect affected code'}. Profile: ${packet.profile}.`,
    `Thresholds: coverage ${packet.thresholds.coverage}%; reviewers ${packet.thresholds.reviewers}; function lines ${packet.thresholds.functionLines}; complexity ${packet.thresholds.complexity}.`,
    '', '## Steps', ...packet.steps.map((s, i) => `${i + 1}. ${s.instruction}`), '', '## Applicable controls',
    ...packet.controls.map(c => `- ${c.id} [${c.severity}]: ${c.requirement}`), '', '## Configured commands (review before execution)',
    ...Object.entries(packet.commands).filter(([, value]) => value).map(([key, value]) => `- ${key}: ${JSON.stringify(value)}`),
    '', 'Missing commands are unavailable, not success. Record passed, failed, not_run or not_applicable with evidence/reason. Required reviews and external actions need actual authorization. Load a control source only when its detail is needed; JSON output includes verification and source references.'];
  if (packet.execution === 'guided') lines.push('', 'For each step: identify inputs → perform one bounded action → check the observable result → record evidence. Stop dependent steps when a prerequisite fails. After two unsuccessful repair attempts, report the blocker and request focused help. Never invent command results.');
  return `${lines.join('\n')}\n`;
}
