import { Task } from './types';

const STORAGE_KEY_PREFIX = 'planet-tasks';

function getStorageKey(userId?: string | null): string {
  if (userId) {
    return `${STORAGE_KEY_PREFIX}:${userId}`;
  }
  return STORAGE_KEY_PREFIX;
}

export function saveTasks(tasks: Task[], userId?: string | null): void {
  try {
    const key = getStorageKey(userId);
    localStorage.setItem(key, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
  }
}

export function loadTasks(userId?: string | null): Task[] {
  try {
    const key = getStorageKey(userId);
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }

    if (userId) {
      const fallback = localStorage.getItem(STORAGE_KEY_PREFIX);
      if (fallback) {
        return JSON.parse(fallback);
      }
    }
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error);
  }

  // Return sample data if nothing stored or error occurred
  return getSampleTasks();
}

export function clearTasks(userId?: string | null): void {
  try {
    const key = getStorageKey(userId);
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to clear tasks from localStorage:', error);
  }
}

function getSampleTasks(): Task[] {
  return [
    {
      id: 'task-1',
      name: 'Build Planet AI App',
      sizeHours: 40,
      status: 'in_progress',
      parentId: null,
      orderIndex: 0,
    },
    {
      id: 'task-2',
      name: 'Setup Project Structure',
      sizeHours: 8,
      status: 'done',
      parentId: 'task-1',
      orderIndex: 0,
    },
    {
      id: 'task-3',
      name: 'Build Task Tree UI',
      sizeHours: 12,
      status: 'in_progress',
      parentId: 'task-1',
      orderIndex: 1,
    },
    {
      id: 'task-4',
      name: 'Add Drag and Drop',
      sizeHours: 6,
      status: 'not_started',
      parentId: 'task-3',
      orderIndex: 0,
    },
    {
      id: 'task-5',
      name: 'Create Details Panel',
      sizeHours: 6,
      status: 'done',
      parentId: 'task-3',
      orderIndex: 1,
    },
    {
      id: 'task-6',
      name: 'Implement Progress Calculation',
      sizeHours: 8,
      status: 'done',
      parentId: 'task-1',
      orderIndex: 2,
    },
    {
      id: 'task-7',
      name: 'Add localStorage Persistence',
      sizeHours: 4,
      status: 'in_progress',
      parentId: 'task-1',
      orderIndex: 3,
    },
    {
      id: 'task-8',
      name: 'Deploy to Netlify',
      sizeHours: 8,
      status: 'not_started',
      parentId: 'task-1',
      orderIndex: 4,
    },
  ];
}