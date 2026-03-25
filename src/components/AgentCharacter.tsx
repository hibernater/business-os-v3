"use client";

import { useDraggable } from "@dnd-kit/core";
import { Agent, Workflow } from "@/types";

interface AgentCharacterProps {
  agent: Agent;
  workflow: Workflow | null;
  compact?: boolean;
  statusLabel?: string;
}

export default function AgentCharacter({
  agent,
  workflow,
  compact,
  statusLabel,
}: AgentCharacterProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: agent.id,
  });

  const isWorking = !!workflow && workflow.status === "running";
  const size = compact ? "w-12 h-12 text-xl" : "w-14 h-14 text-2xl";

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`agent-character flex flex-col items-center gap-1 p-2 rounded-2xl cursor-grab active:cursor-grabbing transition-all duration-300 theme-soft-surface ${isDragging ? "is-dragging" : ""}`}
      style={
        { "--agent-color": agent.color } as React.CSSProperties
      }
    >
      <div className="relative">
        {isWorking && (
          <>
            <div className="working-ripple" />
            <div
              className="absolute -inset-2.5 rounded-full animate-orbit"
              style={{
                background: `conic-gradient(from 0deg, transparent 0%, ${agent.color}40 25%, transparent 50%)`,
              }}
            />
          </>
        )}
        <div
          className={`relative ${size} rounded-2xl flex items-center justify-center transition-transform duration-300 hover:scale-110 ${!isWorking ? "animate-float" : ""}`}
          style={{
            background: `linear-gradient(135deg, color-mix(in srgb, ${agent.color} 20%, var(--bg-elevated)), color-mix(in srgb, ${agent.color} 8%, var(--bg-elevated-strong)))`,
            boxShadow: isWorking
              ? `0 4px 24px color-mix(in srgb, ${agent.color} 18%, transparent)`
              : `0 4px 16px color-mix(in srgb, ${agent.color} 10%, transparent)`,
            animationDelay: `${(agent.level * 0.27) % 2}s`,
          }}
        >
          {agent.avatar}
        </div>
      </div>

      <span className="text-[11px] font-medium theme-text-primary mt-0.5 leading-none">
        {agent.name}
      </span>
      <span
        className="text-[9px] font-mono font-semibold leading-none"
        style={{ color: agent.color }}
      >
        Lv.{agent.level}
      </span>

      {statusLabel && (
        <span
          className="text-[9px] px-1.5 py-0.5 rounded-full leading-none font-medium"
          style={{
            color: agent.color,
            background: `color-mix(in srgb, ${agent.color} 10%, transparent)`,
          }}
        >
          {statusLabel}
        </span>
      )}

      {isWorking && workflow && (
        <div
          className="flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full mt-0.5"
          style={{
            background: `color-mix(in srgb, ${agent.color} 12%, transparent)`,
            color: agent.color,
          }}
        >
          <span>{workflow.skillIcon}</span>
          <span className="font-mono font-bold">
            {Math.round(workflow.progress)}%
          </span>
        </div>
      )}
    </div>
  );
}

export function AgentDragOverlay({ agent }: { agent: Agent }) {
  return (
    <div className="drag-overlay flex flex-col items-center gap-1 p-3 rounded-2xl card-base">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl animate-pulse-glow"
        style={{
          background: `linear-gradient(135deg, color-mix(in srgb, ${agent.color} 25%, var(--bg-elevated)), color-mix(in srgb, ${agent.color} 12%, var(--bg-elevated-strong)))`,
          boxShadow: `0 8px 32px color-mix(in srgb, ${agent.color} 25%, transparent)`,
        }}
      >
        {agent.avatar}
      </div>
      <span className="text-xs font-semibold theme-text-primary">{agent.name}</span>
      <span
        className="text-[10px] font-mono"
        style={{ color: agent.color }}
      >
        Lv.{agent.level}
      </span>
    </div>
  );
}
