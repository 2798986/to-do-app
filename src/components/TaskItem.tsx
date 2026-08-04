"use client";

import { useState } from "react";
import type { TaskWithOverdue } from "@/types/task";
import { EditTaskForm } from "./EditTaskForm";

type Props = {
  task: TaskWithOverdue;
};

export default function TaskItem({ task }: Props) {
  const [isEditing, setIsEditing] = useState(false);

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

      <button onClick={() => setIsEditing(true)}>
        Edit
      </button>
    </li>
  );
}