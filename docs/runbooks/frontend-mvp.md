# Frontend MVP Runbook

## Goal
在现有 `business-os-v3` Next.js 原型上，围绕最小闭环继续推进真实 MVP 前端，而不是推翻重做。

## Preferred Workflow
1. 读取 `docs/context/*`
2. 读取 `docs/status/*`
3. 读取 `docs/tasks/active/CURRENT_TASK.md`
4. 检查当前 `src/app/*`、`src/components/*`、`src/data/*`
5. 明确：
   - 哪些页面已存在
   - 哪些页面只是 demo
   - 哪些模块需要增强
6. 输出小范围改造计划
7. 执行最小闭环改动
8. 运行验证命令
9. 更新状态与输出文件

## Repo-specific Guidance
- 当前首页工作台已经有很强的产品感，不要轻易推翻交互骨架。
- 优先增强：
  - onboarding / 首次理解
  - 老板摘要 / 待确认事项
  - metrics 与经营结果表达
  - 跨页面一致性
- `src/data/agents.ts` 和 `src/data/workflows.ts` 是高价值 mock data，优先复用。
- 尽量把“更像真实经营产品”的信息层增强放在 UI 第一轮，而不是一开始接真实后端。

## Output Expectations
产出至少应包含：
- 改动模块列表
- 关键交互说明
- mock 与真实能力边界
- 后续接 runtime 所需的接口契约建议

## Validation
至少运行：
- `npm run typecheck`
- `npm run build`

