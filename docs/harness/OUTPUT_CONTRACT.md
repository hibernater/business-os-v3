# Output Contract

This repository uses file-based outputs so autonomous work survives beyond chat history.

## Core rules

1. Formal deliverables MUST be written under `docs/outputs/`.
2. Task and phase changes MUST be reflected under `docs/status/`.
3. If a task card defines a specific output path, that path is the source of truth.
4. Chat summaries are secondary; repo files are primary.

## What every completed task must update

When a task reaches `completed`, the agent must:

1. Write or update the required deliverable file in `docs/outputs/`
2. Update `docs/status/STATE.md`
3. Update `docs/status/TODO.md`
4. Append any important decisions to `docs/status/DECISIONS.md`
5. Append any residual uncertainty or follow-up risk to `docs/status/RISKS.md`
6. Move or rewrite `docs/tasks/active/CURRENT_TASK.md` so it points to the next active task, if any

## Recommended deliverable sections

Unless a task card says otherwise, deliverables should include:

1. Objective
2. Scope covered
3. Output / artifact
4. Key decisions
5. Validation performed
6. Known risks
7. Recommended next task

## Task completion checklist

Before marking a task complete, verify:

- The deliverable exists in the expected path
- The deliverable addresses the task acceptance criteria
- Status files and current task pointer are updated
- Any required validation commands were run
- The next task is unambiguous
