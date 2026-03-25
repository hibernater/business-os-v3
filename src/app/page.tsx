"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { Agent, Activity, WorkZone as WorkZoneType, Workflow } from "@/types";
import { agents as initialAgents, initialActivities } from "@/data/agents";
import {
  createDemoWorkflow,
  initialZones,
  initialWorkflows,
  trimCompletedWorkflows,
} from "@/data/workflows";
import Header from "@/components/Header";
import WorkZone from "@/components/WorkZone";
import AgentPool from "@/components/AgentPool";
import ActivityFeed from "@/components/ActivityFeed";
import { AgentDragOverlay } from "@/components/AgentCharacter";

const STATS = [
  { label: "今日营收", value: "¥128,560", icon: "💰" },
  { label: "待处理订单", value: "23", icon: "📋" },
  { label: "执行中", value: "7", icon: "⚡" },
  { label: "团队效率", value: "94.8%", icon: "📊" },
];

const DEMO_QUEUE_BUFFER = 2;

export default function Dashboard() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [zones, setZones] = useState<WorkZoneType[]>(initialZones);
  const [workflows, setWorkflows] = useState<Workflow[]>(initialWorkflows);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [activeAgent, setActiveAgent] = useState<Agent | null>(null);

  const agentsRef = useRef(agents);
  const zonesRef = useRef(zones);
  const workflowsRef = useRef(workflows);

  useEffect(() => {
    agentsRef.current = agents;
  }, [agents]);
  useEffect(() => {
    zonesRef.current = zones;
  }, [zones]);
  useEffect(() => {
    workflowsRef.current = workflows;
  }, [workflows]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  // ── Workflow progression timer ──
  useEffect(() => {
    const interval = setInterval(() => {
      const currentWorkflows = workflowsRef.current;
      const currentAgents = agentsRef.current;
      const currentZones = zonesRef.current;
      const newActivities: Activity[] = [];
      const completedByAgent: Record<string, number> = {};
      const completedRecords: Array<{
        agentId: string;
        workflowName: string;
        zoneName: string;
      }> = [];

      let updated = currentWorkflows.map((wf) => {
        if (wf.status !== "running" || !wf.assignedAgentId) return wf;

        const increment = Math.random() * 4 + 1.5;
        const newProgress = Math.min(wf.progress + increment, 100);

        if (newProgress >= 100) {
          const agent = currentAgents.find(
            (a) => a.id === wf.assignedAgentId,
          );
          const zone = currentZones.find((z) => z.id === wf.zoneId);
          if (agent) {
            newActivities.push({
              id: `${Date.now()}-${wf.id}-done`,
              agentId: agent.id,
              agentName: agent.name,
              agentAvatar: agent.avatar,
              agentColor: agent.color,
              message: zone
                ? `完成了「${wf.name}」，继续在「${zone.name}」值守`
                : `完成了「${wf.name}」`,
              time: "刚刚",
              type: "success",
            });
          }

          completedByAgent[wf.assignedAgentId] =
            (completedByAgent[wf.assignedAgentId] ?? 0) + 1;
          if (zone) {
            completedRecords.push({
              agentId: wf.assignedAgentId,
              workflowName: wf.name,
              zoneName: zone.name,
            });
          }

          return {
            ...wf,
            status: "completed" as const,
            progress: 100,
            assignedAgentId: null,
          };
        }

        return { ...wf, progress: newProgress };
      });

      if (Object.keys(completedByAgent).length > 0) {
        setAgents((prev) =>
          prev.map((agent) => {
            const completedCount = completedByAgent[agent.id] ?? 0;
            if (completedCount === 0) return agent;

            return {
              ...agent,
              stats: {
                ...agent.stats,
                tasksCompleted: agent.stats.tasksCompleted + completedCount,
              },
              xp: Math.min(agent.xp + completedCount * 25, agent.maxXp),
            };
          }),
        );
      }

      for (const zone of currentZones) {
        const activeCount = updated.filter(
          (workflow) =>
            workflow.zoneId === zone.id && workflow.status !== "completed",
        ).length;
        const desiredCount = Math.max(
          zone.agentIds.length > 0 ? 3 : 2,
          zone.agentIds.length + DEMO_QUEUE_BUFFER,
        );

        let addedCount = 0;
        while (activeCount + addedCount < desiredCount) {
          const workflow = createDemoWorkflow(zone.id, updated);
          if (!workflow) break;
          updated = [...updated, workflow];
          addedCount += 1;
        }

        if (addedCount > 0) {
          const dispatcher =
            currentAgents.find((agent) => agent.id === "ops") ||
            currentAgents.find((agent) => zone.agentIds.includes(agent.id));

          if (dispatcher) {
            newActivities.push({
              id: `${Date.now()}-${zone.id}-refill`,
              agentId: dispatcher.id,
              agentName: dispatcher.name,
              agentAvatar: dispatcher.avatar,
              agentColor: dispatcher.color,
              message: `「${zone.name}」补入 ${addedCount} 条新任务，队列已自动续上`,
              time: "刚刚",
              type: "info",
            });
          }
        }
      }

      updated = trimCompletedWorkflows(updated);

      const startedAgents = new Set<string>();
      for (const zone of currentZones) {
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
                  assignedAgentId: agentId,
                  status: "running" as const,
                }
              : workflow,
          );

          startedAgents.add(agentId);

          const agent = currentAgents.find((item) => item.id === agentId);
          if (agent) {
            newActivities.push({
              id: `${Date.now()}-${nextWorkflow.id}-start`,
              agentId: agent.id,
              agentName: agent.name,
              agentAvatar: agent.avatar,
              agentColor: agent.color,
              message: `在「${zone.name}」开始处理「${nextWorkflow.name}」`,
              time: "刚刚",
              type: "info",
            });
          }
        }
      }

      for (const record of completedRecords) {
        if (startedAgents.has(record.agentId)) continue;

        const agent = currentAgents.find((item) => item.id === record.agentId);
        if (!agent) continue;

        newActivities.push({
          id: `${Date.now()}-${record.agentId}-idle`,
          agentId: agent.id,
          agentName: agent.name,
          agentAvatar: agent.avatar,
          agentColor: agent.color,
          message: `完成「${record.workflowName}」后，继续在「${record.zoneName}」待命值守`,
          time: "刚刚",
          type: "info",
        });
      }

      setWorkflows(updated);
      workflowsRef.current = updated;

      if (newActivities.length > 0) {
        setActivities((prev) =>
          [...newActivities, ...prev].slice(0, 20),
        );
      }
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // ── Drag handlers ──
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const agent = agentsRef.current.find(
        (a) => a.id === event.active.id,
      );
      setActiveAgent(agent || null);
    },
    [],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveAgent(null);
      const { active, over } = event;
      if (!over) return;

      const agentId = active.id as string;
      const targetId = over.id as string;

      const currentZones = zonesRef.current;
      const sourceZone = currentZones.find((z) =>
        z.agentIds.includes(agentId),
      );
      const sourceId = sourceZone?.id || "pool";

      if (sourceId === targetId) return;

      // Check capacity for zone targets
      if (targetId !== "pool") {
        const target = currentZones.find((z) => z.id === targetId);
        if (!target) return;
        const currentCount = target.agentIds.filter(
          (id) => id !== agentId,
        ).length;
        if (currentCount >= target.capacity) return;
      }

      // Unassign running workflows from this agent
      let updatedWorkflows = workflowsRef.current.map((w) =>
        w.assignedAgentId === agentId && w.status === "running"
          ? {
              ...w,
              assignedAgentId: null,
              status: "queued" as const,
              progress: 0,
            }
          : w.assignedAgentId === agentId
            ? { ...w, assignedAgentId: null }
            : w,
      );

      // Update zones: remove from all, add to target
      const updatedZones = currentZones.map((z) => {
        const filtered = z.agentIds.filter((id) => id !== agentId);
        if (z.id === targetId) {
          return { ...z, agentIds: [...filtered, agentId] };
        }
        return { ...z, agentIds: filtered };
      });

      // Auto-assign queued workflow in target zone
      if (targetId !== "pool") {
        const queued = updatedWorkflows.find(
          (w) =>
            w.zoneId === targetId &&
            w.status === "queued" &&
            !w.assignedAgentId,
        );
        if (queued) {
          updatedWorkflows = updatedWorkflows.map((w) =>
            w.id === queued.id
              ? {
                  ...w,
                  assignedAgentId: agentId,
                  status: "running" as const,
                }
              : w,
          );

          const agent = agentsRef.current.find(
            (a) => a.id === agentId,
          );
          const zone = updatedZones.find((z) => z.id === targetId);
          if (agent && zone) {
            setActivities((prev) =>
              [
                {
                  id: `${Date.now()}-${agentId}-deploy`,
                  agentId: agent.id,
                  agentName: agent.name,
                  agentAvatar: agent.avatar,
                  agentColor: agent.color,
                  message: `派驻到「${zone.name}」，开始接手「${queued.name}」`,
                  time: "刚刚",
                  type: "info" as const,
                },
                ...prev,
              ].slice(0, 20),
            );
          }
        } else {
          const agent = agentsRef.current.find(
            (a) => a.id === agentId,
          );
          const zone = updatedZones.find((z) => z.id === targetId);
          if (agent && zone) {
            setActivities((prev) =>
              [
                {
                  id: `${Date.now()}-${agentId}-move`,
                  agentId: agent.id,
                  agentName: agent.name,
                  agentAvatar: agent.avatar,
                  agentColor: agent.color,
                  message: `派驻到「${zone.name}」值守待命`,
                  time: "刚刚",
                  type: "info" as const,
                },
                ...prev,
              ].slice(0, 20),
            );
          }
        }
      } else {
        const agent = agentsRef.current.find((a) => a.id === agentId);
        if (agent) {
          setActivities((prev) =>
            [
              {
                id: `${Date.now()}-${agentId}-recall`,
                agentId: agent.id,
                agentName: agent.name,
                agentAvatar: agent.avatar,
                agentColor: agent.color,
                message: "已撤回调度中心，等待重新派驻",
                time: "刚刚",
                type: "info" as const,
              },
              ...prev,
            ].slice(0, 20),
          );
        }
      }

      setZones(updatedZones);
      zonesRef.current = updatedZones;
      setWorkflows(updatedWorkflows);
      workflowsRef.current = updatedWorkflows;
    },
    [],
  );

  // ── Derived state ──
  const zoneAgentIds = new Set(zones.flatMap((z) => z.agentIds));
  const poolAgents = agents.filter((a) => !zoneAgentIds.has(a.id));
  const workingCount = workflows.filter(
    (w) => w.status === "running",
  ).length;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="app-shell bg-grid-pattern pb-28">
        <div className="fixed inset-0 bg-gradient-radial pointer-events-none" />

        <div className="relative z-10">
          <Header />

          <main className="max-w-[1600px] mx-auto px-6 py-5">
            {/* Welcome + Compact Stats */}
            <div className="flex items-center justify-between mb-6 animate-entrance">
              <div>
                <h2 className="text-xl font-display font-bold theme-text-primary mb-0.5">
                  工作台
                </h2>
                <p className="theme-text-secondary text-xs">
                  拖拽掌柜到责任区驻场，让他们持续承接本区工作流
                </p>
              </div>
              <div className="hidden md:flex items-center gap-5">
                {STATS.map((stat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-base">{stat.icon}</span>
                    <div>
                      <div className="text-sm font-mono font-bold theme-text-primary leading-none">
                        {stat.value}
                      </div>
                      <div className="text-[10px] theme-text-secondary leading-none mt-0.5">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Running indicator */}
            <div className="flex items-center gap-3 mb-5 animate-entrance" style={{ animationDelay: "0.05s" }}>
              <div className="flex items-center gap-2 text-xs theme-text-secondary">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span>
                  <span className="theme-text-primary font-mono font-semibold">
                    {workingCount}
                  </span>{" "}
                  个工作流运行中
                </span>
              </div>
              <div className="h-3 w-px bg-slate-700/40" />
              <span className="text-xs theme-text-secondary">
                <span className="theme-text-primary font-mono font-semibold">
                  {zones.reduce((n, z) => n + z.agentIds.length, 0)}
                </span>
                /{agents.length} 位掌柜已驻场
              </span>
            </div>

            {/* Main Content */}
            <div className="flex gap-5 items-start">
              {/* Zone Grid */}
              <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {zones.map((zone, i) => {
                  const zoneAgents = agents.filter((a) =>
                    zone.agentIds.includes(a.id),
                  );
                  const zoneWorkflows = workflows.filter(
                    (w) =>
                      w.zoneId === zone.id && w.status !== "completed",
                  );
                  return (
                    <WorkZone
                      key={zone.id}
                      zone={zone}
                      agents={zoneAgents}
                      workflows={zoneWorkflows}
                      allAgents={agents}
                      index={i}
                    />
                  );
                })}
              </div>

              {/* Activity Feed */}
              <div className="hidden lg:block w-[340px] flex-shrink-0">
                <ActivityFeed activities={activities} />
              </div>
            </div>
          </main>
        </div>

        {/* Agent Pool */}
        <AgentPool agents={poolAgents} />

        {/* Drag Overlay */}
        <DragOverlay dropAnimation={null}>
          {activeAgent ? (
            <AgentDragOverlay agent={activeAgent} />
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
