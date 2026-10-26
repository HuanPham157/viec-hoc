"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "./Icon";

export function TaskForm({
  onAdd,
  isBusy,
}: {
  onAdd: (title: string) => Promise<boolean>;
  isBusy: boolean;
}) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (cleanTitle.length < 1 || cleanTitle.length > 120) {
      setError("Tên công việc phải dài từ 1 đến 120 ký tự.");
      return;
    }
    if (await onAdd(cleanTitle)) {
      setTitle("");
      setError("");
    }
  }

  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm sm:p-4">
      <form className="flex gap-2 sm:gap-3" onSubmit={handleSubmit}>
        <div className="min-w-0 flex-1">
          <label className="relative block">
            <span className="sr-only" id="task-title-label">
              Tên công việc cần học
            </span>
            <Icon
              name="edit"
              className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
            />
            <input
              aria-describedby={error ? "task-title-error" : undefined}
              aria-invalid={Boolean(error)}
              className={`h-12 w-full rounded-xl bg-[#eff4ff] py-2 pl-11 pr-3 text-sm text-[#0b1c30] outline-none transition placeholder:text-slate-500 focus:bg-white focus:ring-2 focus:ring-blue-200 sm:h-14 sm:text-base ${
                error ? "ring-2 ring-red-300" : ""
              }`}
              id="task-title"
              disabled={isBusy}
              onChange={(event) => {
                setTitle(event.target.value);
                if (error) setError("");
              }}
              placeholder="Tên công việc (ví dụ: Làm bài tập Toán...)"
              value={title}
            />
          </label>
          {error && (
            <p className="mt-1.5 text-xs text-[#ba1a1a]" id="task-title-error" role="alert">
              {error}
            </p>
          )}
        </div>
        <button
          aria-label="Thêm công việc"
          className="flex h-12 w-12 shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-[#004ac6] px-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#003ea8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004ac6] disabled:cursor-not-allowed disabled:opacity-60 sm:h-14 sm:w-auto sm:px-5"
          disabled={isBusy}
          type="submit"
        >
          <Icon name="plus" className="h-5 w-5" />
          <span className="hidden sm:inline">Thêm công việc</span>
        </button>
      </form>
    </div>
  );
}
