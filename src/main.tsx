import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
// import { TasksProvider } from './store/tasks'

const root = document.getElementById('root')!
createRoot(root).render(
  <React.StrictMode>
    {/*<TasksProvider>*/}
      <App />
    {/*</TasksProvider>*/}
  </React.StrictMode>
)
