import { getAllTasks } from "@/services/taskService";
import CreateTaskForm from "@/components/CreateTaskForm";
import TaskItem from "@/components/TaskItem";
import Link from "next/link";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    archived?: string;
  }>;
}) {

  const params = await searchParams;
  const showArchived = params.archived === "true";
  const tasks = await getAllTasks(showArchived);
  return (
    <main>
      <h1>
        {showArchived ? "Archived Tasks" : "Tasks"}
      </h1>
      {showArchived ? (
        <Link href="/">
          View active tasks
        </Link>
      ) : (
        <Link href="/?archived=true">
          View archived tasks
        </Link>
      )}

    {!showArchived && (
      <>
        <CreateTaskForm />
        <hr />
      </>
    )}

      {tasks.length === 0 ? (
        <p>
          {showArchived
          ? "No archived tasks."
          : "No active tasks yet."}
        </p>
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