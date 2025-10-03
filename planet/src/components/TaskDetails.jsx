import React, { useState, useEffect } from 'react';

export function TaskDetails({
  task,
  onTaskUpdate,
  onTaskDelete,
  onAddChild,
}) {
  const [name, setName] = useState('');
  const [sizeHours, setSizeHours] = useState(1);
  const [status, setStatus] = useState('not_started');
  const [manualProgress, setManualProgress] = useState(null);
  const [useManualProgress, setUseManualProgress] = useState(false);

  useEffect(() => {
    if (task) {
      setName(task.name);
      setSizeHours(task.sizeHours);
      setStatus(task.status);
      setManualProgress(task.progress || null);
      setUseManualProgress(task.progress != null);
    }
  }, [task]);

  const handleSave = () => {
    if (!task) return;

    onTaskUpdate(task.id, {
      name,
      sizeHours,
      status,
      progress: useManualProgress ? manualProgress : null,
    });
  };

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    if (task) {
      onTaskUpdate(task.id, {
        status: newStatus,
        progress: useManualProgress ? manualProgress : null,
      });
    }
  };

  const handleManualProgressChange = (value) => {
    setManualProgress(value);
    if (task && useManualProgress) {
      onTaskUpdate(task.id, { progress: value });
    }
  };

  const handleUseManualProgressChange = (use) => {
    setUseManualProgress(use);
    if (task) {
      onTaskUpdate(task.id, { progress: use ? manualProgress : null });
    }
  };

  if (!task) {
    return (
      <div className="task-details empty">
        <p>Select a task to view details</p>
      </div>
    );
  }

  return (
    <div className="task-details">
      <h3>Task Details</h3>
      
      <div className="form-group">
        <label htmlFor="task-name">Name</label>
        <input
          id="task-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleSave}
          placeholder="Task name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="task-size">Size (hours)</label>
        <input
          id="task-size"
          type="number"
          min="0.5"
          step="0.5"
          value={sizeHours}
          onChange={(e) => setSizeHours(Number(e.target.value))}
          onBlur={handleSave}
        />
      </div>

      <div className="form-group">
        <label>Status</label>
        <div className="status-buttons">
          <button
            className={status === 'not_started' ? 'active' : ''}
            onClick={() => handleStatusChange('not_started')}
          >
            Not Started
          </button>
          <button
            className={status === 'in_progress' ? 'active' : ''}
            onClick={() => handleStatusChange('in_progress')}
          >
            In Progress
          </button>
          <button
            className={status === 'done' ? 'active' : ''}
            onClick={() => handleStatusChange('done')}
          >
            Done
          </button>
        </div>
      </div>

      <div className="form-group">
        <label>
          <input
            type="checkbox"
            checked={useManualProgress}
            onChange={(e) => handleUseManualProgressChange(e.target.checked)}
          />
          Override with manual progress
        </label>
        
        {useManualProgress && (
          <div className="progress-slider">
            <input
              type="range"
              min="0"
              max="100"
              value={manualProgress || 0}
              onChange={(e) => handleManualProgressChange(Number(e.target.value))}
            />
            <span>{manualProgress || 0}%</span>
          </div>
        )}
      </div>

      <div className="form-actions">
        <button
          className="add-child-button"
          onClick={() => onAddChild(task.id)}
        >
          Add Child Task
        </button>
        
        <button
          className="delete-button"
          onClick={() => onTaskDelete(task.id)}
        >
          Delete Task
        </button>
      </div>
    </div>
  );
}