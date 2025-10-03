import React, { useState, useEffect } from 'react';
import { buildTaskTree, generateTaskId } from './utils';
import { saveTasks, loadTasks } from './storage';
import { TaskTree } from './components/TaskTree';
import { TaskDetails } from './components/TaskDetails';
import { ProgressDonut } from './components/ProgressDonut';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [expandedTasks, setExpandedTasks] = useState(new Set());

  // Load tasks on mount
  useEffect(() => {
    const loadedTasks = loadTasks();
    setTasks(loadedTasks);
    
    // Expand all root tasks by default
    const rootTasks = loadedTasks.filter(task => !task.parentId);
    setExpandedTasks(new Set(rootTasks.map(task => task.id)));
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      saveTasks(tasks);
    }
  }, [tasks]);

  const handleTaskSelect = (task) => {
    setSelectedTask(task);
  };

  const handleTaskUpdate = (taskId, updates) => {
    setTasks(prevTasks => {
      const newTasks = prevTasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      );
      
      // Update selectedTask if it's the one being updated
      if (selectedTask?.id === taskId) {
        setSelectedTask({ ...selectedTask, ...updates });
      }
      
      return newTasks;
    });
  };

  const handleTaskMove = (taskId, newParentId, newIndex) => {
    setTasks(prevTasks => {
      return prevTasks.map(task =>
        task.id === taskId 
          ? { ...task, parentId: newParentId, orderIndex: newIndex }
          : task
      );
    });
  };

  const handleTaskToggle = (taskId) => {
    setExpandedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const handleAddChild = (parentId) => {
    const newTask = {
      id: generateTaskId(),
      name: 'New Task',
      sizeHours: 1,
      status: 'not_started',
      parentId,
      orderIndex: 0,
    };

    setTasks(prev => [...prev, newTask]);
    setSelectedTask(newTask);
    
    // Expand the parent if it's not already expanded
    setExpandedTasks(prev => new Set([...prev, parentId]));
  };

  const handleAddRootTask = () => {
    const newTask = {
      id: generateTaskId(),
      name: 'New Root Task',
      sizeHours: 1,
      status: 'not_started',
      parentId: null,
      orderIndex: tasks.filter(t => !t.parentId).length,
    };

    setTasks(prev => [...prev, newTask]);
    setSelectedTask(newTask);
  };

  const handleTaskDelete = (taskId) => {
    setTasks(prev => {
      // Remove the task and all its descendants
      const toRemove = new Set();
      
      const collectDescendants = (id) => {
        toRemove.add(id);
        prev.filter(t => t.parentId === id).forEach(child => {
          collectDescendants(child.id);
        });
      };
      
      collectDescendants(taskId);
      
      return prev.filter(task => !toRemove.has(task.id));
    });
    
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
    }
  };

  const taskTree = buildTaskTree(tasks);

  return (
    <div className="app">
      <header className="app-header">
        <h1>🪐 Planet AI - Task Manager</h1>
        <ProgressDonut tasks={taskTree} />
      </header>

      <main className="app-main">
        <div className="app-sidebar">
          <div className="sidebar-header">
            <h2>Tasks</h2>
            <button className="add-root-task" onClick={handleAddRootTask}>
              + Add Task
            </button>
          </div>
          <TaskTree
            tasks={taskTree}
            selectedTaskId={selectedTask?.id}
            onTaskSelect={handleTaskSelect}
            onTaskMove={handleTaskMove}
            onTaskToggle={handleTaskToggle}
            expandedTasks={expandedTasks}
          />
        </div>

        <div className="app-content">
          <TaskDetails
            task={selectedTask}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
            onAddChild={handleAddChild}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
