import { prisma } from "@/lib/prisma";
import type { CreateTaskInput, UpdateTaskInput } from "@/validation/taskSchema";
import type { Task } from "@/generated/prisma/client";

export async function createTask(input: CreateTaskInput): Promise<Task> {
  return prisma.task.create({
    data: input,
  });
}

export async function getAllTasks(
  archived: boolean,
  sortBy?: "topic" | "status" | "dueDate"
): Promise<Task[]> {
  return prisma.task.findMany({
  where: {
    archived,
  },
  orderBy: sortBy
    ? {
        [sortBy]: "asc",
      }
    : undefined,
});
}

export async function updateTask(
  id: number,
  input: UpdateTaskInput
): Promise<Task> {
  return prisma.task.update({
    where: { id },
    data: input,
  });
}

export async function archiveTask(id: number): Promise<Task> {
  return prisma.task.update({
    where: { id },
    data: { archived: true },
  });
}