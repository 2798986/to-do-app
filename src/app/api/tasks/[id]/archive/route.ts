import { NextRequest, NextResponse } from "next/server";
import { archiveTask } from "@/services/taskService";
import { taskIdSchema } from "@/validation/taskSchema";
import { Prisma } from "@/generated/prisma/client";

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

  try {
    const task = await archiveTask(parsedId.data);
    return NextResponse.json(task, { status: 200 });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    console.error("Failed to archive task:", err);
    return NextResponse.json(
      { error: "Failed to archive task" },
      { status: 500 }
    );
  }
}