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
    <section className="create-task-card">
      <h2>Create New Task</h2>

      <form onSubmit={handleSubmit} className="task-form">

        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Enter task title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows={4}
            placeholder="Describe the task..."
            required
          />
        </div>

        <div className="form-row">

          <div className="form-group">
            <label htmlFor="topic">Topic</label>
            <input
              id="topic"
              name="topic"
              type="text"
              placeholder="e.g. Mathematics"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              defaultValue="TODO"
            >
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>
          </div>

        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
          />
        </div>

        {error && (
          <p className="error-message">
            ⚠ {error}
          </p>
        )}

        <button
          className="submit-button"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Task"}
        </button>

      </form>
    </section>
  );
}