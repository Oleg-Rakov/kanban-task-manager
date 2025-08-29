# Task Manager — Kanban + Nested Modals (React 18 + TS)

Demo-ready starter meeting the test requirements: Kanban board (dnd-kit), Create Task modal (Formik + Yup),
**nested modal** for choosing assignee, file attachment (stored as base64), and persistence via `localStorage`.

## Stack
- React 18 + TypeScript + Vite
- Tailwind CSS
- Formik + Yup
- @dnd-kit (core, sortable, modifiers)
- React Context for state + localStorage persistence
- ESLint + Prettier + Stylelint
- Husky + lint-staged

## Getting Started
```bash
npm i
npm run prepare # installs Husky hooks
npm run dev
# open http://localhost:5173
```

## Scripts
- `npm run dev` — start Vite dev server
- `npm run build` — build for production
- `npm run preview` — serve production build locally
- `npm run lint` — ESLint (TS/TSX)
- `npm run stylelint` — Stylelint
- `npm run format` — Prettier

## Project Structure
```
src/
  components/Modal.tsx          # generic modal (portal to #modal-root)
  hooks/useLocalStorage.ts      # simple localStorage hook
  modules/
    kanban/
      KanbanBoard.tsx           # columns + create button + DnD context
      Column.tsx                # droppable column
      TaskCard.tsx              # draggable task card
    task/
      CreateTaskModal.tsx       # Formik+Yup form with file and assignee
      AssigneePickerModal.tsx   # NESTED MODAL (opened above CreateTaskModal)
  services/mockUsers.ts         # fake users
  store/tasks.tsx               # Context with reducer + localStorage mirror
  types/task.ts                 # types
  utils/uuid.ts                 # id generator
```

## Nested Modal Approach
In `CreateTaskModal.tsx` we keep the parent modal mounted while opening `AssigneePickerModal`
above it. Data flows via an **`onSelect(user)` callback** passed to the nested modal.
The parent stores the selection in local state (`assignee`) and can also reflect it
back into Formik with `setFieldValue`. This keeps responsibilities isolated and avoids
unnecessary global state for a local choice.

## Notes
- Files are stored as base64 in memory/localStorage for simplicity (meets the requirement).
  For a bonus, replace this with uploading to any cloud storage and keep URLs in `Task.file`.
- The board supports dragging tasks **between columns** (status changes). Reordering *within*
  a column can be added by mapping over sortable IDs and arrayMove if desired.
- All state survives page reload via `localStorage`.
- Husky + lint-staged are configured for basic pre-commit checks.
```
