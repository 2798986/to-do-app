import { getAllTasks } from "@/services/taskService";
import CreateTaskForm from "@/components/CreateTaskForm";
import TaskItem from "@/components/TaskItem";

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
            <TaskItem
              key={task.id}
              task={task}
            />
          ))}
        </ul>
      )}
    </main>
  );
}