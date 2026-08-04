import { getAllTasks } from "@/services/taskService";
import CreateTaskForm from "@/components/CreateTaskForm";
import TaskItem from "@/components/TaskItem";
import Link from "next/link";
import { taskSortSchema } from "@/validation/taskSchema";

function buildQueryString(params: {
  archived: boolean;
  sortBy?: string;
}) {
  const query = new URLSearchParams();

  if (params.archived) {
    query.set("archived", "true");
  }

  if (params.sortBy) {
    query.set("sortBy", params.sortBy);
  }

  const qs = query.toString();

  return qs ? `/?${qs}` : "/";
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    archived?: string;
    sortBy?: string;
  }>;
}) {
  const params = await searchParams;

  const showArchived = params.archived === "true";

  const parsedSortBy = taskSortSchema.safeParse(params.sortBy);

  const sortBy = parsedSortBy.success
    ? parsedSortBy.data
    : undefined;

  const tasks = await getAllTasks(showArchived, sortBy);

  return (
    <main>
      <h1>
        {showArchived ? "Archived Tasks" : "Tasks"}
      </h1>

      {showArchived ? (
        <Link
          href={buildQueryString({
            archived: false,
            sortBy,
          })}
        >
          View active tasks
        </Link>
      ) : (
        <Link
          href={buildQueryString({
            archived: true,
            sortBy,
          })}
        >
          View archived tasks
        </Link>
      )}

      <div>
        <p>Sort by:</p>


        <Link
          href={buildQueryString({
            archived: showArchived,
            sortBy: "topic",
          })}
        >
          Topic
        </Link>{" | "}

        <Link
          href={buildQueryString({
            archived: showArchived,
            sortBy: "status",
          })}
        >
          Status
        </Link>{" | "}

        <Link
          href={buildQueryString({
            archived: showArchived,
            sortBy: "dueDate",
          })}
        >
          Due Date
        </Link>{ " | "}

        <Link
          href={buildQueryString({
          archived: showArchived,
          })}
        >
        Clear sorting
        </Link>

      </div>

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