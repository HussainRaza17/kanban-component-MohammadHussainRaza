import type { Meta, StoryObj } from '@storybook/react';
import { KanbanBoard } from './KanbanBoard';
import type { KanbanColumn, KanbanTask } from './KanbanBoard.types';

const meta: Meta<typeof KanbanBoard> = {
  title: 'Components/KanbanBoard',
  component: KanbanBoard,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof KanbanBoard>;

const sampleColumns: KanbanColumn[] = [
  { id: 'todo', title: 'To Do', color: '#6b7280', taskIds: ['task-1', 'task-2'], maxTasks: 10 },
  { id: 'in-progress', title: 'In Progress', color: '#3b8276', taskIds: ['task-3'], maxTasks: 5 },
  { id: 'review', title: 'Review', color: '#f59e0b', taskIds: [], maxTasks: 3 },
  { id: 'done', title: 'Done', color: '#10b981', taskIds: ['task-4', 'task-5'] },
];

const sampleTasks: Record<string, KanbanTask> = {
  'task-1': {
    id: 'task-1',
    title: 'Implement drag and drop functionality',
    description: 'Add smooth drag and drop functionality to kanban cards with proper visual feedback',
    status: 'todo',
    priority: 'high',
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
    priority: 'medium',
    assignee: 'Jane Smith',
    tags: ['design', 'ui', 'modal'],
    createdAt: new Date(2024, 0, 11),
    dueDate: new Date(2024, 0, 18),
  },
  'task-3': {
    id: 'task-3',
    title: 'Setup TypeScript configuration',
    status: 'in-progress',
    priority: 'urgent',
    assignee: 'John Doe',
    tags: ['setup', 'typescript', 'configuration'],
    createdAt: new Date(2024, 0, 9),
  },
  'task-4': {
    id: 'task-4',
    title: 'Create project structure',
    description: 'Setup proper folder structure and initial configuration files',
    status: 'done',
    priority: 'low',
    assignee: 'Jane Smith',
    tags: ['setup', 'structure'],
    createdAt: new Date(2024, 0, 8),
    dueDate: new Date(2024, 0, 9),
  },
  'task-5': {
    id: 'task-5',
    title: 'Install dependencies',
    status: 'done',
    priority: 'low',
    assignee: 'John Doe',
    tags: ['setup', 'dependencies'],
    createdAt: new Date(2024, 0, 8),
  },
};

export const Default: Story = {
  args: {
    columns: sampleColumns,
    tasks: sampleTasks,
    onTaskMove: (taskId, fromColumn, toColumn, newIndex) => {
      console.log('Task moved:', { taskId, fromColumn, toColumn, newIndex });
    },
    onTaskCreate: (columnId, task) => {
      console.log('Task created:', { columnId, task });
    },
    onTaskUpdate: (taskId, updates) => {
      console.log('Task updated:', { taskId, updates });
    },
    onTaskDelete: (taskId) => {
      console.log('Task deleted:', taskId);
    },
  },
};

export const EmptyState: Story = {
  args: {
    columns: sampleColumns.map(col => ({ ...col, taskIds: [] })),
    tasks: {},
    onTaskMove: () => {},
    onTaskCreate: () => {},
    onTaskUpdate: () => {},
    onTaskDelete: () => {},
  },
};

const createLargeDataset = () => {
  const largeColumns: KanbanColumn[] = [
    { id: 'backlog', title: 'Backlog', color: '#6b7280', taskIds: [], maxTasks: 50 },
    { id: 'todo', title: 'To Do', color: '#3b82f6', taskIds: [], maxTasks: 20 },
    { id: 'in-progress', title: 'In Progress', color: '#f59e0b', taskIds: [], maxTasks: 10 },
    { id: 'review', title: 'Review', color: '#8b5cf6', taskIds: [], maxTasks: 8 },
    { id: 'done', title: 'Done', color: '#10b981', taskIds: [], maxTasks: 100 },
  ];

  const largeTasks: Record<string, KanbanTask> = {};
  const priorities: Array<'low' | 'medium' | 'high' | 'urgent'> = ['low', 'medium', 'high', 'urgent'];
  const assignees = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'Tom Brown'];

  let taskId = 1;
  
  largeColumns.forEach(column => {
    const taskCount = column.id === 'backlog' ? 25 : column.id === 'done' ? 30 : 15;
    
    for (let i = 0; i < taskCount; i++) {
      const id = `large-task-${taskId}`;
      const targetColumn = largeColumns.find(col => col.id === column.id);
      if (targetColumn) {
        targetColumn.taskIds.push(id);
      }
      
      largeTasks[id] = {
        id,
        title: `Task ${taskId}: ${['Implement', 'Design', 'Refactor', 'Test', 'Document'][taskId % 5]} ${['component', 'feature', 'API', 'layout', 'system'][taskId % 5]}`,
        description: `This is a detailed description for task ${taskId} that explains what needs to be done and any specific requirements.`,
        status: column.id,
        priority: priorities[taskId % 4],
        assignee: assignees[taskId % 5],
        tags: [`tag-${taskId % 10}`, `category-${taskId % 5}`, `priority-${priorities[taskId % 4]}`],
        createdAt: new Date(2024, 0, taskId % 30 + 1),
        dueDate: new Date(2024, 1, taskId % 28 + 1),
      };
      
      taskId++;
    }
  });

  return { largeColumns, largeTasks };
};


