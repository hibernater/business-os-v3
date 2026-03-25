"use client";

import { Agent, Skill } from "@/types";

interface SkillModalProps {
  agent: Agent;
  onClose: () => void;
  onExecute: (agentId: string, skill: Skill) => void;
}

export default function SkillModal({
  agent,
  onClose,
  onExecute,
}: SkillModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      <div
        className="relative w-full max-w-lg card-base p-6 modal-content border-t-2"
        style={{ borderTopColor: agent.color }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-5">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{
              background: `linear-gradient(135deg, color-mix(in srgb, ${agent.color} 20%, #0f172a), color-mix(in srgb, ${agent.color} 6%, #0f172a))`,
              boxShadow: `0 4px 20px color-mix(in srgb, ${agent.color} 12%, transparent)`,
            }}
          >
            {agent.avatar}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white">
              为 {agent.name} 分配任务
            </h2>
            <p className="text-sm text-slate-400">
              {agent.role} · Lv.{agent.level}
            </p>
          </div>
          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all duration-200 text-lg cursor-pointer"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {/* Greeting */}
        <div
          className="mb-5 p-3.5 rounded-xl text-sm leading-relaxed"
          style={{
            color: `color-mix(in srgb, ${agent.color} 80%, white)`,
            background: `color-mix(in srgb, ${agent.color} 6%, transparent)`,
            borderLeft: `3px solid ${agent.color}`,
          }}
        >
          &ldquo;{agent.greeting}&rdquo;
        </div>

        {/* Skills */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {agent.skills.map((skill, i) => (
            <div
              key={skill.id}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.1] hover:bg-white/[0.04] transition-all duration-300 group animate-entrance"
              style={{ animationDelay: `${0.1 + i * 0.07}s` }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xl">{skill.icon}</span>
                    <span className="font-semibold text-white text-[15px]">
                      {skill.name}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed mb-2.5">
                    {skill.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
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
                </div>
                <button
                  className="ml-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 opacity-50 group-hover:opacity-100 cursor-pointer shrink-0"
                  style={{
                    color: agent.color,
                    background: `color-mix(in srgb, ${agent.color} 10%, transparent)`,
                    border: `1px solid color-mix(in srgb, ${agent.color} 20%, transparent)`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `color-mix(in srgb, ${agent.color} 25%, transparent)`;
                    e.currentTarget.style.borderColor = `color-mix(in srgb, ${agent.color} 45%, transparent)`;
                    e.currentTarget.style.boxShadow = `0 4px 16px color-mix(in srgb, ${agent.color} 15%, transparent)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `color-mix(in srgb, ${agent.color} 10%, transparent)`;
                    e.currentTarget.style.borderColor = `color-mix(in srgb, ${agent.color} 20%, transparent)`;
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  onClick={() => onExecute(agent.id, skill)}
                >
                  ▶ 执行
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <button
          className="mt-5 w-full py-2.5 rounded-xl text-sm text-slate-400 border border-white/[0.06] hover:border-white/[0.12] hover:text-slate-200 hover:bg-white/[0.03] transition-all duration-200 cursor-pointer"
          onClick={onClose}
        >
          关闭
        </button>
      </div>
    </div>
  );
}
