import { Column, Task } from "@/components/TrelloBoard";

const BASE_URL = "https://taskgrid-api.vercel.app/api"; // Cambia a tu backend real

// COLUMNAS
export const fetchColumns = async (): Promise<Column[]> => {
  const res = await fetch(`${BASE_URL}/columns`);
  if (!res.ok) throw new Error("Error al cargar columnas");
  return res.json();
};

export const createColumn = async (title: string) => {
  const res = await fetch(`${BASE_URL}/columns`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error("Error al crear columna");
  return res.json();
};

export const deleteColumn = async (id: string) => {
  const res = await fetch(`${BASE_URL}/columns/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar columna");
  return res.json();
};

// TAREAS
export const createTask = async (task: Omit<Task, "id">) => {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: task.title,
      description: task.description,
      image: task.image,
      dueDate: task.dueDate,
      tags: task.tags,
      columnId: task.columnId,
    }),
  });
  if (!res.ok) {
    const errorData = await res.json(); // Leer el cuerpo del error
    throw new Error(errorData.error || "Error al crear tarea");
  }
  return res.json();
};

export const updateTaskAPI = async (task: Task) => {
  const res = await fetch(`${BASE_URL}/edittask`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Error al actualizar tarea");
  return res.json();
};

export const deleteTaskAPI = async (id: string) => {
  const res = await fetch(`${BASE_URL}/deletetask`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body:JSON.stringify({
      id:id
    }),

  });
  if (!res.ok) throw new Error("Error al eliminar tarea");
  return res.json();
};

export const moveTaskAPI = async (taskId: string, targetColumnId: string) => {
  const res = await fetch(`${BASE_URL}/movetask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      taskId: taskId,
      newColumnId: targetColumnId,
    }),
  });
  if (!res.ok) throw new Error("Error al mover tarea");
  return res.json();
};