const { largeColumns, largeTasks } = createLargeDataset();

export const WithManyTasks: Story = {
  args: {
    columns: largeColumns,
    tasks: largeTasks,
    onTaskMove: () => {},
    onTaskCreate: () => {},
    onTaskUpdate: () => {},
    onTaskDelete: () => {},
  },
};

export const DifferentPriorities: Story = {
  args: {
    columns: sampleColumns,
    tasks: {
      'low-priority': {
        id: 'low-priority',
        title: 'Low priority task',
        status: 'todo',
        priority: 'low',
        assignee: 'John Doe',
        tags: ['documentation'],
        createdAt: new Date(),
      },
      'medium-priority': {
        id: 'medium-priority',
        title: 'Medium priority task',
        status: 'todo',
        priority: 'medium',
        assignee: 'Jane Smith',
        tags: ['feature'],
        createdAt: new Date(),
      },
      'high-priority': {
        id: 'high-priority',
        title: 'High priority task',
        status: 'in-progress',
        priority: 'high',
        assignee: 'John Doe',
        tags: ['bug', 'critical'],
        createdAt: new Date(),
      },
      'urgent-priority': {
        id: 'urgent-priority',
        title: 'Urgent priority task - Fix critical issue',
        status: 'in-progress',
        priority: 'urgent',
        assignee: 'Jane Smith',
        tags: ['hotfix', 'production'],
        createdAt: new Date(),
        dueDate: new Date(Date.now() + 86400000),
      },
    },
    onTaskMove: () => {},
    onTaskCreate: () => {},
    onTaskUpdate: () => {},
    onTaskDelete: () => {},
  },
};

export const InteractiveDemo: Story = {
  args: {
    columns: sampleColumns,
    tasks: sampleTasks,
    onTaskMove: (taskId, fromColumn, toColumn, newIndex) => {
      console.log('Task moved:', { taskId, fromColumn, toColumn, newIndex });
    },
    onTaskCreate: (columnId, task) => {
      console.log('Task created:', { columnId, task });
    },
    onTaskUpdate: (taskId, updates) => {
      console.log('Task updated:', { taskId, updates });
    },
    onTaskDelete: (taskId) => {
      console.log('Task deleted:', taskId);
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Fully functional interactive demo with drag-and-drop capabilities. Try moving tasks between columns!',
      },
    },
  },
};

export const MobileView: Story = {
  args: {
    columns: sampleColumns,
    tasks: sampleTasks,
    onTaskMove: () => {},
    onTaskCreate: () => {},
    onTaskUpdate: () => {},
    onTaskDelete: () => {},
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Demonstration of responsive behavior on mobile devices. Resize the viewport to see how the layout adapts.',
      },
    },
  },
};

export const AccessibilityDemo: Story = {
  args: {
    columns: sampleColumns,
    tasks: sampleTasks,
    onTaskMove: () => {},
    onTaskCreate: () => {},
    onTaskUpdate: () => {},
    onTaskDelete: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Accessibility-focused demonstration. Use Tab to navigate and Space/Enter to interact with tasks.',
      },
    },
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
  },
};

export const WithWIPLimits: Story = {
  args: {
    columns: [
      { id: 'todo', title: 'To Do', color: '#6b7280', taskIds: ['task-1', 'task-2', 'task-6', 'task-7'], maxTasks: 3 },
      { id: 'in-progress', title: 'In Progress', color: '#3b8276', taskIds: ['task-3', 'task-8', 'task-9'], maxTasks: 2 },
      { id: 'review', title: 'Review', color: '#f59e0b', taskIds: ['task-10'], maxTasks: 2 },
      { id: 'done', title: 'Done', color: '#10b981', taskIds: ['task-4', 'task-5'] },
    ],
    tasks: {
      ...sampleTasks,
      'task-6': {
        id: 'task-6',
        title: 'Additional todo task',
        status: 'todo',
        priority: 'medium',
        assignee: 'Mike Johnson',
        tags: ['backend'],
        createdAt: new Date(),
      },
      'task-7': {
        id: 'task-7',
        title: 'Another todo item',
        status: 'todo',
        priority: 'low',
        assignee: 'Sarah Wilson',
        tags: ['documentation'],
        createdAt: new Date(),
      },
      'task-8': {
        id: 'task-8',
        title: 'In progress task 2',
        status: 'in-progress',
        priority: 'high',
        assignee: 'John Doe',
        tags: ['feature'],
        createdAt: new Date(),
      },
      'task-9': {
        id: 'task-9',
        title: 'In progress task 3',
        status: 'in-progress',
        priority: 'medium',
        assignee: 'Jane Smith',
        tags: ['bugfix'],
        createdAt: new Date(),
      },
      'task-10': {
        id: 'task-10',
        title: 'Review task',
        status: 'review',
        priority: 'medium',
        assignee: 'Tom Brown',
        tags: ['testing'],
        createdAt: new Date(),
      },
    },
    onTaskMove: () => {},
    onTaskCreate: () => {},
    onTaskUpdate: () => {},
    onTaskDelete: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstration of WIP (Work In Progress) limits. Columns show warnings when approaching or exceeding their task limits.',
      },
    },
  },
};