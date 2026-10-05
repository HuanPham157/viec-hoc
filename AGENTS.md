<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Ghi chú quy trình làm việc

- Sử dụng App Router của Next.js và các dependency đã được cài đặt trong dự án. Trước khi thay đổi API của framework, hãy xem tài liệu Next.js tương ứng trong phiên bản đang cài; không thêm dependency trừ khi công việc yêu cầu.
- Coi `design/stitch/` là nguồn tham chiếu chính cho bố cục, màu sắc, kiểu chữ, khoảng cách và tài nguyên giao diện.
- Không đọc, in hoặc tiết lộ nội dung `.env.local` dưới bất kỳ hình thức nào.
- Không ghi mật khẩu, access token hoặc thông tin xác thực khác vào log.
- Sau mỗi thay đổi, nêu cách kiểm tra và báo cáo rõ những bước kiểm tra thực tế đã chạy.