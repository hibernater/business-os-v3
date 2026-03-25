"use client";

import { useDroppable } from "@dnd-kit/core";
import { WorkZone as WorkZoneType, Agent, Workflow } from "@/types";
import AgentCharacter from "./AgentCharacter";
import WorkflowBar from "./WorkflowBar";

interface WorkZoneProps {
  zone: WorkZoneType;
  agents: Agent[];
  workflows: Workflow[];
  allAgents: Agent[];
  index: number;
}

export default function WorkZone({
  zone,
  agents,
  workflows,
  allAgents,
  index,
}: WorkZoneProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: zone.id,
  });

  const runningCount = workflows.filter((w) => w.status === "running").length;
  const queuedCount = workflows.filter((w) => w.status === "queued").length;
  const idleCount = Math.max(agents.length - runningCount, 0);

  return (
    <div
      ref={setNodeRef}
      className={`work-zone card-base p-4 animate-entrance ${isOver ? "drag-over" : ""}`}
      style={
        {
          "--zone-color": zone.color,
          animationDelay: `${index * 0.06}s`,
        } as React.CSSProperties
      }
    >
      {/* Zone Header */}
      <div className="relative z-10 flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
            style={{
              background: `color-mix(in srgb, ${zone.color} 12%, transparent)`,
            }}
          >
            {zone.icon}
          </div>
          <div>
            <h3 className="text-[13px] font-semibold theme-text-primary leading-tight">
              {zone.name}
            </h3>
            <p className="text-[10px] theme-text-secondary leading-tight">
              {zone.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {runningCount > 0 && (
            <span
              className="text-[10px] font-mono px-1.5 py-0.5 rounded-md"
              style={{
                color: zone.color,
                background: `color-mix(in srgb, ${zone.color} 10%, transparent)`,
              }}
            >
              {runningCount} 运行
            </span>
          )}
          {idleCount > 0 && (
            <span
              className="text-[10px] font-mono px-1.5 py-0.5 rounded-md"
              style={{
                color: "#94a3b8",
                background: "rgba(148,163,184,0.08)",
              }}
            >
              {idleCount} 待命
            </span>
          )}
          {queuedCount > 0 && (
            <span className="text-[10px] font-mono theme-pill px-1.5 py-0.5 rounded-md">
              {queuedCount} 等待
            </span>
          )}
        </div>
      </div>

      {/* Agent Row */}
      <div className="relative z-10 mb-3">
        {agents.length > 0 ? (
          <div className="flex gap-0.5 flex-wrap">
            {agents.map((agent) => {
              const wf =
                workflows.find(
                  (w) =>
                    w.assignedAgentId === agent.id && w.status === "running",
                ) || null;
              return (
                <AgentCharacter
                  key={agent.id}
                  agent={agent}
                  workflow={wf}
                  compact
                  statusLabel={wf ? "执行中" : "驻场待命"}
                />
              );
            })}
          </div>
        ) : (
          <div
            className="flex items-center justify-center h-20 border-2 border-dashed rounded-2xl text-xs transition-colors duration-300"
            style={{
              borderColor: isOver
                ? `color-mix(in srgb, ${zone.color} 40%, transparent)`
                : "var(--border-soft)",
              color: isOver ? zone.color : "var(--text-tertiary)",
              background: isOver
                ? `color-mix(in srgb, ${zone.color} 4%, transparent)`
                : "transparent",
            }}
          >
            {isOver ? "松开鼠标派驻到此责任区" : "拖拽掌柜到此责任区驻场"}
          </div>
        )}
      </div>

      {/* Workflow List */}
      {workflows.length > 0 && (
        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center gap-1.5 mb-1">
            <div
              className="w-1 h-3 rounded-full"
              style={{ backgroundColor: zone.color, opacity: 0.5 }}
            />
            <span className="text-[10px] theme-text-secondary font-medium uppercase tracking-wider">
              工作流
            </span>
          </div>
          {workflows.map((wf) => {
            const assignedAgent = wf.assignedAgentId
              ? allAgents.find((a) => a.id === wf.assignedAgentId) || null
              : null;
            return (
              <WorkflowBar
                key={wf.id}
                workflow={wf}
                agent={assignedAgent}
                zoneColor={zone.color}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
