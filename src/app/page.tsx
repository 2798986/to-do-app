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
    <main
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "2rem",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          marginBottom: "1rem",
        }}
      >
        {showArchived ? "Archived Tasks" : "Task Dashboard"}
      </h1>

      {/* Active / Archived Toggle */}

      <div
        style={{
          marginBottom: "1.5rem",
        }}
      >
        {showArchived ? (
          <Link
            href={buildQueryString({
              archived: false,
              sortBy,
            })}
            className="view-tasks-button"
          >
            📋 View Active Tasks
          </Link>
        ) : (
          <Link
            href={buildQueryString({
              archived: true,
              sortBy,
            })}
            className="view-tasks-button"
          >
            🗄️ View Archived Tasks
          </Link>
        )}
      </div>

      {/* Sorting */}

      <section
        style={{
          marginBottom: "2rem",
        }}
      >
        <h3
          style={{
            marginBottom: "0.75rem",
          }}
        >
          ⇅ Sort by
        </h3>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <Link
            href={buildQueryString({
              archived: showArchived,
              sortBy: "topic",
            })}
            className="sort-button"
          >
            🏷 Topic
          </Link>

          <Link
            href={buildQueryString({
              archived: showArchived,
              sortBy: "status",
            })}
            className="sort-button"
          >
            🔵 Status
          </Link>

          <Link
            href={buildQueryString({
              archived: showArchived,
              sortBy: "dueDate",
            })}
            className="sort-button"
          >
            📅 Due Date
          </Link>

          <Link
            href={buildQueryString({
              archived: showArchived,
            })}
            className="clear-sorting-button"
          >
            ✕ Clear Sorting
          </Link>
        </div>
      </section>

      {!showArchived && (
        <>
          <CreateTaskForm />

          <hr
            style={{
              margin: "2rem 0",
            }}
          />
        </>
      )}

      {tasks.length === 0 ? (
        <p>
          {showArchived
            ? "No archived tasks."
            : "No active tasks yet."}
        </p>
      ) : (
        <ul
          style={{
            listStyle: "none",
            display: "grid",
            gap: "1.5rem",
            padding: 0,
          }}
        >
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