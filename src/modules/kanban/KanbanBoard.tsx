import React, { useCallback, useMemo, useState } from 'react';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Status, Task } from '../../types/task';
import { useTasks } from '../../store/tasks';
import TaskCard from './TaskCard';
import { Column } from './Column';
import CreateTaskModal from '../task/CreateTaskModal';
import EditTaskModal from '../task/EditTaskModal';

const STATUSES: ReadonlyArray<{ key: Status; title: string }> = [
  { key: 'todo', title: 'Todo' },
  { key: 'inprogress', title: 'In Progress' },
  { key: 'done', title: 'Done' },
];

const KanbanBoard: React.FC = () => {
  const { tasks, dispatch } = useTasks();
  const [openCreate, setOpenCreate] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);

  const onEdit = useCallback((task: Task) => {
    setEditing(task);
    setEditOpen(true);
  }, []);

  const onDelete = useCallback((id: string) => {
    dispatch({ type: 'delete', id });
  }, [dispatch]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const columns = useMemo(
    () =>
      STATUSES.map((s) => ({
        status: s.key,
        title: s.title,
        items: tasks.filter((t) => t.status === s.key),
      })),
    [tasks],
  );

  const onDragEnd = useCallback((e: DragEndEvent) => {
    const taskId = e.active.id as string;
    const overId = e.over?.id as string | undefined;
    if (!overId) return;

    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const isColumnDrop = ['todo', 'inprogress', 'done'].includes(overId as Status);
    if (isColumnDrop) {
      const targetStatus = overId as Status;
      if (task.status !== targetStatus) {
        dispatch({ type: 'move', id: taskId, status: targetStatus });
      }
      return;
    }

    const overTask = tasks.find((t) => t.id === overId);
    if (!overTask) return;

    if (overTask.status !== task.status) {
      return;
    }

    const colTasks = tasks.filter((t) => t.status === task.status);
    const toIndex = colTasks.findIndex((t) => t.id === overTask.id);
    if (toIndex === -1) return;

    dispatch({ type: 'reorder', status: task.status, id: taskId, toIndex });
  }, [dispatch, tasks]);

  const openCreateModal = useCallback(() => setOpenCreate(true), []);
  const closeCreateModal = useCallback(() => setOpenCreate(false), []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Task Manager</h1>
        <button
          type="button"
          aria-label="Create task"
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          onClick={openCreateModal}
        >
          Створити задачу
        </button>
      </div>

      <DndContext sensors={sensors} onDragEnd={onDragEnd}>
        <div className="grid gap-4 md:grid-cols-3">
          {columns.map((col) => (
            <Column id={col.status} key={col.status} title={col.title} isEmpty={col.items.length === 0}>
              <SortableContext items={col.items.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {col.items.map((t) => (
                    <TaskCard
                      key={t.id}
                      task={t}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              </SortableContext>
            </Column>
          ))}
        </div>
      </DndContext>

      <CreateTaskModal open={openCreate} onClose={closeCreateModal} />
      <EditTaskModal
        open={editOpen}
        task={editing}
        onClose={() => setEditOpen(false)}
        onSave={(updated) => dispatch({ type: 'update', task: updated })}
      />
    </div>
  );
};

export default KanbanBoard;
