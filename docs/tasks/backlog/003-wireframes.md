# Task 003 — Wireframes

## Status
pending

## Objective
把 PRD 与信息架构转成可直接指导设计或前端开发的页面结构和线框说明。

## Background
- 依赖 `docs/tasks/backlog/002-prd-and-ia.md` 的产出
- 以当前仓库现有路由结构为基础：
  - `/`
  - `/skills`
  - `/workflows`
- 需要为后续 MVP 前端迭代提供页面级输入

## Scope
1. 首页 / 总工作台结构
2. Agent 团队视图结构
3. 单个 Agent 详情页结构
4. 任务发起入口与任务查看结构
5. 结果与待确认中心结构
6. 页面之间的跳转关系
7. 各页面关键模块说明
8. 页面级空态 / loading / 异常态说明（如适用）

## Non-goals
- 不做视觉稿
- 不直接改动前端代码
- 不做完整交互稿工具文件

## Deliverables
- `docs/outputs/003-wireframes-output.md`

## Acceptance Criteria
- 页面结构清晰
- 关键页面足以支撑 MVP 评审
- 页面模块与用户流程一致
- 内容可直接作为前端实现输入

## Default Decisions
- 优先页面骨架与信息组织
- 优先最小闭环页面，不发散加页面
- 优先复用当前仓库已有导航和路由认知

## Interrupt Only If
1. 当前 PRD 无法支撑页面定义
2. 页面模型出现两套完全不同架构且无法自行取舍
3. 用户明确改变 MVP 范围

## Next Task
`docs/tasks/backlog/004-mvp-frontend.md`

## Completion Contract
任务完成后必须：
1. 写入 `docs/outputs/003-wireframes-output.md`
2. 更新 `docs/status/STATE.md`
3. 更新 `docs/status/TODO.md`
4. 如无阻塞，准备切换到 `004-mvp-frontend.md`
