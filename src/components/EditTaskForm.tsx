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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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

    const res = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setIsSubmitting(false);

    if (!res.ok) {
      setError("Could not save changes. Check the form and try again.");
      return;
    }

    router.refresh();
    onDone();
  }

  return (
    <li>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor={`title-${task.id}`}>Title</label>
          <input id={`title-${task.id}`} name="title" type="text" defaultValue={task.title} required />
        </div>
        <div>
          <label htmlFor={`description-${task.id}`}>Description</label>
          <textarea id={`description-${task.id}`} name="description" defaultValue={task.description} required />
        </div>
        <div>
          <label htmlFor={`topic-${task.id}`}>Topic</label>
          <input id={`topic-${task.id}`} name="topic" type="text" defaultValue={task.topic} required />
        </div>
        <div>
          <label htmlFor={`status-${task.id}`}>Status</label>
          <select id={`status-${task.id}`} name="status" defaultValue={task.status}>
            <option value="TODO">To do</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>
        <div>
          <label htmlFor={`dueDate-${task.id}`}>Due date</label>
          <input
            id={`dueDate-${task.id}`}
            name="dueDate"
            type="date"
            defaultValue={task.dueDate ? task.dueDate.toISOString().slice(0, 10) : ""}
          />
        </div>
        {error && <p role="alert">{error}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save"}
        </button>
        <button type="button" onClick={onDone} disabled={isSubmitting}>
          Cancel
        </button>
      </form>
    </li>
  );
}