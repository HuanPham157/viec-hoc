import { z } from 'zod';
import { authRequest } from '@/lib/auth-request';

const json = (body: unknown, status = 200) =>
  Response.json(body, {
    status, headers: { 'Cache-Control': 'no-store' }
  });
const idSchema = z.string().uuid();
const input = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  is_done: z.boolean().optional()
}).strict().refine((value) => value.title !== undefined || value.is_done !== undefined);

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const auth = await authRequest(request);
    if (!auth) return json({ error: 'Chưa đăng nhập' }, 401);

    const { id } = await params;
    if (!idSchema.safeParse(id).success)
      return json({ error: 'ID công việc không hợp lệ' }, 400);

    const parsed = input.safeParse(
      await request.json().catch(() => null)
    );
    if (!parsed.success)
      return json({ error: 'Dữ liệu cập nhật không hợp lệ' }, 400);

    const { data, error } = await auth.db.from('tasks')
      .update(parsed.data)
      .eq('id', id)
      .eq('user_id', auth.user.id)
      .select('id,title,is_done,created_at')
      .maybeSingle();
    if (error) return json({ error: 'Lỗi xử lý yêu cầu' }, 500);
    if (!data) return json({ error: 'Không tìm thấy công việc' }, 404);
    return json({ data });
  } catch {
    return json({ error: 'Lỗi xử lý yêu cầu' }, 500);
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  try {
    const auth = await authRequest(request);
    if (!auth) return json({ error: 'Chưa đăng nhập' }, 401);

    const { id } = await params;
    if (!idSchema.safeParse(id).success)
      return json({ error: 'ID công việc không hợp lệ' }, 400);

    const { data, error } = await auth.db.from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', auth.user.id)
      .select('id')
      .maybeSingle();
    if (error) return json({ error: 'Lỗi xử lý yêu cầu' }, 500);
    if (!data) return json({ error: 'Không tìm thấy công việc' }, 404);
    return json({ data });
  } catch {
    return json({ error: 'Lỗi xử lý yêu cầu' }, 500);
  }
}
