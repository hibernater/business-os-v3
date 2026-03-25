"use client";

import { useState, useMemo } from "react";
import { agents } from "@/data/agents";
import Header from "@/components/Header";

interface SkillEntry {
  id: string;
  icon: string;
  name: string;
  description: string;
  duration: string;
  agentId: string;
  agentName: string;
  agentAvatar: string;
  agentColor: string;
  agentRole: string;
}

function deriveSkills(): SkillEntry[] {
  const entries: SkillEntry[] = [];
  for (const agent of agents) {
    for (const skill of agent.skills) {
      entries.push({
        ...skill,
        agentId: agent.id,
        agentName: agent.name,
        agentAvatar: agent.avatar,
        agentColor: agent.color,
        agentRole: agent.role,
      });
    }
  }
  return entries;
}

export default function SkillsPage() {
  const [customSkills, setCustomSkills] = useState<SkillEntry[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);

  const allSkills = useMemo(
    () => [...deriveSkills(), ...customSkills],
    [customSkills],
  );

  const filtered = useMemo(() => {
    let result = allSkills;
    if (filter !== "all") result = result.filter((s) => s.agentId === filter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q),
      );
    }
    return result;
  }, [allSkills, filter, search]);

  const handleCreate = (data: {
    icon: string;
    name: string;
    description: string;
    duration: string;
    agentId: string;
  }) => {
    const agent = agents.find((a) => a.id === data.agentId)!;
    setCustomSkills((prev) => [
      ...prev,
      {
        id: `skill-${Date.now()}`,
        icon: data.icon || "🔮",
        name: data.name,
        description: data.description || "自定义技能",
        duration: data.duration || "约5分钟",
        agentId: agent.id,
        agentName: agent.name,
        agentAvatar: agent.avatar,
        agentColor: agent.color,
        agentRole: agent.role,
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
                技能管理
              </h2>
              <p className="theme-text-secondary text-xs">
                管理掌柜团队的专业技能，每个技能都是一个可复用的自动化能力
              </p>
            </div>
            <button
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/30 transition-all cursor-pointer flex-shrink-0"
              onClick={() => setShowCreate(true)}
            >
              + 新建技能
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 stagger-children">
            <div className="card-base p-4">
              <div className="text-2xl font-mono font-bold text-white">
                {allSkills.length}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">技能总数</div>
            </div>
            <div className="card-base p-4">
              <div className="text-2xl font-mono font-bold text-white">
                {agents.length}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                掌柜数量
              </div>
            </div>
            <div className="card-base p-4">
              <div className="text-2xl font-mono font-bold text-white">
                {allSkills.filter((s) => s.duration === "实时").length}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                实时监控类
              </div>
            </div>
            <div className="card-base p-4">
              <div className="text-2xl font-mono font-bold text-white">
                {customSkills.length}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                自定义技能
              </div>
            </div>
          </div>

          {/* Search + Filter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6 animate-entrance" style={{ animationDelay: "0.1s" }}>
            <input
              type="text"
              placeholder="搜索技能名称或描述..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder-slate-600 outline-none focus:border-amber-500/30 transition-colors"
            />
            <div className="flex gap-1 flex-wrap">
              <button
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  filter === "all"
                    ? "bg-amber-500/10 text-amber-400"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
                onClick={() => setFilter("all")}
              >
                全部 ({allSkills.length})
              </button>
              {agents.map((agent) => {
                const count = allSkills.filter(
                  (s) => s.agentId === agent.id,
                ).length;
                return (
                  <button
                    key={agent.id}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      filter === agent.id
                        ? "text-white"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                    style={
                      filter === agent.id
                        ? {
                            backgroundColor: `color-mix(in srgb, ${agent.color} 12%, transparent)`,
                            color: agent.color,
                          }
                        : undefined
                    }
                    onClick={() => setFilter(agent.id)}
                  >
                    <span>{agent.avatar}</span>
                    <span>
                      {agent.name} ({count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {filtered.map((skill, i) => (
              <div
                key={`${skill.agentId}-${skill.id}`}
                className="card-base p-5 group animate-entrance"
                style={{ animationDelay: `${0.05 + i * 0.03}s` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
                    style={{
                      background: `color-mix(in srgb, ${skill.agentColor} 12%, transparent)`,
                    }}
                  >
                    {skill.icon}
                  </div>
                  <div
                    className="flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${skill.agentColor} 10%, transparent)`,
                      color: skill.agentColor,
                    }}
                  >
                    <span>{skill.agentAvatar}</span>
                    <span>{skill.agentName}</span>
                  </div>
                </div>

                <h3 className="text-[15px] font-semibold text-white mb-1">
                  {skill.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-3 line-clamp-2">
                  {skill.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {skill.duration}
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] text-slate-500">
                    {skill.agentRole}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-slate-600 text-sm">
              没有找到匹配的技能
            </div>
          )}
        </main>
      </div>

      {showCreate && (
        <CreateSkillModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}

function CreateSkillModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (data: {
    icon: string;
    name: string;
    description: string;
    duration: string;
    agentId: string;
  }) => void;
}) {
  const [form, setForm] = useState({
    icon: "",
    name: "",
    description: "",
    duration: "",
    agentId: agents[0].id,
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
        className="relative w-full max-w-lg card-base p-6 modal-content border-t-2 border-amber-500/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">新建技能</h2>
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
                placeholder="💡"
                maxLength={4}
                value={form.icon}
                onChange={(e) => update("icon", e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xl text-center text-white placeholder-slate-600 outline-none focus:border-amber-500/30 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1.5">
                技能名称 *
              </label>
              <input
                type="text"
                placeholder="如：客户画像分析"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder-slate-600 outline-none focus:border-amber-500/30 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1.5">
              技能描述
            </label>
            <textarea
              placeholder="描述这个技能能做什么..."
              rows={3}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder-slate-600 outline-none focus:border-amber-500/30 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1.5">
              预计耗时
            </label>
            <input
              type="text"
              placeholder="如：约5分钟"
              value={form.duration}
              onChange={(e) => update("duration", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder-slate-600 outline-none focus:border-amber-500/30 transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] text-slate-400 mb-1.5">
              分配给掌柜
            </label>
            <div className="flex flex-wrap gap-2">
              {agents.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all border cursor-pointer ${
                    form.agentId === a.id
                      ? "border-amber-500/30 bg-amber-500/10 text-white"
                      : "border-white/[0.05] bg-white/[0.02] text-slate-400 hover:bg-white/[0.05]"
                  }`}
                  onClick={() => update("agentId", a.id)}
                >
                  <span>{a.avatar}</span> {a.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            disabled={!canSubmit}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/25 hover:bg-amber-500/25 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            onClick={() => canSubmit && onCreate(form)}
          >
            创建技能
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
