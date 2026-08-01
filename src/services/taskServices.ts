import { prisma } from "@/lib/prisma";
import type { CreateTaskInput } from "@/validation/taskSchema";
import type { Task } from "@/generated/prisma/client";

export async function createTask(input: CreateTaskInput): Promise<Task> {
  return prisma.task.create({
    data: input,
  });
}