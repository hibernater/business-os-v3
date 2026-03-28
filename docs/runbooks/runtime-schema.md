# Runtime Schema Runbook

## Purpose
Define the minimum backend/runtime contract needed to move the repo from a mock-only demo to a real agent/workflow product.

## Scope
- agent schema
- skill schema
- workflow schema
- task state model
- execution log model
- frontend/backend contract

## Required Sections
1. Goals of the runtime layer
2. Core domain objects
3. State transitions
4. Execution triggers
5. Human approval checkpoints
6. Data persistence recommendations
7. API surface for the frontend
8. Mock-first vs real implementation boundary

## Constraints
- Keep MVP-first
- Prefer simple schemas over “platform” abstractions
- Align with current frontend concepts already present in `src/data/*`
- Do not design distributed infrastructure unless explicitly requested

## Deliverable Location
- `docs/outputs/005-runtime-schema-output.md`

## Validation Questions
- Can the current UI be mapped to these runtime entities?
- Is there a clear distinction between agent, skill, workflow, and task execution?
- Can a frontend engineer implement against the proposed API contract?
