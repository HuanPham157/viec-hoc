"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { z } from "zod";
import {
  getSupabaseBrowserClient,
  isSupabaseBrowserConfigured,
} from "@/lib/supabase-browser";
import { Icon } from "./Icon";
import { TaskForm } from "./TaskForm";
import { TaskList } from "./TaskList";
import type { Task, TaskFilter } from "./task-types";

const taskListResponseSchema = z.object({
  data: z.array(z.object({
    id: z.string(),
    title: z.string(),
    is_done: z.boolean(),
    created_at: z.string(),
  })),
});
const apiErrorSchema = z.object({ error: z.string() });

class TaskApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

async function apiFetch(
  path: string,
  init: RequestInit,
  onUnauthorized: () => void,
): Promise<unknown> {
  let session: Session | null;
  try {
    const { data, error } = await getSupabaseBrowserClient().auth.getSession();
    if (error) throw new TaskApiError("Không thể xác minh phiên đăng nhập.", 0);
    session = data.session;
  } catch (error) {
    if (error instanceof TaskApiError) throw error;
    throw new TaskApiError("Không thể xác minh phiên đăng nhập.", 0);
  }

  if (!session) {
    onUnauthorized();
    throw new TaskApiError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", 401);
  }

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${session.access_token}`);
  if (init.body !== undefined) headers.set("Content-Type", "application/json");

  let response: Response;
  try {
    response = await fetch(path, { ...init, headers, cache: "no-store" });
  } catch {
    throw new TaskApiError("Không thể kết nối đến máy chủ. Vui lòng thử lại.", 0);
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    if (response.ok) {
      throw new TaskApiError("Phản hồi từ máy chủ không hợp lệ.", response.status);
    }
    body = null;
  }

  if (!response.ok) {
    if (response.status === 401) {
      onUnauthorized();
      throw new TaskApiError(
        "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.",
        response.status,
      );
    }
    const parsedError = apiErrorSchema.safeParse(body);
    throw new TaskApiError(
      parsedError.success ? parsedError.data.error : "Lỗi xử lý yêu cầu.",
      response.status,
    );
  }

  return body;
}

export function TaskDashboard() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [authError, setAuthError] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState("");
  const mutationLock = useRef(false);
  const isSupabaseConfigured = isSupabaseBrowserConfigured();

  const redirectToLogin = useCallback(() => {
    setSession(null);
    setTasks([]);
    setFilter("all");
    setIsLoading(false);
    router.replace("/login");
  }, [router]);

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const body = await apiFetch("/api/tasks", {}, redirectToLogin);
      const parsed = taskListResponseSchema.safeParse(body);
      if (!parsed.success) {
        throw new TaskApiError("Dữ liệu công việc từ máy chủ không hợp lệ.", 0);
      }
      setTasks(parsed.data.data);
      return true;
    } catch (loadError) {
      setTasks([]);
      setError(
        loadError instanceof TaskApiError
          ? loadError.message
          : "Không tải được danh sách công việc. Vui lòng thử lại.",
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [redirectToLogin]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let isActive = true;
    let authStateChanged = false;
    let loadTasksTimer: ReturnType<typeof setTimeout> | undefined;
    const supabase = getSupabaseBrowserClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (event === "INITIAL_SESSION") return;
      authStateChanged = true;
      if (!isActive) return;

      setSession(nextSession);
      setIsAuthReady(true);
      setAuthError("");

      if (!nextSession) {
        setTasks([]);
        setFilter("all");
        setIsLoading(false);
        router.replace("/login");
      } else {
        if (loadTasksTimer) clearTimeout(loadTasksTimer);
        loadTasksTimer = setTimeout(() => {
          loadTasksTimer = undefined;
          if (isActive) void loadTasks();
        }, 0);
      }
    });

    void supabase.auth
      .getSession()
      .then(({ data: { session: currentSession }, error }) => {
        if (!isActive || authStateChanged) return;
        if (error) {
          setAuthError("Không thể kiểm tra phiên đăng nhập. Vui lòng tải lại trang.");
          setIsAuthReady(true);
          setIsLoading(false);
          return;
        }

        setSession(currentSession);
        setIsAuthReady(true);
        if (!currentSession) {
          redirectToLogin();
          return;
        }
        void loadTasks();
      })
      .catch(() => {
        if (!isActive || authStateChanged) return;
        setAuthError("Không thể kiểm tra phiên đăng nhập. Vui lòng tải lại trang.");
        setIsAuthReady(true);
        setIsLoading(false);
      });

    return () => {
      isActive = false;
      if (loadTasksTimer) clearTimeout(loadTasksTimer);
      subscription.unsubscribe();
    };
  }, [isSupabaseConfigured, loadTasks, redirectToLogin, router]);

  const completedCount = tasks.filter((task) => task.is_done).length;

  async function runMutation(path: string, init: RequestInit) {
    if (mutationLock.current) return false;
    mutationLock.current = true;
    setIsMutating(true);
    setError("");

    try {
      await apiFetch(path, init, redirectToLogin);
      await loadTasks();
      return true;
    } catch (mutationError) {
      setError(
        mutationError instanceof TaskApiError
          ? mutationError.message
          : "Không thể cập nhật công việc. Vui lòng thử lại.",
      );
      return false;
    } finally {
      mutationLock.current = false;
      setIsMutating(false);
    }
  }

  function addTask(title: string) {
    setFilter("all");
    return runMutation("/api/tasks", {
      method: "POST",
      body: JSON.stringify({ title }),
    });
  }

  function toggleTask(id: string) {
    const task = tasks.find((item) => item.id === id);
    if (!task) return Promise.resolve(false);
    return runMutation(`/api/tasks/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ is_done: !task.is_done }),
    });
  }

  function deleteTask(id: string, title: string) {
    if (!window.confirm(`Bạn có chắc muốn xóa công việc "${title}" không?`)) {
      return Promise.resolve(false);
    }
    return runMutation(`/api/tasks/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  }

  function editTask(id: string, title: string) {
    return runMutation(`/api/tasks/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ title }),
    });
  }

  async function signOut() {
    setIsSigningOut(true);
    setSignOutError("");

    try {
      const { error } = await getSupabaseBrowserClient().auth.signOut();
      if (error) {
        setSignOutError("Không thể đăng xuất lúc này. Vui lòng thử lại.");
        return;
      }

      setTasks([]);
      setFilter("all");
      setSession(null);
      router.replace("/login");
    } catch {
      setSignOutError("Không thể đăng xuất lúc này. Vui lòng thử lại.");
    } finally {
      setIsSigningOut(false);
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f9ff] px-4 text-center text-sm text-slate-600">
        Chưa cấu hình kết nối Supabase. Vui lòng kiểm tra cấu hình môi trường.
      </main>
    );
  }

  if (!isAuthReady || !session) {
    return (
      <main
        aria-busy={!isAuthReady}
        className="flex min-h-screen items-center justify-center bg-[#f8f9ff] px-4 text-center text-sm text-slate-600"
      >
        {authError || "Đang kiểm tra phiên đăng nhập..."}
      </main>
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
            <button
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-[#e5eeff] hover:text-[#0b1c30] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSigningOut || isMutating}
              onClick={signOut}
              type="button"
            >
              {isSigningOut ? "Đang đăng xuất..." : "Đăng xuất"}
            </button>
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
            <button
              aria-label="Đăng xuất"
              className="ml-1 rounded-lg p-2 text-[#ba1a1a] transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 sm:hidden"
              disabled={isSigningOut || isMutating}
              onClick={signOut}
              title="Đăng xuất"
              type="button"
            >
              <Icon name="logout" className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[840px] flex-col gap-5 px-4 pb-12 pt-20 sm:gap-6 sm:px-6 sm:pt-24">
        {signOutError && (
          <p
            className="rounded-lg bg-red-50 px-3 py-2 text-sm text-[#ba1a1a]"
            role="alert"
          >
            {signOutError}
          </p>
        )}
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

        <TaskForm isBusy={isMutating || isLoading} onAdd={addTask} />

        {isLoading ? (
          <p
            aria-live="polite"
            className="rounded-2xl bg-white px-5 py-12 text-center text-sm text-slate-600 shadow-sm"
            role="status"
          >
            Đang tải danh sách công việc...
          </p>
        ) : error ? (
          <div className="rounded-2xl bg-white px-5 py-8 text-center shadow-sm">
            <p className="text-sm text-[#ba1a1a]" role="alert">{error}</p>
            <button
              className="mt-4 rounded-lg bg-[#004ac6] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#003ea8] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isMutating}
              onClick={() => void loadTasks()}
              type="button"
            >
              Thử tải lại
            </button>
          </div>
        ) : (
          <TaskList
            filter={filter}
            isBusy={isMutating}
            onDelete={deleteTask}
            onEdit={editTask}
            onFilterChange={setFilter}
            onToggle={toggleTask}
            tasks={tasks}
          />
        )}

        <footer className="border-t border-[#dce9ff] pt-5 text-center text-xs leading-5 text-slate-500">
          Việc học của tôi · Nền tảng học tập và quản lý kế hoạch cá nhân
        </footer>
      </main>
    </div>
  );
}
