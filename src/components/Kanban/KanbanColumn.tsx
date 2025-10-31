import React, { useState } from 'react';
import { clsx } from 'clsx';
import type { KanbanColumn as KanbanColumnType, KanbanTask } from './KanbanBoard.types';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  column: KanbanColumnType;
  tasks: KanbanTask[];
  onTaskEdit: (task: KanbanTask) => void;
  onTaskDelete: (taskId: string) => void;
  onAddTask: (columnId: string) => void;
  draggedTaskId: string | null;
  onDragStart: (taskId: string) => void;
  onDragEnd: () => void;
  onDrop: (columnId: string, position?: number) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = React.memo(({
  column,
  tasks,
  onTaskEdit,
  onTaskDelete,
  onAddTask,
  draggedTaskId,
  onDragStart,
  onDragEnd,
  onDrop,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  const isNearLimit = column.maxTasks && tasks.length >= column.maxTasks * 0.8;
  const isOverLimit = column.maxTasks && tasks.length > column.maxTasks;

  const handleDragOver = (e: React.DragEvent, index?: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setIsDragOver(true);
    setDropIndex(index ?? null);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setIsDragOver(false);
      setDropIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent, index?: number) => {
    e.preventDefault();
    setIsDragOver(false);
    setDropIndex(null);
    onDrop(column.id, index);
  };

  return (
    <div
      role="region"
      aria-label={`${column.title} column. ${tasks.length} tasks.`}
      className={clsx(
        'flex flex-col w-80 bg-neutral-50 rounded-lg border transition-all',
        isDragOver ? 'bg-primary-50 border-primary-300 shadow-lg' : 'border-neutral-200'
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200 bg-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: column.color }}
          />
          <h3 className="font-semibold text-neutral-900">{column.title}</h3>
          <span className="text-sm text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
            {tasks.length}
            {column.maxTasks && ` / ${column.maxTasks}`}
          </span>
        </div>
        
        {isNearLimit && !isOverLimit && (
          <div className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
            Near Limit
          </div>
        )}
        {isOverLimit && (
          <div className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
            Over Limit
          </div>
        )}
      </div>

      {/* Tasks Container */}
      <div 
        className="flex-1 p-3 overflow-y-auto min-h-[200px] max-h-[calc(100vh-280px)]"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {tasks.length === 0 ? (
          <div 
            className={clsx(
              'text-center py-12 text-neutral-500 text-sm border-2 border-dashed rounded-lg transition-all',
              isDragOver ? 'border-primary-400 bg-primary-100 text-primary-700' : 'border-neutral-300'
            )}
          >
            {isDragOver ? 'Drop task here' : 'No tasks in this column'}
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task, index) => (
              <div key={task.id}>
                {dropIndex === index && draggedTaskId !== task.id && (
                  <div className="h-1 bg-primary-500 rounded-full mb-3 shadow-sm" />
                )}
                <div onDragOver={(e) => handleDragOver(e, index)}>
                  <KanbanCard
                    task={task}
                    onEdit={onTaskEdit}
                    onDelete={onTaskDelete}
                    isDragging={draggedTaskId === task.id}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                  />
                </div>
              </div>
            ))}
            {dropIndex === tasks.length && (
              <div className="h-1 bg-primary-500 rounded-full shadow-sm" />
            )}
          </div>
        )}
      </div>

      {/* Add Task Button */}
      <div className="p-3 border-t border-neutral-200 bg-white rounded-b-lg">
        <button
          onClick={() => onAddTask(column.id)}
          className="w-full py-2 text-sm text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          + Add Task
        </button>
      </div>
    </div>
  );
});

KanbanColumn.displayName = 'KanbanColumn';