import React, { useMemo, useState, useCallback } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Modal } from '../../components/Modal';
import type { Task, Priority, User } from '../../types/task';
import { useTasks } from '../../store/tasks';
import AssigneePickerModal from './AssigneePickerModal';
import { uuid } from '../../utils/uuid';

const schema = Yup.object({
  title: Yup.string().min(2, 'Мінімум 2 символи').required('Обов’язково'),
  description: Yup.string().max(2000, 'Макс 2000 символів').optional(),
  priority: Yup.mixed<Priority>().oneOf(['low', 'medium', 'high']).required(),
  dueDate: Yup.string().optional(),
});

interface Props {
  open: boolean;
  onClose: () => void;
}

const CreateTaskModal: React.FC<Props> = ({ open, onClose }) => {
  const { dispatch } = useTasks();
  const [assignee, setAssignee] = useState<User | null>(null);
  const [file, setFile] = useState<{ name: string; type: string; size: number; base64: string } | null>(null);
  const [nestedOpen, setNestedOpen] = useState(false);

  const initialValues = useMemo(
    () => ({
      title: '',
      description: '',
      priority: 'medium' as Priority,
      dueDate: '',
      assigneeId: '' as string | null,
    }),
    [],
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

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Створити задачу"
      footer={
        <div className="flex justify-end gap-3">
          <button type="button" className="px-4 py-2 rounded-lg border" onClick={onClose}>
            Скасувати
          </button>
          <button type="submit" form="create-task-form" className="px-4 py-2 rounded-lg bg-indigo-600 text-white">
            Створити
          </button>
        </div>
      }
    >
      <Formik
        validationSchema={schema}
        initialValues={initialValues}
        onSubmit={(values, helpers) => {
          const now = new Date().toISOString();
          const task: Task = {
            id: uuid(),
            title: values.title.trim(),
            description: values.description,
            priority: values.priority,
            dueDate: values.dueDate || undefined,
            status: 'todo',
            assignee,
            file,
            createdAt: now,
            updatedAt: now,
          };
          dispatch({ type: 'add', task });
          helpers.resetForm();
          setAssignee(null);
          setFile(null);
          onClose();
        }}
      >
        {({ setFieldValue }) => (
          <Form id="create-task-form" className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Назва</label>
              <Field
                name="title"
                className="mt-1 w-full rounded-lg border px-3 py-2"
                placeholder="Напр. Підготувати звіт"
              />
              <ErrorMessage name="title" component="div" className="text-sm text-red-600 mt-1" />
            </div>

            <div>
              <label className="block text-sm font-medium">Опис</label>
              <Field
                as="textarea"
                name="description"
                className="mt-1 w-full rounded-lg border px-3 py-2"
                rows={4}
                placeholder="Деталі задачі..."
              />
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
                  <input
                    className="w-full rounded-lg border px-3 py-2"
                    readOnly
                    placeholder="Не обрано"
                    value={assignee?.name ?? ''}
                  />
                  <button
                    type="button"
                    className="px-3 py-2 rounded-lg border bg-white hover:bg-slate-50"
                    onClick={() => setNestedOpen(true)}
                  >
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

export default CreateTaskModal;
