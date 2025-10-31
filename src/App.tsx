import './index.css'
import { KanbanBoard } from './components/Kanban/KanbanBoard'
import { useKanbanBoard } from './hooks/useKanbanBoard'

const sampleColumns = [
  { id: 'todo', title: 'To Do', color: '#6b7280', taskIds: ['task-1', 'task-2'], maxTasks: 10 },
  { id: 'in-progress', title: 'In Progress', color: '#3b8276', taskIds: ['task-3'], maxTasks: 5 },
  { id: 'review', title: 'Review', color: '#f59e0b', taskIds: [], maxTasks: 3 },
  { id: 'done', title: 'Done', color: '#10b981', taskIds: ['task-4', 'task-5'] },
];

const sampleTasks = {
  'task-1': {
    id: 'task-1',
    title: 'Implement drag and drop functionality',
    description: 'Add smooth drag and drop functionality to kanban cards with proper visual feedback',
    status: 'todo',
    priority: 'high' as const,
    assignee: 'John Doe',
    tags: ['frontend', 'feature', 'interaction'],
    createdAt: new Date(2024, 0, 10),
    dueDate: new Date(2024, 0, 20),
  },
  'task-2': {
    id: 'task-2',
    title: 'Design task modal component',
    description: 'Create a comprehensive modal for editing task details with all required fields',
    status: 'todo',
    priority: 'medium' as const,
    assignee: 'Jane Smith',
    tags: ['design', 'ui', 'modal'],
    createdAt: new Date(2024, 0, 11),
    dueDate: new Date(2024, 0, 18),
  },
  'task-3': {
    id: 'task-3',
    title: 'Setup TypeScript configuration',
    status: 'in-progress',
    priority: 'urgent' as const,
    assignee: 'John Doe',
    tags: ['setup', 'typescript', 'configuration'],
    createdAt: new Date(2024, 0, 9),
  },
  'task-4': {
    id: 'task-4',
    title: 'Create project structure',
    description: 'Setup proper folder structure and initial configuration files',
    status: 'done',
    priority: 'low' as const,
    assignee: 'Jane Smith',
    tags: ['setup', 'structure'],
    createdAt: new Date(2024, 0, 8),
    dueDate: new Date(2024, 0, 9),
  },
  'task-5': {
    id: 'task-5',
    title: 'Install dependencies',
    status: 'done',
    priority: 'low' as const,
    assignee: 'John Doe',
    tags: ['setup', 'dependencies'],
    createdAt: new Date(2024, 0, 8),
  },
};

function App() {
  const boardState = useKanbanBoard({
    initialColumns: sampleColumns,
    initialTasks: sampleTasks,
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      <KanbanBoard
        columns={boardState.columns}
        tasks={boardState.tasks}
        onTaskMove={boardState.onTaskMove}
        onTaskCreate={boardState.onTaskCreate}
        onTaskUpdate={boardState.onTaskUpdate}
        onTaskDelete={boardState.onTaskDelete}
      />
    </div>
  )
}

export default App