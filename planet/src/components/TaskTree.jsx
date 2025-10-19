import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { computeProgress } from '../utils';
import { TaskItem } from './TaskItem';

export function TaskTree({
  tasks,
  selectedTaskId,
  onTaskSelect,
  onTaskMove,
  onTaskToggle,
  expandedTasks,
}) {
  const [activeTask, setActiveTask] = useState(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const task = findTaskById(tasks, active.id);
    setActiveTask(task);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    setActiveTask(null);
    
    if (!over || active.id === over.id) {
      return;
    }

    const activeTaskId = active.id;
    const overTaskId = over.id;
    
    // Find the target task to determine new parent
    const overTask = findTaskById(tasks, overTaskId);
    if (!overTask) return;

    // For now, make it a child of the target task
    // In a more sophisticated version, you'd check drop position
    onTaskMove(activeTaskId, overTaskId, 0);
  };

  const getAllTaskIds = (tasks) => {
    const ids = [];
    for (const task of tasks) {
      ids.push(task.id);
      if (task.children) {
        ids.push(...getAllTaskIds(task.children));
      }
    }
    return ids;
  };

  return (
    <div className="task-tree">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={getAllTaskIds(tasks)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              level={0}
              isSelected={selectedTaskId === task.id}
              isExpanded={expandedTasks.has(task.id)}
              onSelect={onTaskSelect}
              onToggle={onTaskToggle}
            />
          ))}
        </SortableContext>
        
        <DragOverlay>
          {activeTask ? (
            <div className="drag-overlay">
              <TaskItem
                task={activeTask}
                level={0}
                isSelected={false}
                isExpanded={false}
                onSelect={() => {}}
                onToggle={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function findTaskById(tasks, taskId) {
  for (const task of tasks) {
    if (task.id === taskId) {
      return task;
    }
    if (task.children) {
      const found = findTaskById(task.children, taskId);
      if (found) return found;
    }
  }
  return null;
}
