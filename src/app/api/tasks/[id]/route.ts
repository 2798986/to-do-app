import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { updateTask } from "@/services/taskService";
import {
  updateTaskSchema,
  taskIdSchema,
} from "@/validation/taskSchema";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const parsedId = taskIdSchema.safeParse(id);
  if (!parsedId.success) {
    return NextResponse.json(
      { error: "Task id must be a positive integer" },
      { status: 400 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON" },
      { status: 400 }
    );
  }

  const parsedBody = updateTaskSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      { error: parsedBody.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const task = await updateTask(parsedId.data, parsedBody.data);

    return NextResponse.json(task, { status: 200 });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    console.error("Failed to update task:", err);

    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
}