import { isAfter } from 'date-fns';
import type { TaskPriority } from '../components/Kanban/KanbanBoard.types';

export const isOverdue = (dueDate: Date): boolean => {
  return isAfter(new Date(), dueDate);
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getPriorityColor = (priority: TaskPriority): string => {
  const colors = {
    low: 'border-l-blue-500 bg-blue-50 text-blue-700',
    medium: 'border-l-yellow-500 bg-yellow-50 text-yellow-700',
    high: 'border-l-orange-500 bg-orange-50 text-orange-700',
    urgent: 'border-l-red-500 bg-red-50 text-red-700',
  };
  return colors[priority] || colors.medium;
};

export const formatDateForInput = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatDate = (date: Date, formatType: 'display' | 'input' = 'display'): string => {
  if (formatType === 'input') {
    return formatDateForInput(date);
  }
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const reorderTasks = (
  tasks: string[],
  startIndex: number,
  endIndex: number
): string[] => {
  const result = Array.from(tasks);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export const moveTaskBetweenColumns = (
  sourceColumn: string[],
  destColumn: string[],
  sourceIndex: number,
  destIndex: number
): { source: string[]; destination: string[] } => {
  const sourceClone = Array.from(sourceColumn);
  const destClone = Array.from(destColumn);
  const [removed] = sourceClone.splice(sourceIndex, 1);
  destClone.splice(destIndex, 0, removed);

  return {
    source: sourceClone,
    destination: destClone,
  };
};