import { NextRequest, NextResponse } from "next/server";
import { createTask, getAllTasks } from "@/services/taskService";
import {
  createTaskSchema,
  taskArchivedFilterSchema,
} from "@/validation/taskSchema";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON" },
      { status: 400 }
    );
  }

  const parsed = createTaskSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const task = await createTask(parsed.data);
    return NextResponse.json(task, { status: 201 });
  } catch (err) {
    console.error("Failed to create task:", err);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const archivedParam =
    request.nextUrl.searchParams.get("archived") ?? undefined;

  const parsed = taskArchivedFilterSchema.safeParse(archivedParam);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid archived query parameter" },
      { status: 400 }
    );
  }

  try {
    const tasks = await getAllTasks(parsed.data);

    return NextResponse.json(tasks, { status: 200 });
  } catch (err) {
    console.error("Failed to fetch tasks:", err);

    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}