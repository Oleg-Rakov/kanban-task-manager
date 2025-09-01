import React, { useMemo } from 'react';
import { useDraggable } from '@dnd-kit/core';
import type { Task } from '../../types/task';

const badgeColor: Record<Task['priority'], string> = {
  low: 'bg-emerald-100 text-emerald-800',
  medium: 'bg-amber-100 text-amber-800',
  high: 'bg-rose-100 text-rose-800',
};

interface Props {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
}

const TaskCard: React.FC<Props> = ({ task, onEdit, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id });

  const style = useMemo(() => {
    if (!transform) return undefined;
    return { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` };
  }, [transform]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      aria-grabbed={isDragging}
      className={`rounded-xl border p-3 bg-white shadow-sm transition-shadow ${
        isDragging ? 'opacity-60 ring-2 ring-indigo-400' : 'hover:shadow-md'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="font-medium">{task.title}</div>
        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${badgeColor[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${badgeColor[task.priority]}`}>
          {task.priority}
        </span>
        {onEdit && (
          <button
            type="button"
            className="text-slate-500 hover:text-slate-700"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            aria-label="Редагувати"
            title="Редагувати"
          >✏️</button>
        )}
        {onDelete && (
          <button
            type="button"
            className="text-slate-500 hover:text-rose-600"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            aria-label="Видалити"
            title="Видалити"
          >🗑</button>
        )}
      </div>

      {task.assignee && (
        <div className="text-sm text-slate-600 mt-1">👤 {task.assignee.name}</div>
      )}
      {task.dueDate && (
        <div className="text-xs text-slate-500 mt-1">⏰ до {task.dueDate}</div>
      )}
      {task.file && (
        <div className="text-xs text-slate-500 mt-1">📎 {task.file.name}</div>
      )}
    </div>
  );
};

export default TaskCard;
