# Risks Log

## Active Risks

### R1 — Harness ceremony may become too heavy
- **Risk:** Too many files create process overhead and make the system harder to use.
- **Mitigation:** Keep the first harness version minimal, action-oriented, and tightly scoped to the current repo.
- **Owner:** Harness maintainer
- **Status:** Watching

### R2 — Auto-continue may feel too aggressive
- **Risk:** The agent may continue to the next task when the user wanted a review gate.
- **Mitigation:** Default policy allows continuation only when the next task is clearly defined, the output is written, and no blocker is present.
- **Owner:** Harness maintainer
- **Status:** Watching

### R3 — Validation commands are still lightweight
- **Risk:** The repo currently lacks full lint/test coverage, so completion proofs may remain relatively shallow.
- **Mitigation:** Start with `build` and `typecheck`; strengthen validation in a later task when needed.
- **Owner:** Engineering
- **Status:** Open

### R4 — Product direction may evolve faster than docs
- **Risk:** Repo documentation can drift behind product decisions if status and decision logs are not maintained.
- **Mitigation:** Treat `docs/status/DECISIONS.md` as mandatory output for meaningful strategy or scope changes.
- **Owner:** Every execution cycle
- **Status:** Open

## Cleared Risks

- None yet.
