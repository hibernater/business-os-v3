# AGENTS.md

## Mission
`business-os-v3` is an AI-native “掌柜团队 / Business OS” product prototype for Chinese industrial-belt SME owners. The product combines:
- a workflow / skill / orchestration core inspired by openclaw
- an anthropomorphic, team-like operating UI inspired by ralv.ai

The current repo already contains a functioning front-end demo. Future agent work should refine the product, define the MVP, and evolve the prototype into a more complete operating system for autonomous work.

## Startup Sequence
At the beginning of every substantial task, read files in this order:
1. `AGENTS.md`
2. `docs/context/product-vision.md`
3. `docs/context/target-users.md`
4. `docs/context/references.md`
5. `docs/context/product-principles.md`
6. `docs/harness/EXECUTION_POLICY.md`
7. `docs/harness/INTERRUPTION_POLICY.md`
8. `docs/harness/RESUME_PROTOCOL.md`
9. `docs/harness/OUTPUT_CONTRACT.md`
10. `docs/status/STATE.md`
11. `docs/status/TODO.md`
12. `docs/status/DECISIONS.md`
13. `docs/status/RISKS.md`
14. `docs/tasks/active/CURRENT_TASK.md`

## Default Working Style
- Treat repo files as the source of truth, not chat memory.
- Write formal outputs to `docs/outputs/`, not only to chat.
- Update status files whenever phase, task, decision, or risk changes.
- Prefer small, explicit milestones over vague “keep going” behavior.
- Reuse current product language: 掌柜, 责任区, 工作流, 技能, 调度中心.

## Planning and Execution Discipline
- If the current task is in planning mode, first produce a plan aligned with the task card.
- If execution is authorized by policy and no blocker is present, continue within the current task without unnecessary pauses.
- Only move to the next task when the current task’s completion contract has been satisfied.

## Validation Expectations
When code or config changes are made, validate with the strongest practical commands available in this repo.

Current preferred commands:
- `npm run dev`
- `npm run typecheck`
- `npm run build`
- `npm run check`

## Interrupt Only For
Interrupt only when blocked by credentials, destructive decisions, major product ambiguity, legal/security risk, or a broken environment that prevents progress.

## Output Standard
Every completed task should leave behind:
- an output artifact in `docs/outputs/`
- updated `docs/status/*`
- a clear next task or blocker state
