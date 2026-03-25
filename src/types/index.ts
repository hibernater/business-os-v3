export type AgentStatus = "idle" | "working" | "completed";

export interface Skill {
  id: string;
  name: string;
  description: string;
  icon: string;
  duration: string;
}

export interface CurrentTask {
  skillId: string;
  skillName: string;
  skillIcon: string;
  progress: number;
  startedAt: number;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  level: number;
  xp: number;
  maxXp: number;
  status: AgentStatus;
  skills: Skill[];
  currentTask: CurrentTask | null;
  stats: {
    tasksCompleted: number;
    successRate: number;
  };
  greeting: string;
}

export interface Activity {
  id: string;
  agentId: string;
  agentName: string;
  agentAvatar: string;
  agentColor: string;
  message: string;
  time: string;
  type: "success" | "info" | "warning";
}

export interface WorkZone {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  capacity: number;
  agentIds: string[];
}

export type WorkflowStatus = "queued" | "running" | "completed";
export type WorkflowPriority = "high" | "normal" | "low";

export interface Workflow {
  id: string;
  name: string;
  zoneId: string;
  status: WorkflowStatus;
  progress: number;
  assignedAgentId: string | null;
  priority: WorkflowPriority;
  skillIcon: string;
}
