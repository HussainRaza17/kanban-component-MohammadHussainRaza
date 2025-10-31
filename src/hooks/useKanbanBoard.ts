import { useState, useCallback } from 'react';
import type { KanbanTask, KanbanColumn } from '../components/Kanban/KanbanBoard.types';

interface UseKanbanBoardProps {
  initialColumns: KanbanColumn[];
  initialTasks: Record<string, KanbanTask>;
}

export const useKanbanBoard = ({ initialColumns, initialTasks }: UseKanbanBoardProps) => {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);
  const [tasks, setTasks] = useState<Record<string, KanbanTask>>(initialTasks);

  const onTaskMove = useCallback((taskId: string, fromColumn: string, toColumn: string, newIndex: number) => {
    setColumns(prevColumns => {
      const newColumns = prevColumns.map(col => ({ ...col, taskIds: [...col.taskIds] }));
      
      const fromColIndex = newColumns.findIndex(col => col.id === fromColumn);
      const toColIndex = newColumns.findIndex(col => col.id === toColumn);
      
      if (fromColIndex === -1 || toColIndex === -1) return prevColumns;

      const fromCol = newColumns[fromColIndex];
      const toCol = newColumns[toColIndex];

      const taskIndex = fromCol.taskIds.indexOf(taskId);
      if (taskIndex === -1) return prevColumns;

      fromCol.taskIds.splice(taskIndex, 1);
      
      let adjustedIndex = newIndex;
      if (fromColumn === toColumn && taskIndex < newIndex) {
        adjustedIndex = newIndex - 1;
      }
      
      toCol.taskIds.splice(adjustedIndex, 0, taskId);

      return newColumns;
    });

    setTasks(prevTasks => ({
      ...prevTasks,
      [taskId]: {
        ...prevTasks[taskId],
        status: toColumn,
      },
    }));
  }, []);

  const onTaskCreate = useCallback((columnId: string, task: KanbanTask) => {
    setTasks(prev => ({ ...prev, [task.id]: task }));
    setColumns(prev => prev.map(col => 
      col.id === columnId 
        ? { ...col, taskIds: [...col.taskIds, task.id] }
        : col
    ));
  }, []);

  const onTaskUpdate = useCallback((taskId: string, updates: Partial<KanbanTask>) => {
    setTasks(prev => ({
      ...prev,
      [taskId]: { ...prev[taskId], ...updates },
    }));

    if (updates.status && tasks[taskId].status !== updates.status) {
      setColumns(prevColumns => prevColumns.map(col => {
        if (col.id === tasks[taskId].status) {
          return {
            ...col,
            taskIds: col.taskIds.filter(id => id !== taskId),
          };
        }
        if (col.id === updates.status) {
          return {
            ...col,
            taskIds: [...col.taskIds, taskId],
          };
        }
        return col;
      }));
    }
  }, [tasks]);

  const onTaskDelete = useCallback((taskId: string) => {
    setTasks(prev => {
      const newTasks = { ...prev };
      delete newTasks[taskId];
      return newTasks;
    });

    setColumns(prev => prev.map(col => ({
      ...col,
      taskIds: col.taskIds.filter(id => id !== taskId),
    })));
  }, []);

  return {
    columns,
    tasks,
    onTaskMove,
    onTaskCreate,
    onTaskUpdate,
    onTaskDelete,
  };
};