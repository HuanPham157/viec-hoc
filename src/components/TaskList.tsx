"use client";

import { Icon } from "./Icon";
import { TaskItem } from "./TaskItem";
import type { Task, TaskFilter } from "./task-types";

type TaskListProps = {
  tasks: Task[];
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  onToggle: (id: string) => Promise<boolean>;
  onDelete: (id: string, title: string) => Promise<boolean>;
  onEdit: (id: string, title: string) => Promise<boolean>;
  isBusy: boolean;
};

const filterOptions: { id: TaskFilter; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "pending", label: "Chưa xong" },
  { id: "done", label: "Đã xong" },
];

export function TaskList({
  tasks,
  filter,
  onFilterChange,
  onToggle,
  onDelete,
  onEdit,
  isBusy,
}: TaskListProps) {
  const pendingCount = tasks.filter((task) => !task.is_done).length;
  const completedCount = tasks.length - pendingCount;
  const visibleTasks = tasks.filter((task) => {
    if (filter === "pending") return !task.is_done;
    if (filter === "done") return task.is_done;
    return true;
  });

  return (
    <section aria-label="Danh sách công việc" className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          aria-label="Lọc công việc"
          className="inline-flex w-full rounded-full bg-[#e5eeff] p-1 sm:w-fit"
          role="group"
        >
          {filterOptions.map((option) => {
            const count =
              option.id === "all"
                ? tasks.length
                : option.id === "pending"
                  ? pendingCount
                  : completedCount;
            return (
              <button
                aria-pressed={filter === option.id}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none sm:px-4 sm:text-sm ${
                  filter === option.id
                    ? "bg-[#004ac6] text-white shadow-sm"
                    : "text-[#0b1c30] hover:bg-white/70"
                }`}
                key={option.id}
                disabled={isBusy}
                onClick={() => onFilterChange(option.id)}
                type="button"
              >
                {option.label}
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                    filter === option.id
                      ? "bg-white/20 text-white"
                      : "bg-[#dbe8ff] text-[#004ac6]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
        <p className="flex items-center gap-1.5 text-xs text-slate-600">
          <Icon name="shield" className="h-4 w-4 text-[#00714d]" />
          Công việc được đồng bộ với tài khoản của bạn
        </p>
      </div>

      {visibleTasks.length > 0 ? (
        <ul className="space-y-2">
          {visibleTasks.map((task) => (
            <TaskItem
              key={task.id}
              onDelete={onDelete}
              onEdit={onEdit}
              onToggle={onToggle}
              isBusy={isBusy}
              task={task}
            />
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl bg-white px-5 py-12 text-center shadow-sm">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#dbe8ff] text-[#004ac6]">
            <Icon name="book" className="h-7 w-7" />
          </span>
          <h2 className="mt-4 text-base font-semibold text-[#0b1c30]">
            {filter === "all" ? "Chưa có công việc nào!" : "Không có công việc phù hợp"}
          </h2>
          <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-slate-600">
            {filter === "all"
              ? "Hãy thêm công việc học tập đầu tiên của bạn để bắt đầu ngày mới thật hiệu quả."
              : "Thử chọn bộ lọc khác để xem danh sách công việc."}
          </p>
        </div>
      )}
    </section>
  );
}
