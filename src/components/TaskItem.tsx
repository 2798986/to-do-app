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
    <li
      className="card"
      style={{
        marginBottom: "1.5rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "1rem",
        }}
      >
        <div>
          <h2>{task.title}</h2>

          <p
            style={{
              color: "var(--muted)",
              marginTop: ".3rem",
            }}
          >
            {task.description}
          </p>
        </div>

        {task.isOverdue && (
          <span
            style={{
              background: "#fee2e2",
              color: "#b91c1c",
              padding: ".35rem .7rem",
              borderRadius: "999px",
              fontWeight: 600,
              fontSize: ".8rem",
            }}
          >
            Overdue
          </span>
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: ".6rem",
          flexWrap: "wrap",
          marginBottom: "1rem",
        }}
      >
        <span
          style={{
            background: "#eef2ff",
            color: "#4338ca",
            padding: ".4rem .8rem",
            borderRadius: "999px",
            fontSize: ".85rem",
            fontWeight: 600,
          }}
        >
          {task.topic}
        </span>

        <span
          style={{
            background:
              task.status === "DONE"
                ? "#dcfce7"
                : task.status === "IN_PROGRESS"
                ? "#dbeafe"
                : "#f3f4f6",

            color:
              task.status === "DONE"
                ? "#166534"
                : task.status === "IN_PROGRESS"
                ? "#1d4ed8"
                : "#374151",

            padding: ".4rem .8rem",
            borderRadius: "999px",
            fontSize: ".85rem",
            fontWeight: 600,
          }}
        >
          {task.status}
        </span>
      </div>

      {task.dueDate && (
        <p
          style={{
            color: "var(--muted)",
            marginBottom: "1rem",
          }}
        >
          📅 Due {task.dueDate.toLocaleDateString()}
        </p>
      )}

      {archiveError && (
        <p
          role="alert"
          style={{
            color: "red",
            marginBottom: "1rem",
          }}
        >
          {archiveError}
        </p>
      )}

      <div
        style={{
          display: "flex",
          gap: ".75rem",
        }}
      >
        <button
          onClick={() => setIsEditing(true)}
          style={{
            background: "#4f46e5",
            color: "white",
          }}
        >
          ✏️ Edit
        </button>

        {!task.archived && (
          <button
            onClick={handleArchive}
            disabled={isArchiving}
            style={{
              background: "#f59e0b",
              color: "white",
            }}
          >
            {isArchiving ? "Archiving..." : "📦 Archive"}
          </button>
        )}
      </div>
    </li>
  );
}