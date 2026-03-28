# business-os-v3

面向中国产业带中小企业老板的 AI 原生经营工作台原型。当前仓库主要承载：

- 一个可运行的前端 demo（工作台 / 技能管理 / 工作流）
- 一套拟人化 agent + workflow 的产品表达
- 一套面向 Cursor 长时间自主执行的 harness engineer 基础设施

## 本地运行

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`

## 当前技术栈

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS 4
- @dnd-kit/core

## Harness Engineer 入口

如果你希望 Cursor 以“长任务代理”的方式工作，请先阅读：

1. `AGENTS.md`
2. `docs/harness/EXECUTION_POLICY.md`
3. `docs/harness/INTERRUPTION_POLICY.md`
4. `docs/harness/RESUME_PROTOCOL.md`
5. `docs/harness/OUTPUT_CONTRACT.md`
6. `docs/status/STATE.md`
7. `docs/status/TODO.md`
8. `docs/status/DECISIONS.md`
9. `docs/status/RISKS.md`
10. `docs/tasks/active/CURRENT_TASK.md`

## 推荐启动语

```text
请先按以下顺序读取并建立上下文：
1. AGENTS.md
2. docs/harness/EXECUTION_POLICY.md
3. docs/harness/INTERRUPTION_POLICY.md
4. docs/harness/RESUME_PROTOCOL.md
5. docs/harness/OUTPUT_CONTRACT.md
6. docs/status/STATE.md
7. docs/status/TODO.md
8. docs/status/DECISIONS.md
9. docs/status/RISKS.md
10. docs/tasks/active/CURRENT_TASK.md

请按 harness 规则工作：
- 先识别当前 phase、当前 task、当前 deliverables
- 如需先计划则先计划
- 如果执行策略允许自动继续，则完成当前任务后自动进入下一任务
- 所有正式结果写入 docs/outputs/
- 所有状态更新写入 docs/status/
- 除非命中 interruption policy，否则不要中途停下来等我
```

## 目录结构

```text
docs/
  context/     长期稳定的产品上下文
  harness/     代理执行规则
  outputs/     正式产出物
  runbooks/    任务型 SOP / skills
  status/      持久化状态
  tasks/       backlog / active / completed
```

## 当前工程验证

```bash
npm run build
npm run typecheck
```

`typecheck` 是 harness 基础设施新增的命令，用于在没有完整测试体系前提供最低限度的结构校验。
