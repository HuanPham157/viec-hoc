"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "./Icon";
import type { Task } from "./task-types";

type TaskItemProps = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string, title: string) => void;
  onEdit: (id: string, title: string) => void;
};

export function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [error, setError] = useState("");

  function handleEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (cleanTitle.length < 1 || cleanTitle.length > 120) {
      setError("Tên công việc phải dài từ 1 đến 120 ký tự.");
      return;
    }
    onEdit(task.id, cleanTitle);
    setError("");
    setIsEditing(false);
  }

  return (
    <li
      className={`flex items-start gap-3 rounded-2xl px-4 py-4 transition sm:items-center sm:px-5 ${
        task.is_done ? "bg-[#eff4ff]" : "bg-white"
      }`}
      data-testid="task-item"
    >
      <button
        aria-label={
          task.is_done ? `Đánh dấu chưa xong: ${task.title}` : `Đánh dấu đã xong: ${task.title}`
        }
        aria-pressed={task.is_done}
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004ac6] sm:mt-0 ${
          task.is_done
            ? "border-[#00714d] bg-[#00714d] text-white"
            : "border-[#c3c6d7] bg-white text-transparent hover:border-[#004ac6]"
        }`}
        onClick={() => onToggle(task.id)}
        type="button"
      >
        {task.is_done && <Icon name="check" className="h-4 w-4" />}
      </button>

      <div className="min-w-0 flex-1">
        {isEditing ? (
          <>
            <form className="flex gap-2" onSubmit={handleEdit}>
              <label className="sr-only" htmlFor={`edit-${task.id}`}>
                Chỉnh sửa tên công việc
              </label>
              <input
                aria-describedby={error ? `edit-error-${task.id}` : undefined}
                aria-invalid={Boolean(error)}
                autoFocus
                className="min-w-0 flex-1 rounded-lg border border-blue-200 bg-white px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                id={`edit-${task.id}`}
                onChange={(event) => {
                  setTitle(event.target.value);
                  if (error) setError("");
                }}
                value={title}
              />
              <button
                className="rounded-lg bg-[#004ac6] px-3 py-1 text-xs font-semibold text-white hover:bg-[#003ea8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004ac6]"
                type="submit"
              >
                Lưu
              </button>
              <button
                aria-label="Hủy chỉnh sửa"
                className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-[#004ac6]"
                onClick={() => {
                  setTitle(task.title);
                  setError("");
                  setIsEditing(false);
                }}
                type="button"
              >
                <Icon name="close" className="h-4 w-4" />
              </button>
            </form>
            {error && (
              <p
                className="mt-1 text-xs text-[#ba1a1a]"
                id={`edit-error-${task.id}`}
                role="alert"
              >
                {error}
              </p>
            )}
          </>
        ) : (
          <>
            <p
              className={`text-[15px] font-medium leading-6 sm:text-base ${
                task.is_done ? "text-slate-500 line-through" : "text-[#0b1c30]"
              }`}
            >
              {task.title}
            </p>
            <div className="mt-2 flex items-center gap-1.5 text-xs">
              {task.is_done ? (
                <>
                  <Icon name="check" className="h-4 w-4 text-[#00714d]" />
                  <span className="font-medium text-[#00714d]">Đã xong</span>
                </>
              ) : (
                <>
                  <Icon name="book" className="h-4 w-4 text-[#004ac6]" />
                  <span className="font-medium text-[#004ac6]">Chưa xong</span>
                </>
              )}
            </div>
          </>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <button
          aria-label={`Sửa ${task.title}`}
          className="rounded-lg p-2 text-slate-600 transition hover:bg-blue-50 hover:text-[#004ac6] focus-visible:outline-2 focus-visible:outline-[#004ac6]"
          onClick={() => {
            setTitle(task.title);
            setError("");
            setIsEditing(true);
          }}
          type="button"
        >
          <Icon name="edit" className="h-5 w-5" />
        </button>
        <button
          aria-label={`Xóa ${task.title}`}
          className="rounded-lg p-2 text-[#ba1a1a] transition hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-[#ba1a1a]"
          onClick={() => onDelete(task.id, task.title)}
          type="button"
        >
          <Icon name="trash" className="h-5 w-5" />
        </button>
      </div>
    </li>
  );
}
