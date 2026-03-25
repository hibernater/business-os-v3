"use client";

import { useDroppable } from "@dnd-kit/core";
import { Agent } from "@/types";
import AgentCharacter from "./AgentCharacter";

interface AgentPoolProps {
  agents: Agent[];
}

export default function AgentPool({ agents }: AgentPoolProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: "pool",
  });

  return (
    <div
      ref={setNodeRef}
      className={`agent-pool fixed bottom-0 left-0 right-0 z-40 ${isOver ? "drag-over" : ""}`}
    >
      <div className="max-w-[1600px] mx-auto px-6 py-2.5 flex items-center gap-4">
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <span className="text-lg">🏠</span>
          <div>
            <span className="text-sm font-semibold theme-text-primary leading-none block">
              调度中心
            </span>
            <span className="text-[10px] theme-text-tertiary leading-none block mt-0.5">
              未部署掌柜，从这里派驻到责任区
            </span>
          </div>
          <span className="text-[11px] font-mono theme-pill px-2 py-0.5 rounded-full ml-1">
            {agents.length}
          </span>
        </div>

        <div className="h-10 w-px theme-divider flex-shrink-0" />

        <div className="flex gap-1 overflow-x-auto py-1 flex-1 min-w-0">
          {agents.length > 0 ? (
            agents.map((agent) => (
              <AgentCharacter
                key={agent.id}
                agent={agent}
                workflow={null}
                statusLabel="待派驻"
              />
            ))
          ) : (
            <div className="flex items-center h-16 text-xs theme-text-tertiary">
              当前所有掌柜都已驻场值守
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
