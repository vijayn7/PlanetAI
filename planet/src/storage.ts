import { Task } from './types';

const STORAGE_KEY = 'planet-tasks';

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
  }
}

export function loadTasks(): Task[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error);
  }
  
  // Return sample data if nothing stored or error occurred
  return getSampleTasks();
}

export function clearTasks(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
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