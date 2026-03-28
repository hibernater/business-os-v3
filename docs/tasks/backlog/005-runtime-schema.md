# Task 006 — Runtime Schema

## Status
pending

## Objective
为未来的后端 orchestrator 与前端 demo 之间建立最小可用的数据契约，定义 agent / skill / workflow / task execution / execution log 的基础 schema。

## Background
- 当前仓库主要是前端 demo，使用 `src/types/index.ts`、`src/data/agents.ts` 和 `src/data/workflows.ts` 承载 mock 结构。
- 后续如果要进入真实 MVP，需要先把“前端演示结构”升级为“可作为运行时契约的结构”。

## Scope
1. 定义第一版 agent schema
2. 定义第一版 skill schema
3. 定义第一版 workflow schema
4. 定义 task execution state model
5. 定义 execution log / activity log contract
6. 明确前端页面如何消费这些数据

## Non-goals
- 不实现真实后端服务
- 不接数据库
- 不实现复杂调度引擎
- 不做多租户设计

## Deliverables
- `docs/outputs/005-runtime-schema-output.md`

## Acceptance Criteria
- schema 结构能支撑现有 demo 页面
- schema 能作为后续 API 设计的起点
- 状态流转清晰、字段职责明确
- 能解释前端哪些 mock 字段应保留、哪些应重构

## Default Decisions
- 优先最小 MVP 可用性，不做过度抽象
- 优先兼容现有前端展示，再逐步走向真实 runtime
- 优先可读性和可扩展性平衡

## Interrupt Only If
1. 真实运行时目标发生重大变化
2. 需要引入复杂后端基础设施才能继续
3. 用户要求直接实现 API 或持久化层

## Next Task
none

## Completion Contract
任务完成后必须：
1. 写入 `docs/outputs/005-runtime-schema-output.md`
2. 更新 `docs/status/STATE.md`
3. 更新 `docs/status/TODO.md`
4. 更新 `docs/status/DECISIONS.md`（如有新增关键决策）
5. 更新 `docs/status/RISKS.md`（如有新增风险）
