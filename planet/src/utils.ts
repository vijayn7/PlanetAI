import { Task, TaskStatus } from './types';

/**
 * Convert task status to progress percentage
 */
export function statusProgress(status: TaskStatus): number {
  switch (status) {
    case 'done': return 100;
    case 'in_progress': return 50;
    case 'not_started': return 0;
    default: return 0;
  }
}

/**
 * Compute weighted progress for a task and its children
 * If manual progress is set, use that. Otherwise calculate from children or status.
 */
export function computeProgress(task: Task): number {
  // If manual progress is set, use it directly
  if (task.progress != null) {
    return Math.max(0, Math.min(100, task.progress));
  }

  const children = task.children ?? [];
  
  // If no children, use status-based progress
  if (children.length === 0) {
    return statusProgress(task.status);
  }

  // Calculate weighted average from children
  let numerator = 0;
  let denominator = 0;

  for (const child of children) {
    const childProgress = computeProgress(child);
    const childWeight = child.sizeHours || 1; // Default weight of 1 if not set
    
    numerator += childWeight * childProgress;
    denominator += childWeight;
  }

  // If all children have zero weight, fall back to status
  return denominator > 0 ? numerator / denominator : statusProgress(task.status);
}

/**
 * Build tree structure from flat task list
 */
export function buildTaskTree(tasks: Task[]): Task[] {
  const taskMap = new Map<string, Task>();
  const rootTasks: Task[] = [];

  // First pass: create map and initialize children arrays
  for (const task of tasks) {
    taskMap.set(task.id, { ...task, children: [] });
  }

  // Second pass: build parent-child relationships
  for (const task of tasks) {
    const taskCopy = taskMap.get(task.id)!;
    
    if (task.parentId && taskMap.has(task.parentId)) {
      const parent = taskMap.get(task.parentId)!;
      parent.children!.push(taskCopy);
    } else {
      rootTasks.push(taskCopy);
    }
  }

  // Sort children by orderIndex
  const sortChildren = (tasks: Task[]) => {
    tasks.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
    tasks.forEach(task => {
      if (task.children && task.children.length > 0) {
        sortChildren(task.children);
      }
    });
  };

  sortChildren(rootTasks);
  return rootTasks;
}

/**
 * Generate a unique ID for new tasks
 */
export function generateTaskId(): string {
  return crypto.randomUUID();
}