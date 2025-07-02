import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Column from "./Column";
import TaskModal from "./TaskModal";
import {
  createTask,
  deleteTaskAPI,
  fetchColumns,
  moveTaskAPI,
  updateTaskAPI,
} from "@/lib/api";

export interface Task {
  id: string;
  title: string;
  description: string;
  image?: string;
  dueDate?: string;
  tags: string[];
  columnId: string;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

const TrelloBoard = () => {
  const [columns, setColumns] = useState<Column[]>([
    {
      id: "todo",
      title: "TO DO",
      tasks: [
        {
          id: "1",
          title: "Design User Interface",
          description:
            "Create wireframes and high-fidelity designs for the app's main screens.",
          tags: ["Design", "Frontend"],
          columnId: "todo",
        },
      ],
    },
    {
      id: "doing",
      title: "DOING",
      tasks: [
        {
          id: "2",
          title: "Develop Authentication Module",
          description:
            "Prepare the server environment and database for app development.",
          tags: ["Backend", "Frontend"],
          columnId: "doing",
        },
      ],
    },
    {
      id: "done",
      title: "DONE",
      tasks: [
        {
          id: "3",
          title: "Research Target Audience",
          description:
            "Gather insights on potential users' needs and behaviors.",
          tags: ["Research"],
          columnId: "done",
        },
      ],
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [targetColumnId, setTargetColumnId] = useState<string>("");

  const addTask = (task: Omit<Task, "id">) => {
    createTask(task).then((v) => {
      const newTask: Task = {
        ...task,
        id: Date.now().toString(),
      };

      setColumns((prev) =>
        prev.map((col) =>
          col.id === task.columnId
            ? { ...col, tasks: [...col.tasks, newTask] }
            : col
        )
      );
    });
  };

  const updateTask = (updatedTask: Task) => {
    updateTaskAPI(updatedTask)
      .then((taskFromServer) => {
        setColumns((prev) =>
          prev.map((col) => ({
            ...col,
            tasks: col.tasks.map((task) =>
              task.id === taskFromServer.id ? taskFromServer : task
            ),
          }))
        );
      })
      .catch((error) => {
        // Aquí puedes mostrar un toast o alerta de error
        console.error("Error al actualizar la tarea:", error);
      });
  };

  const deleteTask = (taskId: string) => {
    deleteTaskAPI(taskId).then(() => {
      setColumns((prev) =>
        prev.map((col) => ({
          ...col,
          tasks: col.tasks.filter((task) => task.id !== taskId),
        }))
      );
    });
  };

  const moveTask = (taskId: string, targetColumnId: string) => {
    moveTaskAPI(taskId, targetColumnId).then(() => {
      setColumns((prev) => {
        const task = prev
          .flatMap((col) => col.tasks)
          .find((t) => t.id === taskId);
        if (!task) return prev;

        const updatedTask = { ...task, columnId: targetColumnId };

        return prev.map((col) => ({
          ...col,
          tasks:
            col.id === targetColumnId
              ? [...col.tasks.filter((t) => t.id !== taskId), updatedTask]
              : col.tasks.filter((t) => t.id !== taskId),
        }));
      });
    });
  };

  const openCreateModal = (columnId: string) => {
    setTargetColumnId(columnId);
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setTargetColumnId(task.columnId);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (taskData: Omit<Task, "id">) => {
    if (editingTask) {
      updateTask({ ...taskData, id: editingTask.id } as Task);
    } else {
      addTask(taskData);
    }
    setIsModalOpen(false);
    setEditingTask(null);
  };

  useEffect(() => {
    fetchColumns().then((v) => setColumns(v));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">TaskGrid</h1>
          <p className="text-gray-600">
            Organiza tus tareas de manera eficiente
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns
            .slice()
            .sort((a, b) => {
              // Ordenar la columna "TODO" primero, el resto igual
              if (a.title.toLowerCase() === "todo") return -1;
              if (b.title.toLowerCase() === "todo") return 1;
              return 0;
            })
            .map((column) => (
              <Column
                key={column.id}
                column={column}
                onAddTask={() => openCreateModal(column.id)}
                onEditTask={openEditModal}
                onDeleteTask={deleteTask}
                onMoveTask={moveTask}
                allColumns={columns}
              />
            ))}
        </div>

        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
          task={editingTask}
          columnId={targetColumnId}
          columns={columns}
        />
      </div>
    </div>
  );
};

export default TrelloBoard;
