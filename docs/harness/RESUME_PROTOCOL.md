# Resume Protocol

## Purpose

This file defines exactly how Cursor should recover context after an interrupted or fresh session. The repo state — not prior chat memory — is the source of truth.

## Required Read Order

At the beginning of every task or resumed session, read files in this order:

1. `/workspace/AGENTS.md`
2. `/workspace/docs/context/product-vision.md`
3. `/workspace/docs/context/target-users.md`
4. `/workspace/docs/context/references.md`
5. `/workspace/docs/context/product-principles.md`
6. `/workspace/docs/harness/EXECUTION_POLICY.md`
7. `/workspace/docs/harness/INTERRUPTION_POLICY.md`
8. `/workspace/docs/harness/OUTPUT_CONTRACT.md`
9. `/workspace/docs/status/STATE.md`
10. `/workspace/docs/status/TODO.md`
11. `/workspace/docs/status/DECISIONS.md`
12. `/workspace/docs/status/RISKS.md`
13. `/workspace/docs/tasks/active/CURRENT_TASK.md`

## Resume Behavior

After reading the required files:

1. Identify the current phase from `STATE.md`
2. Identify the current task from `CURRENT_TASK.md`
3. Identify any blockers from `RISKS.md`
4. Identify pending work from `TODO.md`
5. Resume the current task rather than restarting the project analysis

## If Current Task Is Already Complete

If the current task deliverables are clearly complete:

1. Confirm whether the task card has a `Next Task`
2. Check `EXECUTION_POLICY.md` to determine whether automatic continuation is allowed
3. If continuation is allowed and there is no blocker, move the next task into `CURRENT_TASK.md`
4. Update `STATE.md` and `TODO.md`
5. Continue work without asking for re-exploration

## If Files Conflict

If chat context conflicts with repo files:

- trust repo files over remembered chat context
- record the discrepancy in `docs/status/RISKS.md`
- only interrupt the user if the conflict blocks safe execution

## If State Is Incomplete

If a required file is missing or inconsistent:

1. Reconstruct the minimal missing state from the existing repo files
2. Write the repaired state back into the relevant status files
3. Continue, unless the missing information creates a high-risk ambiguity

## Anti-Pattern

Do not restart with a fresh brainstorming pass when the repo already contains:

- context docs
- a current task
- active status files

Resumption should be incremental and stateful.
