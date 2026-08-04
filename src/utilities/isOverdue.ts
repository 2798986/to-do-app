import type { Status } from "@/generated/prisma/client";

export function isOverdue(
  task: {
    dueDate: Date | null;
    archived: boolean;
    status: Status;
  },
  now: Date = new Date()
): boolean {
  if (task.archived) {
    return false;
  }

  if (task.status === "DONE") {
    return false;
  }

  if (!task.dueDate) {
    return false;
  }

  return task.dueDate < now;
}