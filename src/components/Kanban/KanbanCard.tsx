import React from 'react';
import { clsx } from 'clsx';
import type { KanbanTask } from './KanbanBoard.types';
import { isOverdue, formatDate, getInitials, getPriorityColor } from '../../utils/task.utils';

interface KanbanCardProps {
  task: KanbanTask;
  isDragging?: boolean;
  onEdit: (task: KanbanTask) => void;
  onDelete: (taskId: string) => void;
  onDragStart: (taskId: string) => void;
  onDragEnd: () => void;
}

export const KanbanCard: React.FC<KanbanCardProps> = React.memo(({ 
  task,
  isDragging = false,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
}) => {
  const handleClick = () => {
    onEdit(task);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onEdit(task);
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);
    onDragStart(task.id);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      role="button"
      tabIndex={0}
      aria-label={`${task.title}. Status: ${task.status}. Priority: ${task.priority}. Press space to grab.`}
      className={clsx(
        'bg-white border border-neutral-200 rounded-lg p-3 shadow-card hover:shadow-card-hover transition-all cursor-grab active:cursor-grabbing select-none',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        isDragging ? 'opacity-40 scale-95' : 'hover:scale-[1.02]',
        task.priority && getPriorityColor(task.priority)
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{ borderLeftWidth: task.priority ? '4px' : '1px' }}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-sm text-neutral-900 line-clamp-2 flex-1 mr-2">
          {task.title}
        </h4>
        {task.priority && (
          <span className={clsx(
            'text-xs px-2 py-0.5 rounded capitalize whitespace-nowrap',
            getPriorityColor(task.priority)
          )}>
            {task.priority}
          </span>
        )}
      </div>

      {task.description && (
        <p className="text-xs text-neutral-600 mb-2 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex gap-1 flex-wrap">
          {task.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs bg-neutral-100 px-2 py-0.5 rounded text-neutral-700">
              {tag}
            </span>
          ))}
          {task.tags && task.tags.length > 3 && (
            <span className="text-xs text-neutral-500">+{task.tags.length - 3}</span>
          )}
        </div>

        {task.assignee && (
          <div 
            className="w-6 h-6 bg-primary-500 rounded-full text-white text-xs flex items-center justify-center flex-shrink-0"
            title={task.assignee}
          >
            {getInitials(task.assignee)}
          </div>
        )}
      </div>

      {task.dueDate && (
        <div className={clsx(
          'text-xs mt-2 font-medium',
          isOverdue(task.dueDate) ? 'text-red-600' : 'text-neutral-500'
        )}>
          Due: {formatDate(task.dueDate)}
        </div>
      )}
    </div>
  );
});

KanbanCard.displayName = 'KanbanCard';