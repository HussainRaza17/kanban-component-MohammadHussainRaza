export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority?: Priority;
  assignee?: string;
  tags?: string[];
  createdAt: string;
  dueDate?: string;
}

export interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  taskIds: string[];
  maxTasks?: number;
}

export interface KanbanBoardProps {
  columns: KanbanColumn[];
  tasks: Record<string, KanbanTask>;
  onTaskMove: (
    taskId: string,
    fromColumn: string,
    toColumn: string,
    newIndex: number
  ) => void;
  onTaskCreate: (columnId: string, task: KanbanTask) => void;
  onTaskUpdate: (taskId: string, updates: Partial<KanbanTask>) => void;
  onTaskDelete: (taskId: string) => void;
}
