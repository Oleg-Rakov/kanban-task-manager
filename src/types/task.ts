export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'inprogress' | 'done';

export interface User {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
}

export interface TaskFile {
  name: string;
  type: string;
  size: number;
  base64: string; // stored locally
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string;
  status: Status;
  assignee?: User | null;
  file?: TaskFile | null;
  createdAt: string;
  updatedAt: string;
}
