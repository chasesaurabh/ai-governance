import { actions, risks as riskNames } from './config.js';

// First matching rule wins inside each explicitly ordered task clause.
export const routeRules = [
  ['clarify', '^(take a look at this|something.s off with the login)[.!?]*$'],
  ['clear-context', '\\b(new task|fresh start|clear (the )?context|different topic|forget everything|switch to a completely)\\b'],
  ['explain', '^(what (does|is|are|was)|what.s the best|explain|describe|how (do|does|did|to)|why|thanks|thank you)\\b|\\b(last week|historical).*\\b(explain|describe)\\b'],
  ['docs', '^(create|write|update|add)\\b.*\\b(documentation|readme|docs|runbook)\\b'],
  ['commit', '\\b(commit message|staged changes|git commit|changelog entry|conventional commit)\\b|^(commit|stage)\\b'],
  ['incident', '\\b(sev[1-4]|outage|alerts? firing|error rate (spike|at|through)|everything is broken in production|production database.*connection refused|production.*users are impacted|broken in production|pages are timing out|users are reporting.*(log in|data loss))\\b|\\b(site|service|app|api|database) (is )?down\\b'],
  ['security-review', '\\b(security (review|audit|check|scan)|is (this (sql )?(safe|secure)|.*safe from injection)|check.*(xss|vulnerabilit|injection)|secrets? (exposed|leaked)|hardcoded (password|credential))'],
  ['review', '\\b(review|look at (the|this|my)|check (this|my) (code|pr|implementation)|feedback on|what do you think|is this .*ok|anything wrong with)\\b'],
  ['dependencies', '\\b(update|upgrade|bump)\\b.*\\b(dependenc|package|version)|\\bdependency update'],
  ['architecture', '\\b(architecture decision|architectural decision|write.*adr|choose.*architecture)\\b'],
  ['new-project', '\\b(new project|from scratch|bootstrap|scaffold|new (react )?app|new microservice|greenfield)\\b'],
  ['bugfix', '\\b(fix|bug|broken|not working|crash(es|ing)?|regression|fails? when|used to work|typeerror|referenceerror|nullpointerexception|getting a? ?404|throws a 500 error|looks wrong|tests pass locally but fail)\\b'],
  ['refactor', '\\b(refactor|clean up|cleaner|simplify|restructure|extract|dry|reduce (complexity|duplication)|too complex)\\b'],
  ['feature', '\\b(add|implement|build|create|integrate|extend|i need|i want .*better|new endpoint|new page)\\b'],
  ['deploy', '\\b(deploy|ship|release|rollout|go live|promote)\\b'],
];
const riskPatterns = {
  security: /\b(auth\w*|password|secret|credential|vulnerabilit\w*|injection|xss|security|rate limiting)\b/i,
  data: /\b(pii|personal data|customer data|data model|data loss|payment\w*)\b/i,
  migration: /\b(migration|schema change|database change)\b/i,
  production: /\b(prod|production|outage|sev[1-4])\b/i,
  api: /\b(api|endpoint|http|route|contract)\b/i,
  dependencies: /\b(dependenc\w*|package|lockfile)\b/i,
};
export function route(prompt, config, options = {}) {
  if (typeof prompt !== 'string' || !prompt.trim()) throw new Error('A nonempty prompt is required');
  const files = options.files ?? [];
  if (!Array.isArray(files) || files.some(p => typeof p !== 'string' || p.startsWith('/') || p.includes('..') || /[:\\]/.test(p))) throw new Error('Files must be relative forward-slash paths');
  if (options.action && !actions.includes(options.action)) throw new Error('Unknown explicit action');
  if (options.risks && (!Array.isArray(options.risks) || options.risks.some(r => !riskNames.includes(r)))) throw new Error('Unknown explicit risk');
  const text = prompt.toLowerCase().replace(/```[\s\S]*?```/g, '').replace(/"[^"\n]*"/g, '').replace(/\b(do not|don't|never)\s+(deploy|ship|release)[^,;.]*/g, '');
  const explanatory = /^(what (does|is|are|was)|what.s the best|explain|describe|how (do|does|did|to)|why|thanks|thank you)\b/.test(text);
  const clauses = explanatory ? [text] : text.split(/\s+(?:and\s+then|then|and)\s+(?=(?:deploy|ship|release|review|refactor|commit|add|fix|clean up)\b)/);
  const sequence = options.action ? [options.action] : clauses.map(clause => routeRules.find(([, pattern]) => new RegExp(pattern, 'i').test(clause.trim()))?.[0] ?? 'clarify');
  const risks = new Set(options.risks ?? []);
  for (const [risk, pattern] of Object.entries(riskPatterns)) if (pattern.test(prompt)) risks.add(risk);
  for (const [risk, prefixes] of Object.entries(config.riskPaths)) {
    if (files.some(file => prefixes.some(prefix => file === prefix || file.startsWith(prefix.endsWith('/') ? prefix : `${prefix}/`)))) risks.add(risk);
  }
  const readOnly = sequence.every(a => ['explain', 'review', 'security-review', 'architecture', 'clarify', 'clear-context'].includes(a));
  return { sequence, risks: [...risks].sort(), scope: readOnly ? 'read-only' : sequence.some(a => ['deploy', 'incident'].includes(a)) ? 'authorization-required-for-external-actions' : 'local', needsClarification: sequence.includes('clarify'), basis: options.action ? 'explicit action' : 'rule-based; confirm against task context' };
}
