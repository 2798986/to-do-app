import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  topic: z.string().min(1, "Topic is required"),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
  dueDate: z.coerce.date().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = z
  .object({
    title: z.string().min(1, "Title is required").optional(),
    description: z.string().min(1, "Description is required").optional(),
    topic: z.string().min(1, "Topic is required").optional(),
    status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
    dueDate: z.coerce.date().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided to update a task",
  });

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export const taskIdSchema = z.coerce.number().int().positive();