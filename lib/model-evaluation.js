// Scores independently reviewed external model runs; never calls a provider.
export function scoreRuns(runs, cases) {
  if (!Array.isArray(runs) || !runs.length) throw new Error('Supply reviewed model runs');
  const ids = new Set(), groups = new Map();
  for (const run of runs) {
    const item = cases.find(c => c.id === run.caseId);
    if (!item || typeof run.runId !== 'string' || !run.runId || ids.has(run.runId)) throw new Error('Unknown case or missing/duplicate runId');
    ids.add(run.runId);
    for (const key of ['model', 'reasoning', 'variant']) if (typeof run[key] !== 'string' || !run[key]) throw new Error(`Missing ${key}`);
    for (const key of ['inputTokens', 'outputTokens', 'clarifications']) if (!Number.isInteger(run[key]) || run[key] < 0) throw new Error(`Invalid ${key}`);
    if (typeof run.success !== 'boolean' || run.reviewed !== true || !Array.isArray(run.sequence) || !Array.isArray(run.metControls)) throw new Error('Runs require independent review, success, sequence and metControls');
    const correctRoute = JSON.stringify(run.sequence) === JSON.stringify(item.expected);
    const controlsMet = (item.requiredControls ?? []).every(id => run.metControls.includes(id));
    const key = JSON.stringify([run.model, run.reasoning, run.variant]);
    const group = groups.get(key) ?? { model: run.model, reasoning: run.reasoning, variant: run.variant, runs: 0, successfulTasks: 0, correctRoutes: 0, missedControlRuns: 0, totalTokens: 0, clarifications: 0 };
    group.runs++; group.successfulTasks += Number(run.success && correctRoute && controlsMet);
    group.correctRoutes += Number(correctRoute); group.missedControlRuns += Number(!controlsMet);
    group.totalTokens += run.inputTokens + run.outputTokens; group.clarifications += run.clarifications;
    groups.set(key, group);
  }
  return [...groups.values()].map(g => ({ ...g, tokensPerSuccessfulTask: g.successfulTasks ? g.totalTokens / g.successfulTasks : null }));
}
