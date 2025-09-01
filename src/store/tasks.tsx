import React, { createContext, useContext, useEffect, useMemo, useReducer, useCallback } from 'react';
import type { Task, Status } from '../types/task';
import { useLocalStorage } from '../hooks/useLocalStorage';

type Action =
  | { type: 'add'; task: Task }
  | { type: 'update'; task: Task }
  | { type: 'move'; id: string; status: Status }
  | { type: 'delete'; id: string }
  | { type: 'reorder'; status: Status; id: string; toIndex: number };

function reducer(state: Task[], action: Action): Task[] {
  switch (action.type) {
    case 'add':
      return [action.task, ...state];
    case 'update':
      return state.map((t) => (t.id === action.task.id ? action.task : t));
    case 'move':
      return state.map((t) => (t.id === action.id ? { ...t, status: action.status } : t));
    case 'delete':
      return state.filter((t) => t.id !== action.id);
    case 'reorder': {
      const { status, id, toIndex } = action;
      const indices = state.reduce<number[]>((acc, t, i) => {
        if (t.status === status) acc.push(i);
        return acc;
      }, []);
      const fromIdxInState = state.findIndex((t) => t.id === id);
      if (fromIdxInState === -1) return state;

      const fromPos = indices.indexOf(fromIdxInState);
      if (fromPos === -1) return state;

      const clampedTo = Math.max(0, Math.min(toIndex, indices.length - 1));
      if (fromPos === clampedTo) return state;

      const newIndices = [...indices];
      const [moved] = newIndices.splice(fromPos, 1);
      newIndices.splice(clampedTo, 0, moved);

      const newState = [...state];
      const tasksOfStatus = newIndices.map((idx) => newState[idx]);
      let writePtr = 0;
      for (let i = 0; i < newState.length; i++) {
        if (newState[i].status === status) {
          newState[i] = tasksOfStatus[writePtr++];
        }
      }
      return newState;
    }
    default:
      return state;
  }
}

interface Ctx {
  tasks: Task[];
  dispatch: React.Dispatch<Action>;
}

const TasksContext = createContext<Ctx | null>(null);

export const TasksProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [persisted, setPersisted] = useLocalStorage<Task[]>('tm_tasks', []);
  const [state, dispatchBase] = useReducer(reducer, persisted);

  useEffect(() => {
    setPersisted(state);
  }, [state, setPersisted]);

  const dispatch = useCallback<React.Dispatch<Action>>((action) => {
    dispatchBase(action);
  }, []);

  const value = useMemo(() => ({ tasks: state, dispatch }), [state, dispatch]);
  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
};

export const useTasks = () => {
  const ctx = useContext(TasksContext);
  if (!ctx) throw new Error('useTasks must be used within TasksProvider');
  return ctx;
};
