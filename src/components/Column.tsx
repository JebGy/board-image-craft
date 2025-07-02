
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TaskCard from './TaskCard';
import { Task, Column as ColumnType } from './TrelloBoard';

interface ColumnProps {
  column: ColumnType;
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, targetColumnId: string) => void;
  allColumns: ColumnType[];
}

const Column: React.FC<ColumnProps> = ({
  column,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onMoveTask,
  allColumns
}) => {
  const getColumnColor = (columnId: string) => {
    switch (columnId) {
      case 'todo':
        return 'bg-gray-100 border-gray-300';
      case 'doing':
        return 'bg-blue-50 border-blue-300';
      case 'done':
        return 'bg-green-50 border-green-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  return (
    <div className={`rounded-lg p-4 border-2 ${getColumnColor(column.id)} min-h-[600px]`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-700 text-sm tracking-wide">
          {column.title}
        </h2>
        <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs">
          {column.tasks.length}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        {column.tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={() => onEditTask(task)}
            onDelete={() => onDeleteTask(task.id)}
            onMove={onMoveTask}
            allColumns={allColumns}
          />
        ))}
      </div>

      <Button
        onClick={onAddTask}
        variant="ghost"
        className="w-full border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-white/50 text-gray-600 py-8"
      >
        <Plus className="w-4 h-4 mr-2" />
        Agregar una tarjeta
      </Button>
    </div>
  );
};

export default Column;
