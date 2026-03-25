import { Workflow, Agent } from "@/types";

interface WorkflowBarProps {
  workflow: Workflow;
  agent: Agent | null;
  zoneColor: string;
}

const PRIORITY_COLORS: Record<string, string> = {
  high: "#ef4444",
  normal: "#64748b",
  low: "#475569",
};

export default function WorkflowBar({
  workflow,
  agent,
  zoneColor,
}: WorkflowBarProps) {
  return (
    <div className="flex items-center gap-2.5 p-2.5 rounded-xl theme-soft-surface transition-colors">
      <span
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${workflow.priority === "high" ? "animate-pulse" : ""}`}
        style={{ backgroundColor: PRIORITY_COLORS[workflow.priority] }}
      />

      <span className="text-sm flex-shrink-0">{workflow.skillIcon}</span>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className="text-[12px] theme-text-primary truncate">
            {workflow.name}
          </span>
          {workflow.status === "running" && (
            <span
              className="text-[10px] font-mono font-semibold flex-shrink-0"
              style={{ color: zoneColor }}
            >
              {Math.round(workflow.progress)}%
            </span>
          )}
        </div>

        {workflow.status === "running" ? (
          <div className="h-1 rounded-full overflow-hidden theme-soft-surface">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${workflow.progress}%`,
                backgroundColor: zoneColor,
              }}
            />
          </div>
        ) : workflow.status === "queued" ? (
          <span className="text-[10px] theme-text-tertiary leading-none">
            等待本区接手
          </span>
        ) : (
          <span className="text-[10px] text-emerald-400/80 leading-none">
            ✓ 已完成
          </span>
        )}
      </div>

      {agent ? (
        <span className="text-sm flex-shrink-0" title={agent.name}>
          {agent.avatar}
        </span>
      ) : workflow.status === "queued" ? (
        <span className="text-[10px] theme-text-tertiary flex-shrink-0">
          待值守
        </span>
      ) : null}
    </div>
  );
}
