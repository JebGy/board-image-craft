
import React, { useState } from 'react';
import { Edit, Trash, ArrowRight } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Task, Column } from './TrelloBoard';

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onMove: (taskId: string, targetColumnId: string) => void;
  allColumns: Column[];
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onMove,
  allColumns
}) => {
  const [imageError, setImageError] = useState(false);

  const getTagColor = (tag: string) => {
    const colors: { [key: string]: string } = {
      'Design': 'bg-purple-100 text-purple-800',
      'Frontend': 'bg-blue-100 text-blue-800',
      'Backend': 'bg-green-100 text-green-800',
      'Research': 'bg-yellow-100 text-yellow-800',
      'Testing': 'bg-red-100 text-red-800',
    };
    return colors[tag] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    });
  };

  const availableColumns = allColumns.filter(col => col.id !== task.columnId);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow duration-200">
      {task.image && !imageError && (
        <img
          src={task.image}
          alt={task.title}
          className="w-full h-32 object-cover rounded-md mb-3"
          onError={() => setImageError(true)}
        />
      )}
      
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-gray-800 text-sm leading-tight flex-1">
          {task.title}
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600">
              ⋯
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg">
            <DropdownMenuItem onClick={onEdit} className="hover:bg-gray-50">
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </DropdownMenuItem>
            {availableColumns.map((column) => (
              <DropdownMenuItem
                key={column.id}
                onClick={() => onMove(task.id, column.id)}
                className="hover:bg-gray-50"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Mover a {column.title}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem onClick={onDelete} className="hover:bg-red-50 text-red-600">
              <Trash className="w-4 h-4 mr-2" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {task.description && (
        <p className="text-gray-600 text-xs mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex flex-wrap gap-1 mb-3">
        {task.tags.map((tag, index) => (
          <span
            key={index}
            className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}
          >
            {tag}
          </span>
        ))}
      </div>

      {task.dueDate && (
        <div className="text-xs text-gray-500">
          Vence: {formatDate(task.dueDate)}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
