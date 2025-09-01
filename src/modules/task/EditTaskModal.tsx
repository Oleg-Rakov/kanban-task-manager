import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Modal } from '../../components/Modal';
import type { Task, Priority, User } from '../../types/task';
import AssigneePickerModal from './AssigneePickerModal';

const schema = Yup.object({
  title: Yup.string().min(2, 'Мінімум 2 символи').required('Обов’язково'),
  description: Yup.string().max(2000, 'Макс 2000 символів').optional(),
  priority: Yup.mixed<Priority>().oneOf(['low', 'medium', 'high']).required(),
  dueDate: Yup.string().optional(),
});

interface Props {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onSave: (task: Task) => void;
}

const EditTaskModal: React.FC<Props> = ({ open, task, onClose, onSave }) => {
  const [assignee, setAssignee] = useState<User | null>(task?.assignee ?? null);
  const [file, setFile] = useState(task?.file ?? null);
  const [nestedOpen, setNestedOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    setAssignee(task?.assignee ?? null);
    setFile(task?.file ?? null);
  }, [task, open]);

  const initialValues = useMemo(
    () => ({
      title: task?.title ?? '',
      description: task?.description ?? '',
      priority: (task?.priority ?? 'medium') as Priority,
      dueDate: task?.dueDate ?? '',
      assigneeId: task?.assignee?.id ?? '',
    }),
    [task],
  );

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.currentTarget.files?.[0];
    if (!f) return setFile(null);
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = String(reader.result).split(',')[1] ?? '';
      setFile({ name: f.name, type: f.type, size: f.size, base64 });
    };
    reader.readAsDataURL(f);
  }, []);

  if (!task) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Редагувати задачу"
      footer={
        <div className="flex justify-end gap-3">
          <button type="button" className="px-4 py-2 rounded-lg border" onClick={onClose}>
            Скасувати
          </button>
          <button type="submit" form="edit-task-form" className="px-4 py-2 rounded-lg bg-indigo-600 text-white">
            Зберегти
          </button>
        </div>
      }
    >
      <Formik
        enableReinitialize
        validationSchema={schema}
        initialValues={initialValues}
        onSubmit={(values) => {
          const updated: Task = {
            ...task,
            title: values.title.trim(),
            description: values.description,
            priority: values.priority,
            dueDate: values.dueDate || undefined,
            assignee,
            file,
            updatedAt: new Date().toISOString(),
          };
          onSave(updated);
          onClose();
        }}
      >
        {({ setFieldValue }) => (
          <Form id="edit-task-form" className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Назва</label>
              <Field name="title" className="mt-1 w-full rounded-lg border px-3 py-2" />
              <ErrorMessage name="title" component="div" className="text-sm text-red-600 mt-1" />
            </div>

            <div>
              <label className="block text-sm font-medium">Опис</label>
              <Field as="textarea" name="description" className="mt-1 w-full rounded-lg border px-3 py-2" rows={4} />
              <ErrorMessage name="description" component="div" className="text-sm text-red-600 mt-1" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium">Пріоритет</label>
                <Field as="select" name="priority" className="mt-1 w-full rounded-lg border px-3 py-2">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Field>
                <ErrorMessage name="priority" component="div" className="text-sm text-red-600 mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium">Термін</label>
                <Field type="date" name="dueDate" className="mt-1 w-full rounded-lg border px-3 py-2" />
                <ErrorMessage name="dueDate" component="div" className="text-sm text-red-600 mt-1" />
              </div>

              <div>
                <label className="block text-sm font-medium">Виконавець</label>
                <div className="mt-1 flex items-center gap-3">
                  <input className="w-full rounded-lg border px-3 py-2" readOnly placeholder="Не обрано"
                         value={assignee?.name ?? ''} />
                  <button type="button" className="px-3 py-2 rounded-lg border bg-white hover:bg-slate-50"
                          onClick={() => setNestedOpen(true)}>
                    Обрати
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">Файл</label>
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2"
                type="file"
                accept="image/*,.pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
              />
              {file && <div className="text-sm text-slate-600 mt-1">Прикріплено: {file.name}</div>}
            </div>

            <Field type="hidden" name="assigneeId" />

            <AssigneePickerModal
              open={nestedOpen}
              onClose={() => setNestedOpen(false)}
              onSelect={(u) => {
                setAssignee(u);
                setFieldValue('assigneeId', u?.id ?? '');
              }}
              allowNone
            />
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default EditTaskModal;
