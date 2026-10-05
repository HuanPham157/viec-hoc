"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Icon } from "./Icon";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Đây là giao diện mẫu. Thông tin đăng nhập không được gửi hoặc lưu lại.");
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#f8f9ff] text-[#0b1c30]">
      <header className="relative z-10 hidden w-full bg-white/80 shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl sm:block">
        <div className="mx-auto flex h-16 max-w-[1040px] items-center justify-between gap-4 px-4 sm:px-6">
          <Link className="flex items-center gap-2" href="/tasks">
            <Image
              alt="Logo Việc học của tôi"
              className="h-9 w-9 rounded-xl"
              height={48}
              priority
              src="/images/logo1.png"
              width={48}
            />
            <span className="font-semibold tracking-tight sm:text-lg">Việc học của tôi</span>
          </Link>
          <nav aria-label="Điều hướng chính" className="flex items-center gap-1">
            <Link
              className="rounded-lg px-2.5 py-2 text-xs font-medium text-slate-600 transition hover:bg-[#e5eeff] hover:text-[#0b1c30] sm:px-4 sm:text-sm"
              href="/tasks"
            >
              Danh sách công việc
            </Link>
            <span
              aria-current="page"
              className="rounded-lg bg-[#e5eeff] px-2.5 py-2 text-xs font-semibold text-[#004ac6] sm:px-4 sm:text-sm"
            >
              Đăng nhập
            </span>
          </nav>
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

            <form autoComplete="off" onSubmit={handleSubmit}>
              <div className="space-y-4 sm:space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold">Email</span>
                  <span className="relative block">
                    <Icon
                      name="mail"
                      className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
                    />
                    <input
                      autoComplete="off"
                      className="h-12 w-full rounded-xl border border-[#c3c6d7]/70 bg-[#eff4ff] pl-12 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#004ac6] focus:bg-white focus:ring-2 focus:ring-[#004ac6]/15 sm:h-14 sm:bg-white"
                      placeholder="nhapemail@sinhvien.edu.vn"
                      type="email"
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
                      autoComplete="off"
                      className="h-12 w-full rounded-xl border border-[#c3c6d7]/70 bg-[#eff4ff] pl-12 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#004ac6] focus:bg-white focus:ring-2 focus:ring-[#004ac6]/15 sm:h-14 sm:bg-white"
                      placeholder="Nhập mật khẩu"
                      type={showPassword ? "text" : "password"}
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

              <div className="mt-5 flex items-center justify-between gap-3 text-xs sm:text-sm">
                <label className="flex cursor-pointer items-center gap-2 text-slate-600">
                  <input
                    className="h-4 w-4 rounded border-[#c3c6d7] accent-[#004ac6]"
                    type="checkbox"
                  />
                  Ghi nhớ đăng nhập
                </label>
                <span className="font-medium text-[#004ac6]">Quên mật khẩu?</span>
              </div>

              <button
                className="mt-7 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-4 text-base font-semibold text-white shadow-sm transition hover:bg-[#004ac6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004ac6]"
                type="submit"
              >
                Đăng nhập
                <Icon name="arrow" className="h-5 w-5" />
              </button>

              <div className="my-5 flex items-center gap-3 text-center">
                <span className="h-px flex-1 bg-[#dce9ff]" />
                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  <span className="sm:hidden">Hoặc tiếp tục với</span>
                  <span className="hidden sm:inline">Hệ thống quản lý học tập</span>
                </span>
                <span className="h-px flex-1 bg-[#dce9ff]" />
              </div>

              <div className="mb-5 grid grid-cols-2 gap-2 sm:hidden">
                <button
                  className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#eff4ff] text-sm font-medium text-[#0b1c30] transition hover:bg-[#e5eeff]"
                  onClick={() =>
                    setMessage("Đây là giao diện mẫu. Đăng nhập qua Cổng Đào tạo chưa được kết nối.")
                  }
                  type="button"
                >
                  <Icon name="school" className="h-4 w-4 text-[#004ac6]" />
                  Cổng Đào tạo
                </button>
                <button
                  className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#eff4ff] text-sm font-medium text-[#0b1c30] transition hover:bg-[#e5eeff]"
                  onClick={() =>
                    setMessage("Đây là giao diện mẫu. Đăng nhập Google Edu chưa được kết nối.")
                  }
                  type="button"
                >
                  <Icon name="mail" className="h-4 w-4 text-[#004ac6]" />
                  Google Edu
                </button>
              </div>

              <p className="text-center text-sm text-slate-600 sm:text-base">
                Chưa có tài khoản?{" "}
                <span className="font-semibold text-[#004ac6]">Đăng ký ngay ›</span>
              </p>

              {message && (
                <p
                  aria-live="polite"
                  className="mt-4 rounded-lg bg-[#eff4ff] px-3 py-2 text-center text-xs leading-5 text-[#004ac6]"
                >
                  {message}
                </p>
              )}
            </form>
          </section>

          <p className="mt-4 flex items-center justify-center gap-2 px-2 text-center text-xs font-medium text-slate-600">
            <Icon name="shield" className="h-4 w-4 shrink-0 text-[#00714d]" />
            Giao diện minh họa · Không lưu hoặc gửi mật khẩu
          </p>
          <p className="mt-3 text-center text-sm">
            <Link
              className="font-semibold text-[#004ac6] underline-offset-4 hover:underline"
              href="/tasks"
            >
              Xem giao diện công việc
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
