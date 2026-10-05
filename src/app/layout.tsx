import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Việc học của tôi",
  description: "Quản lý kế hoạch và công việc học tập cá nhân.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
