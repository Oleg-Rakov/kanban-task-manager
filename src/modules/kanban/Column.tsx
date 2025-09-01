import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { Status } from '../../types/task';

export const Column: React.FC<{
  id: Status;
  title: string;
  children: React.ReactNode;
  isEmpty?: boolean;
}> = ({ id, title, children, isEmpty }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-2xl border bg-white p-4 ${isOver ? 'ring-2 ring-indigo-400' : ''}`}
    >
      <div className="font-medium mb-3">{title}</div>

      <div className="min-h-[96px]">
        {isEmpty ? (
          <div className="h-[96px] flex items-center justify-center rounded-xl border-2 border-dashed text-slate-400">
            Немає задач
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};
