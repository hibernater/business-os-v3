"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { agents } from "@/data/agents";
import {
  createDemoWorkflow,
  initialZones,
  initialWorkflows as seedWorkflows,
  trimCompletedWorkflows,
} from "@/data/workflows";
import { Workflow, WorkflowPriority } from "@/types";
import Header from "@/components/Header";

const PRIORITY_LABELS: Record<string, { label: string; color: string }> = {
  high: { label: "紧急", color: "#ef4444" },
  normal: { label: "普通", color: "#64748b" },
  low: { label: "低", color: "#475569" },
};

const STATUS_LABELS: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  running: {
    label: "运行中",
    color: "#10b981",
    bg: "rgba(16,185,129,0.08)",
  },
  queued: {
    label: "待接手",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
  },
  completed: {
    label: "已完成",
    color: "#64748b",
    bg: "rgba(100,116,139,0.08)",
  },
};

const DEMO_QUEUE_BUFFER = 2;

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>(seedWorkflows);
  const [statusFilter, setStatusFilter] = useState("all");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const workflowsRef = useRef(workflows);

  useEffect(() => {
    workflowsRef.current = workflows;
  }, [workflows]);

  // Simulate running workflow progress
  useEffect(() => {
    const interval = setInterval(() => {
      const current = workflowsRef.current;
      let changed = false;
      let updated = current.map((wf) => {
        if (wf.status !== "running" || !wf.assignedAgentId) return wf;
        changed = true;
        const newProgress = Math.min(wf.progress + Math.random() * 3 + 0.5, 100);
        if (newProgress >= 100) {
          return {
            ...wf,
            status: "completed" as const,
            progress: 100,
            assignedAgentId: null,
          };
        }
        return { ...wf, progress: newProgress };
      });

      for (const zone of initialZones) {
        let activeCount = updated.filter(
          (workflow) =>
            workflow.zoneId === zone.id && workflow.status !== "completed",
        ).length;
        const desiredCount = Math.max(
          zone.agentIds.length > 0 ? 3 : 2,
          zone.agentIds.length + DEMO_QUEUE_BUFFER,
        );

        while (activeCount < desiredCount) {
          const workflow = createDemoWorkflow(zone.id, updated);
          if (!workflow) break;
          updated = [...updated, workflow];
          activeCount += 1;
          changed = true;
        }
      }

      updated = trimCompletedWorkflows(updated);

      for (const zone of initialZones) {
        const busyAgents = new Set(
          updated
            .filter(
              (workflow) =>
                workflow.zoneId === zone.id &&
                workflow.status === "running" &&
                workflow.assignedAgentId,
            )
            .map((workflow) => workflow.assignedAgentId as string),
        );
        const idleAgents = zone.agentIds.filter((agentId) => !busyAgents.has(agentId));
        const queuedWorkflows = updated.filter(
          (workflow) =>
            workflow.zoneId === zone.id &&
            workflow.status === "queued" &&
            !workflow.assignedAgentId,
        );

        for (const agentId of idleAgents) {
          const nextWorkflow = queuedWorkflows.shift();
          if (!nextWorkflow) break;

          updated = updated.map((workflow) =>
            workflow.id === nextWorkflow.id
              ? {
                  ...workflow,
                  status: "running" as const,
                  assignedAgentId: agentId,
                }
              : workflow,
          );
          changed = true;
        }
      }

      if (changed) {
        setWorkflows(updated);
        workflowsRef.current = updated;
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const filtered = useMemo(() => {
    let result = workflows;
    if (statusFilter !== "all")
      result = result.filter((w) => w.status === statusFilter);
    if (zoneFilter !== "all")
      result = result.filter((w) => w.zoneId === zoneFilter);
    return result;
  }, [workflows, statusFilter, zoneFilter]);

  const counts = useMemo(
    () => ({
      all: workflows.length,
      running: workflows.filter((w) => w.status === "running").length,
      queued: workflows.filter((w) => w.status === "queued").length,
      completed: workflows.filter((w) => w.status === "completed").length,
    }),
    [workflows],
  );

  const handleCreate = (data: {
    name: string;
    zoneId: string;
    priority: WorkflowPriority;
    skillIcon: string;
  }) => {
    setWorkflows((prev) => [
      ...prev,
      {
        id: `wf-${Date.now()}`,
        name: data.name,
        zoneId: data.zoneId,
        status: "queued" as const,
        progress: 0,
        assignedAgentId: null,
        priority: data.priority,
        skillIcon: data.skillIcon || "📋",
      },
    ]);
    setShowCreate(false);
  };

  return (
    <div className="app-shell bg-grid-pattern">
      <div className="fixed inset-0 bg-gradient-radial pointer-events-none" />
      <div className="relative z-10">
        <Header />
        <main className="max-w-[1600px] mx-auto px-6 py-6">
          {/* Page Header */}
          <div className="flex items-start justify-between mb-6 animate-entrance">
            <div>
              <h2 className="text-xl font-display font-bold theme-text-primary mb-1">
                工作流管理
              </h2>
              <p className="theme-text-secondary text-xs">
                监控各责任区的任务队列，创建新的工作流并交给对应责任区值守
              </p>
            </div>
            <button
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 hover:border-cyan-500/30 transition-all cursor-pointer flex-shrink-0"
              onClick={() => setShowCreate(true)}
            >
              + 新建工作流
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 stagger-children">
            <div className="card-base p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] text-slate-500">运行中</span>
              </div>
              <div className="text-2xl font-mono font-bold text-white">
                {counts.running}
              </div>
            </div>
            <div className="card-base p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-[11px] text-slate-500">待本区接手</span>
              </div>
              <div className="text-2xl font-mono font-bold text-white">
                {counts.queued}
              </div>
            </div>
            <div className="card-base p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-slate-500" />
                <span className="text-[11px] text-slate-500">已完成</span>
              </div>
              <div className="text-2xl font-mono font-bold text-white">
                {counts.completed}
              </div>
            </div>
            <div className="card-base p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] text-slate-500">工作流总数</span>
              </div>
              <div className="text-2xl font-mono font-bold text-white">
                {counts.all}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 animate-entrance" style={{ animationDelay: "0.1s" }}>
            <div className="flex gap-1">
              {(
                [
                  { key: "all", label: "全部" },
                  { key: "running", label: "运行中" },
                  { key: "queued", label: "待接手" },
                  { key: "completed", label: "已完成" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    statusFilter === tab.key
                      ? "bg-cyan-500/10 text-cyan-400"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                  onClick={() => setStatusFilter(tab.key)}
                >
                  {tab.label} (
                  {tab.key === "all"
                    ? counts.all
                    : counts[tab.key as keyof typeof counts]}
                  )
                </button>
              ))}
            </div>

            <div className="flex gap-1 flex-wrap">
              <button
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  zoneFilter === "all"
                    ? "bg-white/[0.08] text-white"
                    : "text-slate-500 hover:text-white hover:bg-white/5"
                }`}
                onClick={() => setZoneFilter("all")}
              >
                全部责任区
              </button>
              {initialZones.map((zone) => (
                <button
                  key={zone.id}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
                    zoneFilter === zone.id
                      ? "text-white"
                      : "text-slate-500 hover:text-white hover:bg-white/5"
                  }`}
                  style={
                    zoneFilter === zone.id
                      ? {
                          backgroundColor: `color-mix(in srgb, ${zone.color} 12%, transparent)`,
                          color: zone.color,
                        }
                      : undefined
                  }
                  onClick={() => setZoneFilter(zone.id)}
                >
                  <span>{zone.icon}</span> {zone.name}
                </button>
              ))}
            </div>
          </div>

          {/* Workflow List */}
          <div className="space-y-2">
            {filtered.map((wf, i) => {
              const zone = initialZones.find((z) => z.id === wf.zoneId);
              const agent = wf.assignedAgentId
                ? agents.find((a) => a.id === wf.assignedAgentId)
                : null;
              const status = STATUS_LABELS[wf.status];
              const priority = PRIORITY_LABELS[wf.priority];

              return (
                <div
                  key={wf.id}
                  className="card-base p-4 flex items-center gap-4 animate-entrance"
                  style={{
                    animationDelay: `${0.05 + i * 0.025}s`,
                    borderLeftWidth: 3,
                    borderLeftColor: zone?.color || "transparent",
                  }}
                >
                  {/* Priority */}
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${wf.priority === "high" ? "animate-pulse" : ""}`}
                    style={{ backgroundColor: priority.color }}
                    title={priority.label}
                  />

                  {/* Icon */}
                  <span className="text-lg flex-shrink-0">{wf.skillIcon}</span>

                  {/* Name & Zone */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">
                      {wf.name}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {zone && (
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded-md font-mono"
                          style={{
                            backgroundColor: `color-mix(in srgb, ${zone.color} 10%, transparent)`,
                            color: zone.color,
                          }}
                        >
                          {zone.icon} {zone.name}
                        </span>
                      )}
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded-md"
                        style={{
                          backgroundColor: priority.color + "15",
                          color: priority.color,
                        }}
                      >
                        {priority.label}
                      </span>
                    </div>
                  </div>

                  {/* Progress (running only) */}
                  {wf.status === "running" && (
                    <div className="w-32 flex-shrink-0 hidden sm:block">
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="text-slate-500">进度</span>
                        <span
                          className="font-mono font-semibold"
                          style={{ color: zone?.color }}
                        >
                          {Math.round(wf.progress)}%
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${wf.progress}%`,
                            backgroundColor: zone?.color,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Agent */}
                  <div className="w-20 flex-shrink-0 text-center hidden md:block">
                    {agent ? (
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="text-lg">{agent.avatar}</span>
                        <span
                          className="text-[10px]"
                          style={{ color: agent.color }}
                        >
                          {agent.name}
                        </span>
                      </div>
                    ) : wf.status === "completed" ? (
                      <span className="text-[11px] text-slate-600">
                        已归档
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-600">
                        等待值守
                      </span>
                    )}
                  </div>

                  {/* Status */}
                  <span
                    className="text-[11px] font-medium px-2.5 py-1 rounded-lg flex-shrink-0"
                    style={{
                      backgroundColor: status.bg,
                      color: status.color,
                    }}
                  >
                    {wf.status === "running" && (
                      <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse" style={{ backgroundColor: status.color }} />
                    )}
                    {status.label}
                  </span>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-slate-600 text-sm">
              没有匹配的工作流
            </div>
          )}
        </main>
      </div>

      {showCreate && (
        <CreateWorkflowModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}

function CreateWorkflowModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (data: {
    name: string;
    zoneId: string;
    priority: WorkflowPriority;
    skillIcon: string;
  }) => void;
}) {
  const [form, setForm] = useState({
    name: "",
    zoneId: initialZones[0].id,
    priority: "normal" as WorkflowPriority,
    skillIcon: "",
  });

  const update = (key: string, value: string) =>
    setForm((p) => ({ ...p, [key]: value }));

  const canSubmit = form.name.trim().length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      <div
        className="relative w-full max-w-lg card-base p-6 modal-content border-t-2 border-cyan-500/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">新建工作流</h2>
          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all text-lg cursor-pointer"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-[80px_1fr] gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1.5">
                图标
              </label>
              <input
                type="text"
                placeholder="📋"
                maxLength={4}
                value={form.skillIcon}
                onChange={(e) => update("skillIcon", e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xl text-center text-white placeholder-slate-600 outline-none focus:border-cyan-500/30 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1.5">
                工作流名称 *
              </label>
              <input
                type="text"
                placeholder="如：新客户询盘处理"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder-slate-600 outline-none focus:border-cyan-500/30 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1.5">
              所属责任区
            </label>
            <div className="flex flex-wrap gap-2">
              {initialZones.map((zone) => (
                <button
                  key={zone.id}
                  type="button"
                  className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all border cursor-pointer ${
                    form.zoneId === zone.id
                      ? "text-white"
                      : "border-white/[0.05] bg-white/[0.02] text-slate-400 hover:bg-white/[0.05]"
                  }`}
                  style={
                    form.zoneId === zone.id
                      ? {
                          borderColor: `color-mix(in srgb, ${zone.color} 35%, transparent)`,
                          backgroundColor: `color-mix(in srgb, ${zone.color} 10%, transparent)`,
                          color: zone.color,
                        }
                      : undefined
                  }
                  onClick={() => update("zoneId", zone.id)}
                >
                  <span>{zone.icon}</span> {zone.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1.5">
              优先级
            </label>
            <div className="flex gap-2">
              {(
                [
                  { key: "high", label: "紧急", color: "#ef4444" },
                  { key: "normal", label: "普通", color: "#f59e0b" },
                  { key: "low", label: "低优先", color: "#64748b" },
                ] as const
              ).map((p) => (
                <button
                  key={p.key}
                  type="button"
                  className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all border cursor-pointer ${
                    form.priority === p.key
                      ? "text-white"
                      : "border-white/[0.05] bg-white/[0.02] text-slate-400 hover:bg-white/[0.05]"
                  }`}
                  style={
                    form.priority === p.key
                      ? {
                          borderColor: p.color + "40",
                          backgroundColor: p.color + "15",
                          color: p.color,
                        }
                      : undefined
                  }
                  onClick={() => update("priority", p.key)}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: p.color }}
                  />
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            disabled={!canSubmit}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/25 hover:bg-cyan-500/25 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            onClick={() => canSubmit && onCreate(form)}
          >
            创建工作流
          </button>
          <button
            className="px-6 py-2.5 rounded-xl text-sm text-slate-400 border border-white/[0.06] hover:text-white hover:bg-white/[0.03] transition-all cursor-pointer"
            onClick={onClose}
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}
