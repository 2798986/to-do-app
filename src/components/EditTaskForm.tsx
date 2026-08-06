// src/components/EditTaskForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TaskWithOverdue } from "@/types/task";

export function EditTaskForm({
  task,
  onDone,
}: {
  task: TaskWithOverdue;
  onDone: () => void;
}) {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const form = event.currentTarget;

    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(form);

    const dueDate = formData.get("dueDate") as string;

    const payload: Record<string, unknown> = {
      title: formData.get("title"),
      description: formData.get("description"),
      topic: formData.get("topic"),
      status: formData.get("status"),
    };

    if (dueDate) {
      payload.dueDate = dueDate;
    }

    const response = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      setError(
        "Could not save changes. Check the form and try again."
      );
      return;
    }

    router.refresh();
    onDone();
  }

  return (
    <li className="create-task-card">
      <h2>Edit Task</h2>

      <form
        onSubmit={handleSubmit}
        className="task-form"
      >
        <div className="form-group">
          <label htmlFor={`title-${task.id}`}>
            Title
          </label>

          <input
            id={`title-${task.id}`}
            name="title"
            type="text"
            defaultValue={task.title}
            placeholder="Enter task title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor={`description-${task.id}`}>
            Description
          </label>

          <textarea
            id={`description-${task.id}`}
            name="description"
            rows={4}
            defaultValue={task.description}
            placeholder="Describe the task..."
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor={`topic-${task.id}`}>
              Topic
            </label>

            <input
              id={`topic-${task.id}`}
              name="topic"
              type="text"
              defaultValue={task.topic}
              placeholder="e.g. Mathematics"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor={`status-${task.id}`}>
              Status
            </label>

            <select
              id={`status-${task.id}`}
              name="status"
              defaultValue={task.status}
            >
              <option value="TODO">
                To do
              </option>

              <option value="IN_PROGRESS">
                In progress
              </option>

              <option value="DONE">
                Done
              </option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor={`dueDate-${task.id}`}>
            Due Date
          </label>

          <input
            id={`dueDate-${task.id}`}
            name="dueDate"
            type="date"
            defaultValue={
              task.dueDate
                ? task.dueDate
                    .toISOString()
                    .slice(0, 10)
                : ""
            }
          />
        </div>

        {error && (
          <p
            className="error-message"
            role="alert"
          >
            ⚠ {error}
          </p>
        )}

        <div className="button-row">
          <button
            className="submit-button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : "Save Changes"}
          </button>

          <button
            className="cancel-button"
            type="button"
            onClick={onDone}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </li>
  );
}