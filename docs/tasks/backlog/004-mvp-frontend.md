# Task 004 — MVP Frontend Refinement

## Status
pending

## Objective
在现有 `business-os-v3` Next.js demo 基础上，完成第一轮 MVP 前端收敛，让产品从“概念展示”进一步走向“可演示的老板经营工作台”。

## Background
- 现有仓库已经有 3 个关键界面：
  - `src/app/page.tsx`
  - `src/app/skills/page.tsx`
  - `src/app/workflows/page.tsx`
- 当前问题不是从零搭建，而是要让已有原型更接近 MVP：
  - 信息结构更清晰
  - 老板视角更强
  - 待确认事项更明确
  - 经营结果表达更强

## Scope
1. 基于前序 PRD / IA / 线框产出，收敛页面结构
2. 优化首页工作台的信息优先级
3. 增强 agent 团队、待办、结果、经营摘要的表达
4. 对 skills / workflows 页面做产品化收敛
5. 保持 mock data 驱动，不强行做真实后端
6. 让主路径适合 demo 和内部验证

## Non-goals
- 不做真实登录
- 不做支付
- 不做复杂权限
- 不做完整后端接入
- 不做数据库设计
- 不做多租户

## Deliverables
- 相关页面与组件代码改动
- 必要的 mock data / 文案 / 信息结构调整
- `docs/outputs/004-mvp-frontend-output.md`

## Acceptance Criteria
- 页面可运行
- 用户能清晰理解“我在管理一支 AI 掌柜团队”
- 首页能够体现：
  - 今日概况
  - 关键风险
  - 待确认事项
  - agent 执行状态
- 技能页和工作流页与产品定位一致
- 改动结果可被浏览器演示

## Default Decisions
- 优先提升可演示性和可理解性
- 优先最小闭环，不做重架构
- 优先调整信息架构与表达，不做无边界扩张
- 优先复用现有组件和数据结构

## Interrupt Only If
1. 现有代码结构无法承载目标，需要明显重构
2. 需要引入真实后端依赖才能继续
3. 前序 PRD / 线框存在明显冲突

## Next Task
`docs/tasks/backlog/005-runtime-schema.md`

## Completion Contract
完成后必须：
1. 把结果总结写入 `docs/outputs/004-mvp-frontend-output.md`
2. 更新 `docs/status/STATE.md`
3. 更新 `docs/status/TODO.md`
4. 更新必要的 `docs/status/DECISIONS.md` / `docs/status/RISKS.md`
5. 如果 execution policy 允许且无阻塞，则进入下一任务
