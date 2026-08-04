import { getAllTasks } from "@/services/taskService";
import CreateTaskForm from "@/components/CreateTaskForm";

export default async function Home() {
  const tasks = await getAllTasks(false);

  return (
    <main>
      <h1>Tasks</h1>

      <CreateTaskForm />

      <hr />

      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
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
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}