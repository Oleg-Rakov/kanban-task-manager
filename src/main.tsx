import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import { TasksProvider } from './store/tasks'

import './index.css'

const root = document.getElementById('root')!
createRoot(root).render(
  <React.StrictMode>
    <TasksProvider>
      <App />
    </TasksProvider>
  </React.StrictMode>
)
