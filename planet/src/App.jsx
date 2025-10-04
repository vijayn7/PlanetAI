import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { buildTaskTree, generateTaskId } from './utils';
import { saveTasks, loadTasks } from './storage';
import { TaskTree } from './components/TaskTree';
import { TaskDetails } from './components/TaskDetails';
import { ProgressDonut } from './components/ProgressDonut';
import { GoogleLoginButton } from './components/GoogleLoginButton';
import './App.css';

const AUTH_STORAGE_KEY = 'planet-auth';

function loadStoredAuth() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored);
    if (parsed?.profile?.sub) {
      return parsed;
    }
  } catch (error) {
    console.warn('Failed to parse stored auth state', error);
  }

  return null;
}

function base64UrlDecode(segment) {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const decoder =
    (typeof globalThis !== 'undefined' && typeof globalThis.atob === 'function')
      ? globalThis.atob.bind(globalThis)
      : (typeof Buffer !== 'undefined'
        ? (value) => Buffer.from(value, 'base64').toString('binary')
        : null);

  if (!decoder) {
    throw new Error('No base64 decoder available in this environment.');
  }

  const decoded = decoder(base64 + padding);

  try {
    return decodeURIComponent(
      decoded
        .split('')
        .map(char => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join('')
    );
  } catch (error) {
    console.warn('Failed to decode URI component from JWT payload', error);
    return decoded;
  }
}

function parseGoogleCredential(credential) {
  const segments = credential.split('.');
  if (segments.length < 2) {
    throw new Error('Invalid Google credential.');
  }

  const payload = base64UrlDecode(segments[1]);
  return JSON.parse(payload);
}

function App() {
  const [authState, setAuthState] = useState(() => loadStoredAuth());
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [expandedTasks, setExpandedTasks] = useState(new Set());
  const [authError, setAuthError] = useState(null);

  const user = authState?.profile ?? null;
  const userId = user?.sub ?? null;
  const hasGoogleClientId = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

  // Load tasks whenever the authenticated user changes
  useEffect(() => {
    if (!userId) {
      setTasks([]);
      setSelectedTask(null);
      setExpandedTasks(new Set());
      return;
    }

    const loadedTasks = loadTasks(userId);
    setTasks(loadedTasks);

    const rootTasks = loadedTasks.filter(task => !task.parentId);
    setExpandedTasks(new Set(rootTasks.map(task => task.id)));
    setSelectedTask(null);
  }, [userId]);

  // Persist auth state in localStorage
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (authState) {
      try {
        window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
      } catch (error) {
        console.error('Failed to persist auth state', error);
      }
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [authState]);

  // Save tasks whenever they change
  useEffect(() => {
    if (userId) {
      saveTasks(tasks, userId);
    }
  }, [tasks, userId]);

  const handleTaskSelect = (task) => {
    setSelectedTask(task);
  };

  const handleTaskUpdate = (taskId, updates) => {
    setTasks(prevTasks => {
      const newTasks = prevTasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      );

      if (selectedTask?.id === taskId) {
        setSelectedTask({ ...selectedTask, ...updates });
      }

      return newTasks;
    });
  };

  const handleTaskMove = (taskId, newParentId, newIndex) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, parentId: newParentId, orderIndex: newIndex }
          : task
      )
    );
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

    if (parentId) {
      setExpandedTasks(prev => new Set([...prev, parentId]));
    }
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

  const handleGoogleCredential = useCallback((response) => {
    if (!response?.credential) {
      setAuthError('Google login did not return a credential. Please try again.');
      return;
    }

    try {
      const payload = parseGoogleCredential(response.credential);
      const profile = {
        sub: payload.sub,
        email: payload.email,
        name: payload.name || payload.email,
        picture: payload.picture,
        givenName: payload.given_name,
        familyName: payload.family_name,
      };

      setAuthState({
        profile,
        credential: response.credential,
        expiresAt: payload.exp ? payload.exp * 1000 : undefined,
      });
      setAuthError(null);
    } catch (error) {
      console.error('Failed to parse Google credential', error);
      setAuthError('We could not verify your Google login. Please try again.');
    }
  }, []);

  const handleLogout = useCallback(() => {
    setAuthState(null);
    setTasks([]);
    setSelectedTask(null);
    setExpandedTasks(new Set());
    setAuthError(null);

    try {
      const googleId = window.google?.accounts?.id;
      if (googleId?.disableAutoSelect) {
        googleId.disableAutoSelect();
      }
    } catch (error) {
      console.warn('Failed to disable Google auto select', error);
    }
  }, []);

  const taskTree = useMemo(() => buildTaskTree(tasks), [tasks]);

  if (!user) {
    return (
      <div className="app login-screen">
        <div className="login-card">
          <h1>🪐 Planet AI</h1>
          <p className="login-subtitle">
            Sign in with Google to connect your calendar and tasks.
          </p>
          {authError && <p className="login-error">{authError}</p>}
          {hasGoogleClientId ? (
            <GoogleLoginButton onCredential={handleGoogleCredential} />
          ) : (
            <p className="login-error">
              Add <code>VITE_GOOGLE_CLIENT_ID</code> to your environment to enable Google login.
            </p>
          )}
          <p className="login-note">
            We use your Google identity to securely access Calendar and Tasks data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🪐 Planet AI - Task Manager</h1>
        <ProgressDonut tasks={taskTree} />
        <div className="user-profile">
          {user?.picture && (
            <img src={user.picture} alt="User avatar" className="user-avatar" />
          )}
          <div className="user-details">
            <span className="user-name">{user?.name}</span>
            <span className="user-email">{user?.email}</span>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Sign out
          </button>
        </div>
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
