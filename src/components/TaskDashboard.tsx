"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "./Icon";
import { TaskForm } from "./TaskForm";
import { TaskList } from "./TaskList";
import { initialTasks, type Task, type TaskFilter } from "./task-types";

export function TaskDashboard() {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState<TaskFilter>("all");

  const completedCount = tasks.filter((task) => task.is_done).length;

  function addTask(title: string) {
    const cleanTitle = title.trim();
    if (cleanTitle.length < 1 || cleanTitle.length > 120) return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: cleanTitle,
      is_done: false,
    };
    setTasks((currentTasks) => [newTask, ...currentTasks]);
    setFilter("all");
  }

  function toggleTask(id: string) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, is_done: !task.is_done } : task,
      ),
    );
  }

  function deleteTask(id: string, title: string) {
    if (!window.confirm(`Bạn có chắc muốn xóa công việc "${title}" không?`)) return;
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  }

  function editTask(id: string, title: string) {
    const cleanTitle = title.trim();
    if (cleanTitle.length < 1 || cleanTitle.length > 120) return;
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, title: cleanTitle } : task,
      ),
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30]">
      <header className="fixed inset-x-0 top-0 z-20 border-b border-slate-100/70 bg-[#f8f9ff]/90 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[840px] items-center justify-between gap-3 px-4 sm:px-6">
          <Link
            aria-label="Việc học của tôi - Danh sách công việc"
            className="flex shrink-0 items-center gap-2"
            href="/tasks"
          >
            <Image
              alt="Logo Việc học của tôi"
              className="h-9 w-9 rounded-xl"
              height={48}
              priority
              src="/images/logo1.png"
              width={48}
            />
            <span className="text-[15px] font-semibold tracking-tight sm:text-lg">
              Việc học của tôi
            </span>
          </Link>

          <nav aria-label="Điều hướng chính" className="hidden items-center gap-1 sm:flex">
            <Link
              aria-current="page"
              className="rounded-lg bg-[#e5eeff] px-3 py-2 text-sm font-semibold text-[#004ac6]"
              href="/tasks"
            >
              Danh sách công việc
            </Link>
            <Link
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-[#e5eeff] hover:text-[#0b1c30]"
              href="/login"
            >
              Đăng nhập
            </Link>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <Image
              alt="Ảnh đại diện học sinh"
              className="h-9 w-9 rounded-full object-cover"
              height={48}
              src="/images/avatar.png"
              width={48}
            />
            <span className="hidden text-sm font-medium md:inline">Học sinh</span>
            <Link
              aria-label="Đăng nhập"
              className="ml-1 rounded-lg p-2 text-[#ba1a1a] transition hover:bg-red-50 sm:hidden"
              href="/login"
              title="Đăng nhập"
            >
              <Icon name="logout" className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[840px] flex-col gap-5 px-4 pb-12 pt-20 sm:gap-6 sm:px-6 sm:pt-24">
        <section className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm sm:hidden">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#004ac6]/10 text-[#004ac6]">
              <Icon name="school" className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-600">Kế hoạch hôm nay</p>
              <h1 className="truncate text-lg font-bold tracking-tight">Việc học của tôi</h1>
            </div>
          </div>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-[#6cf8bb]/50 px-2.5 py-1.5 text-xs font-semibold text-[#00714d]">
            <Icon name="check" className="h-4 w-4" />
            {completedCount}/{tasks.length}
          </span>
        </section>

        <section className="hidden items-end justify-between gap-4 sm:flex">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-medium text-[#004ac6]">
              <Icon name="calendar" className="h-4 w-4" />
              Kế hoạch học tập cá nhân
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">
              Công việc học tập hôm nay
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Quản lý tiến độ và lịch tự học cá nhân một cách nhẹ nhàng, tập trung.
            </p>
          </div>
          <span className="mb-1 flex shrink-0 items-center gap-1.5 rounded-full bg-[#6cf8bb]/50 px-3 py-2 text-sm font-semibold text-[#00714d]">
            <Icon name="check" className="h-4 w-4" />
            {completedCount}/{tasks.length} Đã xong
          </span>
        </section>

        <TaskForm onAdd={addTask} />

        <TaskList
          filter={filter}
          onDelete={deleteTask}
          onEdit={editTask}
          onFilterChange={setFilter}
          onToggle={toggleTask}
          tasks={tasks}
        />

        <footer className="border-t border-[#dce9ff] pt-5 text-center text-xs leading-5 text-slate-500">
          Việc học của tôi · Nền tảng học tập và quản lý kế hoạch cá nhân
        </footer>
      </main>
    </div>
  );
}
