"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateTaskForm() {
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

    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      setError("Failed to create task.");
      return;
    }

    form.reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Task</h2>

      <div>
        <label htmlFor="title">Title</label>
        <br />
        <input
          id="title"
          name="title"
          type="text"
          required
        />
      </div>

      <br />

      <div>
        <label htmlFor="description">Description</label>
        <br />
        <textarea
          id="description"
          name="description"
          required
        />
      </div>

      <br />

      <div>
        <label htmlFor="topic">Topic</label>
        <br />
        <input
          id="topic"
          name="topic"
          type="text"
          required
        />
      </div>

      <br />

      <div>
        <label htmlFor="status">Status</label>
        <br />
        <select
          id="status"
          name="status"
          defaultValue="TODO"
        >
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="DONE">DONE</option>
        </select>
      </div>

      <br />

      <div>
        <label htmlFor="dueDate">Due Date</label>
        <br />
        <input
          id="dueDate"
          name="dueDate"
          type="date"
        />
      </div>

      <br />

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating..." : "Create Task"}
      </button>
    </form>
  );
}