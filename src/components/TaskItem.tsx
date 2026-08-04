"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TaskWithOverdue } from "@/types/task";
import { EditTaskForm } from "./EditTaskForm";

type Props = {
  task: TaskWithOverdue;
};

export default function TaskItem({ task }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const [isArchiving, setIsArchiving] = useState(false);
  const [archiveError, setArchiveError] = useState<string | null>(null);

  async function handleArchive() {
  setArchiveError(null);
  setIsArchiving(true);

  const response = await fetch(`/api/tasks/${task.id}/archive`, {
    method: "PATCH",
  });

  setIsArchiving(false);

  if (!response.ok) {
    setArchiveError("Could not archive task.");
    return;
  }

  router.refresh();
  }

  if (isEditing) {
    return (
      <EditTaskForm
        task={task}
        onDone={() => setIsEditing(false)}
      />
    );
  }

  return (
    <li>
      <h2>{task.title}</h2>

      <p>{task.description}</p>

      <p>Topic: {task.topic}</p>

      <p>Status: {task.status}</p>

      {task.dueDate && (
        <p>Due: {task.dueDate.toLocaleDateString()}</p>
      )}

      {task.isOverdue && (
        <p>⚠️ Overdue</p>
      )}

      {archiveError && (
        <p role="alert">
          {archiveError}
        </p>
      )}

      <button onClick={() => setIsEditing(true)}>
        Edit
      </button>

      <button
        onClick={handleArchive}
        disabled={isArchiving}
      >
        {isArchiving ? "Archiving..." : "Archive"}
      </button>
    </li>
  );
}