import { createClient } from "@supabase/supabase-js";
import { expect, test } from "@playwright/test";

const requiredAccountEnv = [
  "TEST_EMAIL_A",
  "TEST_PASSWORD_A",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
] as const;
const missingAccountEnv = requiredAccountEnv.filter(
  (name) => !process.env[name],
);
const accountSkipReason = missingAccountEnv.length
  ? `Missing required .env.local variables: ${missingAccountEnv.join(", ")}`
  : undefined;

function getSupabaseTestClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !publishableKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY for API test.",
    );
  }

  return createClient(supabaseUrl, publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function getTestAccessToken() {
  const email = process.env.TEST_EMAIL_A;
  const password = process.env.TEST_PASSWORD_A;
  if (!email || !password) {
    throw new Error("Missing TEST_EMAIL_A or TEST_PASSWORD_A in .env.local.");
  }

  const supabase = getSupabaseTestClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error || !data.session?.access_token) {
    const details = error
      ? [
          "code" in error && typeof error.code === "string"
            ? `code=${error.code}`
            : undefined,
          "status" in error && typeof error.status === "number"
            ? `status=${error.status}`
            : undefined,
        ]
          .filter(Boolean)
          .join(", ")
      : "no session returned";
    throw new Error(
      `Could not authenticate the configured Playwright test account (${details}).`,
    );
  }

  return { supabase, accessToken: data.session.access_token };
}

test("GET /api/tasks without a token returns 401", async ({ request }) => {
  const response = await request.get("/api/tasks");
  expect(response.status()).toBe(401);
  expect(await response.json()).toMatchObject({ error: "Chưa đăng nhập" });
});

test("POST /api/tasks with invalid input returns 400", async ({ request }) => {
  test.skip(Boolean(accountSkipReason), accountSkipReason ?? "");
  const { supabase, accessToken } = await getTestAccessToken();

  try {
    const response = await request.post("/api/tasks", {
      headers: { Authorization: `Bearer ${accessToken}` },
      data: { title: "   " },
    });

    expect(response.status()).toBe(400);
    expect(await response.json()).toMatchObject({
      error: "Tên phải có 1–120 ký tự",
    });
  } finally {
    await supabase.auth.signOut();
  }
});

test("A user can create, reload, edit, complete, and delete a task", async ({
  page,
  request,
}) => {
  test.skip(Boolean(accountSkipReason), accountSkipReason ?? "");

  const email = process.env.TEST_EMAIL_A!;
  const password = process.env.TEST_PASSWORD_A!;
  const uniqueTitle = `Playwright task ${crypto.randomUUID()}`;
  const editedTitle = `${uniqueTitle} edited`;
  let authorization: string | undefined;

  page.on("request", (browserRequest) => {
    if (new URL(browserRequest.url()).pathname !== "/api/tasks") return;
    const requestAuthorization = browserRequest.headers().authorization;
    if (requestAuthorization?.startsWith("Bearer ")) {
      authorization = requestAuthorization;
    }
  });

  try {
    await page.goto("/login");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Hiện mật khẩu" }).click();
    await expect(page.getByRole("button", { name: "Ẩn mật khẩu" })).toBeVisible();
    await page.getByRole("button", { name: "Ẩn mật khẩu" }).click();
    await expect(
      page.getByRole("button", { name: "Hiện mật khẩu" }),
    ).toBeVisible();

    await page.getByLabel("Email").fill(email.trim());
    await page.getByLabel("Mật khẩu", { exact: true }).fill(password);
    await page.getByRole("button", { name: "Đăng nhập" }).click();

    await expect(page).toHaveURL(/\/tasks$/);
    await expect(
      page.getByRole("heading", { name: "Công việc học tập hôm nay" }),
    ).toBeVisible();

    await page.getByLabel("Tên công việc cần học").fill(uniqueTitle);
    await page.getByRole("button", { name: "Thêm công việc" }).click();

    let taskRow = page.getByTestId("task-item").filter({ hasText: uniqueTitle });
    await expect(taskRow).toHaveCount(1);

    const reloadedTasksResponse = page
      .waitForResponse(
        (response) =>
          new URL(response.url()).pathname === "/api/tasks" &&
          response.request().method() === "GET",
        { timeout: 8000 },
      )
      .catch(() => null);
    try {
      await page.reload({ timeout: 10000 });
    } catch (error) {
      throw new Error(
        `Could not reload the task page (path: ${new URL(page.url()).pathname}; reason: ${error instanceof Error ? error.name : "unknown"}).`,
      );
    }
    const tasksResponse = await reloadedTasksResponse;
    if (!tasksResponse) {
      throw new Error(
        `No GET /api/tasks response after reload (path: ${new URL(page.url()).pathname}).`,
      );
    }
    expect(tasksResponse.status()).toBe(200);
    const tasksBody: unknown = await tasksResponse.json();
    const containsCreatedTask =
      typeof tasksBody === "object" &&
      tasksBody !== null &&
      "data" in tasksBody &&
      Array.isArray(tasksBody.data) &&
      tasksBody.data.some(
        (task: unknown) =>
          typeof task === "object" &&
          task !== null &&
          "title" in task &&
          task.title === uniqueTitle,
      );
    expect(containsCreatedTask).toBe(true);

    taskRow = page.getByTestId("task-item").filter({ hasText: uniqueTitle });
    await expect(taskRow).toHaveCount(1);

    await taskRow.getByRole("button", { name: `Sửa ${uniqueTitle}` }).click();
    const editingTaskRow = page
      .getByTestId("task-item")
      .filter({ has: page.getByLabel("Chỉnh sửa tên công việc") });
    const editInput = editingTaskRow.getByLabel("Chỉnh sửa tên công việc");
    await editInput.fill(editedTitle);
    await editingTaskRow.getByRole("button", { name: "Lưu" }).click();

    taskRow = page.getByTestId("task-item").filter({ hasText: editedTitle });
    await expect(taskRow).toHaveCount(1);
    await taskRow
      .getByRole("button", { name: `Đánh dấu đã xong: ${editedTitle}` })
      .click();
    await expect(
      taskRow.getByRole("button", { name: `Đánh dấu chưa xong: ${editedTitle}` }),
    ).toBeVisible();

    page.once("dialog", (dialog) => dialog.accept());
    await taskRow.getByRole("button", { name: `Xóa ${editedTitle}` }).click();
    await expect(taskRow).toHaveCount(0);
  } finally {
    if (authorization) {
      const response = await request.get("/api/tasks", {
        headers: { Authorization: authorization },
        timeout: 5000,
      });

      if (response.ok()) {
        const body: unknown = await response.json();
        if (
          typeof body === "object" &&
          body !== null &&
          "data" in body &&
          Array.isArray(body.data)
        ) {
          const createdTasks = body.data.filter(
            (task: unknown): task is { id: string; title: string } =>
              typeof task === "object" &&
              task !== null &&
              "id" in task &&
              typeof task.id === "string" &&
              "title" in task &&
              (task.title === uniqueTitle || task.title === editedTitle),
          );

          for (const task of createdTasks) {
            const deleteResponse = await request.delete(
              `/api/tasks/${encodeURIComponent(task.id)}`,
              { headers: { Authorization: authorization }, timeout: 5000 },
            );
            expect([200, 404]).toContain(deleteResponse.status());
          }
        } else {
          throw new Error("Could not parse tasks during test cleanup.");
        }
      } else {
        throw new Error("Could not load tasks during test cleanup.");
      }
    }
  }
});
