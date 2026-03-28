# Task 001 — Product Definition

## Status
ready

## Objective
收敛 `business-os-v3` 的第一轮正式产品定义，明确第一版最值得验证的切口、核心价值主张、AI 团队角色、workflow 结构和信息架构，为后续 PRD、线框图与前端迭代提供稳定输入。

## Background
- 项目当前已有一个可运行的 Next.js 原型，展示了“掌柜团队 + 责任区 + 工作流”的产品方向。
- 目标用户是中国的产业带中小企业老板，而不是技术型用户。
- 产品应融合：
  - openclaw 的 skill / workflow 内核
  - ralv.ai 的拟人化 agent UI 体验

## Inputs
- `AGENTS.md`
- `docs/context/product-vision.md`
- `docs/context/target-users.md`
- `docs/context/references.md`
- `docs/context/product-principles.md`
- 当前已有前端原型（`src/app/*`, `src/data/*`, `src/components/*`）

## Scope
1. 产品一句话定位
2. 目标用户与优先切口选择
3. 核心痛点与机会判断
4. MVP 场景选择
5. 第一版 AI 团队 / agent 设计
6. 第一版 skill 设计
7. 第一版 workflow 设计
8. 拟人化 UI / 交互模型设计
9. 核心用户流程
10. 信息架构与页面清单
11. MVP 边界与优先级
12. 下一步研发建议

## Non-goals
- 不改动 `src/` 下产品代码
- 不做融资材料
- 不做完整商业计划书
- 不输出大而全平台蓝图

## Deliverables
- `docs/outputs/001-product-definition-output.md`

## Acceptance Criteria
- 有明确切口，不是泛泛的“AI 帮老板做生意”
- 对第一版做什么 / 不做什么有清晰取舍
- agent、skill、workflow 三层逻辑清楚
- 可以直接作为下一张任务卡（PRD / IA）的输入

## Default Decisions
- 优先最小闭环
- 优先老板能理解的表达
- 优先业务结果，而非概念完整度

## Interrupt Only If
1. 无法在两个完全不同的切口之间做出合理选择
2. 发现 repo 当前原型方向与产品背景存在根本冲突
3. 缺少必须由用户提供的业务前提

## Suggested Execution Shape
1. 先审视现有原型与数据模型，提炼当前隐含产品方向
2. 与 context 文档对齐，做取舍而不是发散
3. 写入正式输出文件
4. 更新状态文件

## Next Task
`docs/tasks/backlog/002-prd-and-ia.md`

## Completion Contract
完成本任务后必须：
1. 将正式结果写入 `docs/outputs/001-product-definition-output.md`
2. 更新 `docs/status/STATE.md`
3. 更新 `docs/status/TODO.md`
4. 如未命中 interruption policy，则将 `CURRENT_TASK` 切换到下一任务
