export type TaskStatus = 'not_started' | 'in_progress' | 'done';

export type Task = {
  id: string;
  name: string;
  sizeHours: number; // weight for progress calculation
  status: TaskStatus;
  progress?: number | null; // if set, overrides status-based progress
  parentId?: string | null;
  children?: Task[]; // for rendering only - computed from flat list
  orderIndex?: number; // for maintaining order within siblings
};

export type TaskTree = {
  rootTasks: Task[];
  allTasks: Map<string, Task>;
};
