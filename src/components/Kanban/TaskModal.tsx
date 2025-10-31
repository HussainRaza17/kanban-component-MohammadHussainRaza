import React, { useState, useEffect } from 'react';
import type { KanbanTask, KanbanColumn, TaskPriority } from './KanbanBoard.types';
import { Modal } from '../../primitives/Modal';
import { Button } from '../../primitives/Button';
import { formatDate, isOverdue, getInitials } from '../../utils/task.utils';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: KanbanTask | null;
  columns: KanbanColumn[];
  onSave: (taskData: Partial<KanbanTask>) => void;
  onDelete?: (taskId: string) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  task,
  columns,
  onSave,
  onDelete,
}) => {
  const [formData, setFormData] = useState<Partial<KanbanTask>>({
    title: '',
    description: '',
    status: '',
    priority: 'medium' as TaskPriority,
    assignee: '',
    tags: [],
    dueDate: undefined,
  });

  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority || 'medium',
        assignee: task.assignee || '',
        tags: task.tags || [],
        dueDate: task.dueDate,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: columns[0]?.id || '',
        priority: 'medium',
        assignee: '',
        tags: [],
        dueDate: undefined,
      });
    }
  }, [task, columns]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) return;

    onSave(formData);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || [],
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const isEditing = !!task;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Task' : 'Create New Task'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter task title"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter task description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-neutral-700 mb-1">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {columns.map(column => (
                <option key={column.id} value={column.id}>
                  {column.title}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-neutral-700 mb-1">
              Priority
            </label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as TaskPriority }))}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Assignee */}
          <div>
            <label htmlFor="assignee" className="block text-sm font-medium text-neutral-700 mb-1">
              Assignee
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                id="assignee"
                value={formData.assignee}
                onChange={(e) => setFormData(prev => ({ ...prev, assignee: e.target.value }))}
                className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Assign to someone"
              />
              {formData.assignee && (
                <div 
                  className="w-8 h-8 bg-primary-500 rounded-full text-white text-xs flex items-center justify-center flex-shrink-0"
                  title={formData.assignee}
                >
                  {getInitials(formData.assignee)}
                </div>
              )}
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-neutral-700 mb-1">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              value={formData.dueDate ? formatDateForInput(formData.dueDate) : ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                dueDate: e.target.value ? new Date(e.target.value) : undefined 
              }))}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {formData.dueDate && isOverdue(formData.dueDate) && (
              <p className="text-red-600 text-xs mt-1 font-medium">⚠️ This task is overdue!</p>
            )}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Add a tag"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddTag}
              disabled={!newTag.trim()}
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags?.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 bg-primary-100 text-primary-800 px-2 py-1 rounded text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-primary-600 hover:text-primary-800 text-xs"
                  aria-label={`Remove tag ${tag}`}
                >
                  ×
                </button>
              </span>
            ))}
            {(!formData.tags || formData.tags.length === 0) && (
              <p className="text-neutral-500 text-sm">No tags added</p>
            )}
          </div>
        </div>

        {/* Created Date */}
        {isEditing && task.createdAt && (
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Created Date
            </label>
            <p className="text-sm text-neutral-600">
              {formatDate(task.createdAt)}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
          <div>
            {isEditing && onDelete && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => onDelete(task.id)}
                className="text-red-600 hover:text-red-800 hover:bg-red-50"
              >
                Delete Task
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.title?.trim()}
            >
              {isEditing ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};