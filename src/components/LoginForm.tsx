"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { Icon } from "./Icon";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const { error: signInError } =
        await getSupabaseBrowserClient().auth.signInWithPassword({ email, password });

      if (signInError) {
        setError("Email hoặc mật khẩu không chính xác. Vui lòng thử lại.");
        return;
      }

      router.replace("/tasks");
    } catch {
      setError("Không thể đăng nhập lúc này. Vui lòng kiểm tra kết nối và thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#f8f9ff] text-[#0b1c30]">
      <header className="relative z-10 hidden w-full bg-white/80 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl sm:block">
        <div className="mx-auto flex h-16 max-w-[1040px] items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Image
              alt="Logo Việc học của tôi"
              className="h-9 w-9 rounded-xl"
              height={48}
              priority
              src="/images/logo1.png"
              width={48}
            />
            <span className="font-semibold tracking-tight sm:text-lg">Việc học của tôi</span>
          </div>
        </div>
      </header>

      <main className="relative flex flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-28 left-1/2 h-[350px] w-[600px] -translate-x-1/2 rounded-full bg-[#2563eb]/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[8%] top-1/2 hidden h-[300px] w-[300px] rounded-full bg-[#6cf8bb]/25 blur-3xl sm:block"
        />

        <div className="relative z-10 w-full max-w-[460px]">
          <div className="mb-6 flex flex-col items-center text-center sm:hidden">
            <div className="relative mb-3 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#e5eeff] shadow-sm">
              <Image
                alt=""
                className="h-14 w-14 rounded-xl"
                height={48}
                priority
                src="/images/logo1.png"
                width={48}
              />
              <span className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#6cf8bb] text-[#00714d] shadow-sm">
                <Icon name="check" className="h-4 w-4" />
              </span>
            </div>
            <p className="mb-1 text-sm font-semibold text-[#0b1c30]">Việc học của tôi</p>
            <h1 className="text-xl font-bold tracking-tight">Đăng nhập</h1>
            <p className="mt-1 max-w-xs text-sm leading-5 text-slate-600">
              Quản lý việc học mỗi ngày, nâng cao hiệu suất và tập trung học tập
            </p>
          </div>

          <div className="mb-4 hidden justify-center sm:flex">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#dce9ff] px-4 py-2 text-xs font-medium text-[#004ac6] sm:text-sm">
              <Icon name="school" className="h-4 w-4" />
              Cổng học tập cá nhân sinh viên
            </span>
          </div>

          <section className="rounded-2xl bg-white p-5 shadow-[0_20px_40px_-15px_rgba(11,28,48,0.07),0_1px_3px_rgba(0,0,0,0.04)] sm:p-10">
            <div className="mb-5 flex items-center gap-2 rounded-xl bg-[#eff4ff] px-3 py-2.5 text-sm font-medium text-[#004ac6] sm:hidden">
              <Icon name="book" className="h-5 w-5 shrink-0" />
              Sẵn sàng hoàn thành bài tập hôm nay?
            </div>
            <div className="mb-7 hidden text-center sm:block">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-[28px]">
                Đăng nhập tài khoản
              </h1>
              <p className="mt-1 text-sm text-slate-600 sm:text-base">
                Chào mừng bạn quay lại với Việc học của tôi
              </p>
            </div>

            <form autoComplete="on" onSubmit={handleSubmit}>
              <div className="space-y-4 sm:space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold">Email</span>
                  <span className="relative block">
                    <Icon
                      name="mail"
                      className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      autoComplete="email"
                      className="h-12 w-full rounded-xl border border-[#c3c6d7]/70 bg-[#eff4ff] pl-12 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#004ac6] focus:bg-white focus:ring-2 focus:ring-[#004ac6]/15 sm:h-14 sm:bg-white"
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="nhapemail@sinhvien.edu.vn"
                      required
                      type="email"
                      value={email}
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold">Mật khẩu</span>
                  <span className="relative block">
                    <Icon
                      name="lock"
                      className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      autoComplete="current-password"
                      className="h-12 w-full rounded-xl border border-[#c3c6d7]/70 bg-[#eff4ff] pl-12 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#004ac6] focus:bg-white focus:ring-2 focus:ring-[#004ac6]/15 sm:h-14 sm:bg-white"
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Nhập mật khẩu"
                      required
                      type={showPassword ? "text" : "password"}
                      value={password}
                    />
                    <button
                      aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                      aria-pressed={showPassword}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
                      onClick={() => setShowPassword((visible) => !visible)}
                      type="button"
                    >
                      <Icon name={showPassword ? "eyeOff" : "eye"} className="h-5 w-5" />
                    </button>
                  </span>
                </label>
              </div>

              <button
                className="mt-7 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-4 text-base font-semibold text-white shadow-sm transition hover:bg-[#004ac6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004ac6] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
                {!isSubmitting && <Icon name="arrow" className="h-5 w-5" />}
              </button>

              {error && (
                <p
                  aria-live="assertive"
                  className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-center text-sm leading-5 text-[#ba1a1a]"
                  role="alert"
                >
                  {error}
                </p>
              )}
            </form>
          </section>

          <p className="mt-4 flex items-center justify-center gap-2 px-2 text-center text-xs font-medium text-slate-600">
            <Icon name="shield" className="h-4 w-4 shrink-0 text-[#00714d]" />
            Thông tin đăng nhập được xác thực qua Supabase
          </p>
        </div>
      </main>
    </div>
  );
}
