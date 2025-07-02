import React, { useState, useEffect } from 'react';
import { X, Image, Tag, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Task, Column } from './TrelloBoard';
import { ActionFunctionArgs } from 'react-router-dom';

const BASE_URL = "http://localhost:3000/api"; // Cambia a tu backend real

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, 'id'>) => void;
  task?: Task | null;
  columnId: string;
  columns: Column[];
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = request.formData();
  console.log(Object.entries(formData));
};

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  task,
  columnId,
  columns
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [selectedColumnId, setSelectedColumnId] = useState(columnId);

  const predefinedTags = ['Design', 'Frontend', 'Backend', 'Research', 'Testing', 'Marketing'];

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setImage(task.image || '');
      setDueDate(task.dueDate || '');
      setTags(task.tags || []);
      setSelectedColumnId(task.columnId);
    } else {
      setTitle('');
      setDescription('');
      setImage('');
      setDueDate('');
      setTags([]);
      setSelectedColumnId(columnId);
    }
  }, [task, columnId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      image: image.trim() || undefined,
      dueDate: dueDate || undefined,
      tags,
      columnId: selectedColumnId
    });

    // Reset form
    setTitle('');
    setDescription('');
    setImage('');
    setDueDate('');
    setTags([]);
    setNewTag('');
  };

  const addTag = (tagName: string) => {
    if (tagName && !tags.includes(tagName)) {
      setTags([...tags, tagName]);
    }
    setNewTag('');
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const getTagColor = (tag: string) => {
    const colors: { [key: string]: string } = {
      'Design': 'bg-purple-100 text-purple-800 border-purple-200',
      'Frontend': 'bg-blue-100 text-blue-800 border-blue-200',
      'Backend': 'bg-green-100 text-green-800 border-green-200',
      'Research': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Testing': 'bg-red-100 text-red-800 border-red-200',
      'Marketing': 'bg-pink-100 text-pink-800 border-pink-200',
    };
    return colors[tag] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Nueva función para manejar la subida de archivos
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        const res = await fetch('http://localhost:3000/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            file: base64,
            fileName: file.name,
            contentType: file.type,
          }),
        });
        const data = await res.json();
        if (data.url) {
          setImage(data.url);
        } else {
          alert('Error al subir la imagen');
        }
      } catch (err) {
        alert('Error al subir la imagen');
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {task ? 'Editar Tarjeta' : 'Nueva Tarjeta'}
          </DialogTitle>
        </DialogHeader>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
              Título *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="¿Qué necesitas hacer?"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Descripción
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Agrega una descripción más detallada..."
              className="mt-1 min-h-[100px]"
            />
          </div>

          <div>
            <Label htmlFor="image" className="text-sm font-medium text-gray-700 flex items-center">
              <Image className="w-4 h-4 mr-1" />
              URL de Imagen
            </Label>
            <Input
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="mt-1"
            />
            {/* Nuevo input para subir archivo */}
            <Label className="text-sm font-medium text-gray-700 flex items-center mt-2">
              <Image className="w-4 h-4 mr-1" />
              Subir Imagen
            </Label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {image && (
              <div className="mt-2">
                <img
                  src={image}
                  alt="Preview"
                  className="w-full max-w-xs h-24 object-cover rounded-md border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="column" className="text-sm font-medium text-gray-700">
              Columna
            </Label>
            <Select value={selectedColumnId} onValueChange={setSelectedColumnId}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {columns.map((col) => (
                  <SelectItem key={col.id} value={col.id}>
                    {col.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="dueDate" className="text-sm font-medium text-gray-700">
              Fecha de Vencimiento
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 flex items-center mb-2">
              <Tag className="w-4 h-4 mr-1" />
              Etiquetas
            </Label>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className={`px-3 py-1 rounded-full text-xs font-medium border cursor-pointer ${getTagColor(tag)}`}
                  onClick={() => removeTag(tag)}
                >
                  {tag} ×
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {predefinedTags.filter(tag => !tags.includes(tag)).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addTag(tag)}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 transition-colors"
                >
                  + {tag}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Agregar etiqueta personalizada"
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag(newTag);
                  }
                }}
              />
              <Button
                type="button"
                onClick={() => addTag(newTag)}
                variant="outline"
                size="sm"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              {task ? 'Actualizar' : 'Crear'} Tarjeta
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
