"use client";

import { Activity } from "@/types";

interface ActivityFeedProps {
  activities: Activity[];
}

const TYPE_STYLES = {
  success: { dot: "bg-emerald-400", bg: "rgba(16,185,129,0.04)" },
  info: { dot: "bg-sky-400", bg: "rgba(56,189,248,0.04)" },
  warning: { dot: "bg-amber-400", bg: "rgba(245,158,11,0.04)" },
} as const;

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="card-base p-5 sticky top-20">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold theme-text-primary flex items-center gap-2.5 text-[15px]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          实时动态
        </h2>
        <span className="text-[11px] theme-text-tertiary font-mono">
          {activities.length} 条
        </span>
      </div>

      <div className="space-y-1.5 max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
        {activities.map((activity, i) => {
          const styles = TYPE_STYLES[activity.type];
          return (
            <div
              key={activity.id}
              className="p-3 rounded-xl transition-colors duration-200 theme-soft-surface animate-entrance"
              style={{
                background: styles.bg,
                animationDelay: `${i * 0.05}s`,
              }}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg flex-shrink-0 leading-none mt-0.5">
                  {activity.agentAvatar}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span
                      className="text-sm font-medium"
                      style={{ color: activity.agentColor }}
                    >
                      {activity.agentName}
                    </span>
                    <span
                      className={`w-1 h-1 rounded-full flex-shrink-0 ${styles.dot}`}
                    />
                  </div>
                  <p className="text-[13px] theme-text-secondary leading-relaxed">
                    {activity.message}
                  </p>
                  <span className="text-[11px] theme-text-tertiary mt-1 block font-mono">
                    {activity.time}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
