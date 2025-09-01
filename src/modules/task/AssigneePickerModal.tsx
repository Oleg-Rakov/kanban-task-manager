import React, { useCallback } from 'react';
import { Modal } from '../../components/Modal';
import { mockUsers } from '../../services/mockUsers';
import type { User } from '../../types/task';

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (user: User | null) => void;
  allowNone?: boolean;
}

const AssigneePickerModal: React.FC<Props> = ({ open, onClose, onSelect, allowNone = true }) => {
  const handleSelect = useCallback(
    (u: User | null) => {
      onSelect(u);
      onClose();
    },
    [onSelect, onClose]
  );

  return (
    <Modal open={open} onClose={onClose} title="Обрати виконавця">
      <div className="max-h-[60vh] overflow-auto rounded-xl border">
        <ul className="divide-y">
          {allowNone && (
            <li className="p-3 flex items-center justify-between">
              <div className="text-slate-600">Без виконавця</div>
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg border hover:bg-slate-50"
                onClick={() => handleSelect(null)}
                aria-label="Зняти виконавця"
              >
                Обрати
              </button>
            </li>
          )}

          {mockUsers.map((u) => (
            <li key={u.id} className="p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{u.name}</div>
                <div className="text-sm text-slate-500">{u.email}</div>
              </div>
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                onClick={() => handleSelect(u)}
                aria-label={`Обрати виконавця ${u.name}`}
              >
                Обрати
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
};

export default AssigneePickerModal;
