# Execution Policy

## Purpose
This repository uses a file-driven harness so Cursor can operate with persistent state instead of relying on ad hoc chat prompts.

## Default Operating Mode
- Default mode: **autonomous continuation within the current approved task chain**
- Default stance: **do not stop for small decisions**
- Source of truth for what to do next:
  1. `AGENTS.md`
  2. `docs/status/STATE.md`
  3. `docs/tasks/active/CURRENT_TASK.md`

## Execution Loop
For every execution cycle:
1. Read the current repo context and status files
2. Identify the current phase, current task, and expected deliverables
3. Complete the current task's deliverables
4. Write formal outputs to `docs/outputs/`
5. Update `docs/status/`
6. If the current task is complete and a next task is defined, decide whether to continue automatically

## Auto-Continue Rules
The agent should automatically continue to the next task only when **all** of the following are true:
1. The current task acceptance criteria are satisfied
2. The current task's completion contract has been fulfilled
3. `Next Task` is explicitly defined in the current task card
4. No interruption condition from `docs/harness/INTERRUPTION_POLICY.md` has been triggered
5. The next task does not require a new product-direction decision from the user

## Stop-After-Task Rules
The agent should stop after the current task if **any** of the following are true:
1. The task card explicitly requires user review before the next task
2. The next task changes scope materially from strategy to implementation, or from design to engineering
3. The next task depends on missing environment setup, credentials, or external assets
4. The next task would create significant irreversible changes

## Allowed Autonomous Decisions
The agent may decide autonomously on:
- file naming inside the harness structure
- wording improvements that preserve intent
- small structural refinements to docs
- ordering of sections inside output documents
- small implementation details when a task card already defines the scope

## Decisions That Require Caution
The agent should be conservative about:
- changing product direction
- widening scope beyond the current task card
- deleting existing product or app code
- introducing new dependencies
- changing branch or release flow assumptions

## Completion Contract
No task is considered complete until:
1. deliverables are written to their expected files
2. status files are updated
3. risks and decisions are recorded if relevant
4. validation commands for the task have been run when applicable

