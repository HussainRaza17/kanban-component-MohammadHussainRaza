import type { Meta, StoryObj } from "@storybook/react";
import { KanbanBoard } from "./KanbanBoard";
import type { KanbanBoardProps } from "./Kanban.types";

const meta: Meta<typeof KanbanBoard> = {
  title: "Kanban/Board",
  component: KanbanBoard,
};

export default meta;
type Story = StoryObj<KanbanBoardProps>;

export const Default: Story = {
  args: {
    columns: [
      { id: "todo", title: "To Do", color: "#ccc", taskIds: ["1", "2"] },
      { id: "progress", title: "In Progress", color: "#ccc", taskIds: ["3"] },
      { id: "done", title: "Done", color: "#ccc", taskIds: ["4"] },
    ],
    tasks: {
      "1": { id: "1", title: "Task One", status: "todo", createdAt: "" },
      "2": { id: "2", title: "Task Two", status: "todo", createdAt: "" },
      "3": {
        id: "3",
        title: "Working on Kanban UI",
        status: "progress",
        createdAt: "",
      },
      "4": { id: "4", title: "Finished Project", status: "done", createdAt: "" },
    },
    onTaskMove: () => {},
    onTaskCreate: () => {},
    onTaskUpdate: () => {},
    onTaskDelete: () => {},
  },
};
