export type Task = {
  id: string;
  title: string;
  is_done: boolean;
};

export type TaskFilter = "all" | "pending" | "done";
