import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { computeProgress } from '../utils';

export function TaskItem({
  task,
  level,
  isSelected,
  isExpanded,
  onSelect,
  onToggle,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const progress = computeProgress(task);
  const hasChildren = task.children && task.children.length > 0;
  const indent = level * 20;

  const getStatusColor = (status) => {
    switch (status) {
      case 'done': return '#22c55e';
      case 'in_progress': return '#3b82f6';
      case 'not_started': return '#94a3b8';
      default: return '#94a3b8';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`task-item ${isSelected ? 'selected' : ''}`}
      {...attributes}
    >
      <div
        className="task-content"
        style={{ paddingLeft: `${indent}px` }}
        onClick={() => onSelect(task)}
      >
        {hasChildren && (
          <button
            className="expand-button"
            onClick={(e) => {
              e.stopPropagation();
              onToggle(task.id);
            }}
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        )}
        
        <div className="task-drag-handle" {...listeners}>
          ⋮⋮
        </div>
        
        <div className="task-info">
          <div className="task-name">{task.name}</div>
          <div className="task-meta">
            <span className="task-size">{task.sizeHours}h</span>
            <span 
              className="task-status"
              style={{ color: getStatusColor(task.status) }}
            >
              {task.status.replace('_', ' ')}
            </span>
            <span className="task-progress">{Math.round(progress)}%</span>
          </div>
        </div>
        
        <div 
          className="task-progress-bar"
          style={{
            background: `linear-gradient(to right, ${getStatusColor(task.status)} ${progress}%, #e5e7eb ${progress}%)`
          }}
        />
      </div>
      
      {hasChildren && isExpanded && (
        <div className="task-children">
          {task.children.map((child) => (
            <TaskItem
              key={child.id}
              task={child}
              level={level + 1}
              isSelected={isSelected}
              isExpanded={isExpanded}
              onSelect={onSelect}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
