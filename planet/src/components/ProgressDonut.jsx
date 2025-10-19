import React from 'react';
import { computeProgress } from '../utils';

export function ProgressDonut({ tasks, className = '' }) {
  // Calculate overall progress by treating all root tasks as siblings
  const totalProgress = tasks.length > 0 
    ? tasks.reduce((sum, task, _, arr) => {
        const taskProgress = computeProgress(task);
        const taskWeight = task.sizeHours || 1;
        return sum + (taskProgress * taskWeight) / arr.reduce((total, t) => total + (t.sizeHours || 1), 0);
      }, 0)
    : 0;

  const progressPercentage = Math.round(totalProgress);
  const progressDecimal = totalProgress / 100;

  // Create conic gradient for the donut
  const conicGradient = `conic-gradient(
    #22c55e 0deg ${progressDecimal * 360}deg,
    #e5e7eb ${progressDecimal * 360}deg 360deg
  )`;

  return (
    <div className={`progress-donut ${className}`}>
      <div className="donut-container">
        <div 
          className="donut-ring"
          style={{ background: conicGradient }}
        >
          <div className="donut-hole">
            <div className="donut-text">
              <div className="progress-number">{progressPercentage}%</div>
              <div className="progress-label">Complete</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="progress-stats">
        <div className="stat">
          <span className="stat-number">{tasks.length}</span>
          <span className="stat-label">Tasks</span>
        </div>
        <div className="stat">
          <span className="stat-number">
            {tasks.reduce((sum, task) => sum + (task.sizeHours || 1), 0)}
          </span>
          <span className="stat-label">Hours</span>
        </div>
        <div className="stat">
          <span className="stat-number">
            {tasks.filter(task => computeProgress(task) === 100).length}
          </span>
          <span className="stat-label">Done</span>
        </div>
      </div>
    </div>
  );
}
