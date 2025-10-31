import React, { useState, useCallback } from 'react';
import type { KanbanViewProps, KanbanTask } from './KanbanBoard.types';
import { KanbanColumn } from './KanbanColumn';
import { TaskModal } from './TaskModal';

export const KanbanBoard: React.FC<KanbanViewProps> = ({
  columns,
  tasks,
  onTaskMove,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
}) => {
  const [editingTask, setEditingTask] = useState<KanbanTask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const handleDragStart = useCallback((taskId: string) => {
    setDraggedTaskId(taskId);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedTaskId(null);
  }, []);

  const handleDrop = useCallback((targetColumnId: string, dropIndex?: number) => {
    if (!draggedTaskId) return;

    const draggedTask = tasks[draggedTaskId];
    if (!draggedTask) return;

    const sourceColumnId = draggedTask.status;
    
    const finalIndex = dropIndex !== undefined ? dropIndex : 
      columns.find(c => c.id === targetColumnId)?.taskIds.length || 0;

    onTaskMove(draggedTaskId, sourceColumnId, targetColumnId, finalIndex);
    
    setDraggedTaskId(null);
  }, [draggedTaskId, tasks, columns, onTaskMove]);

  const handleTaskEdit = (task: KanbanTask) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleAddTask = (columnId: string) => {
    setSelectedColumn(columnId);
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setSelectedColumn(null);
  };

  const handleTaskSave = (taskData: Partial<KanbanTask>) => {
    if (editingTask) {
      onTaskUpdate(editingTask.id, taskData);
    } else if (selectedColumn) {
      const newTask: KanbanTask = {
        id: `task-${Date.now()}`,
        title: taskData.title || 'New Task',
        description: taskData.description,
        status: selectedColumn,
        priority: taskData.priority,
        assignee: taskData.assignee,
        tags: taskData.tags,
        createdAt: new Date(),
        dueDate: taskData.dueDate,
      };
      onTaskCreate(selectedColumn, newTask);
    }
    handleModalClose();
  };

  const handleTaskDelete = (taskId: string) => {
    onTaskDelete(taskId);
    handleModalClose();
  };

  return (
    <div className="min-h-screen bg-neutral-100 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Kanban Board</h1>
        <p className="text-neutral-600">Drag and drop tasks to organize your workflow</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map(column => {
          const columnTasks = column.taskIds
            .map(taskId => tasks[taskId])
            .filter(Boolean);

          return (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={columnTasks}
              onTaskEdit={handleTaskEdit}
              onTaskDelete={onTaskDelete}
              onAddTask={handleAddTask}
              draggedTaskId={draggedTaskId}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
            />
          );
        })}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        task={editingTask}
        columns={columns}
        onSave={handleTaskSave}
        onDelete={handleTaskDelete}
      />
    </div>
  );
};