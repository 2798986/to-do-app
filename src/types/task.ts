import type { Task } from "@/generated/prisma/client";

export type TaskWithOverdue = Task & {
  isOverdue: boolean;
};