# react-tracker

A modern task management application built with React, TypeScript, and PrimeReact.

## Features

- ✅ Create, read, update, and delete tasks
- 🔔 Set reminders for important tasks
- 🔍 Search and filter your tasks
- 📄 Pagination for large task lists
- 🌓 Dark mode support
- 📱 Responsive design for all devices

## Technology Stack

- **React 19** with TypeScript
- **React Router** for navigation
- **PrimeReact** for UI components
- **Tailwind CSS** for styling
- **Axios** for API requests
- **Vite** for build tooling
- **Nx** for monorepo management

## Development

### Run the development server

```bash
pnpm run dev-react
```

The application will be available at [http://localhost:4200](http://localhost:4200)

### Run the backend API

```bash
pnpm run dev-back
```

The API will be available at [http://localhost:3000](http://localhost:3000)

## Project Structure

```
react-tracker/
├── src/
│   ├── app/
│   │   └── app.tsx              # Main app component with routing
│   ├── components/
│   │   ├── shared/              # Shared components (Header, Footer)
│   │   └── tasks/               # Task-related components
│   ├── config/
│   │   └── environment.ts       # Environment configuration
│   ├── hooks/
│   │   ├── useTheme.ts          # Theme management hook
│   │   └── useConfirm.ts        # Confirmation dialog hook
│   ├── interfaces/
│   │   └── task.interface.ts    # TypeScript interfaces
│   ├── services/
│   │   └── task.service.ts      # API service for tasks
│   ├── views/                   # Page views
│   │   ├── HomeView.tsx
│   │   ├── AddTaskView.tsx
│   │   └── AboutView.tsx
│   ├── main.tsx                 # Application entry point
│   └── styles.css               # Global styles
├── index.html                   # HTML template
├── vite.config.ts              # Vite configuration
├── project.json                # Nx project configuration
└── tsconfig.json               # TypeScript configuration
```

## Usage

1. **View Tasks**: The home page displays all your tasks with pagination
2. **Add Task**: Click "Add Task" to create a new task with description, due date, and reminder
3. **Toggle Reminder**: Double-click any task to toggle its reminder status
4. **Delete Task**: Click the × button to delete a task (with confirmation)
5. **Search**: Use the search box to filter tasks
6. **Theme**: Toggle between light and dark mode using the theme button in the header

## Building for Production

```bash
nx build react-tracker
```

The build artifacts will be stored in the `dist/react-tracker` directory.

## Testing

```bash
nx test react-tracker
```

## License

MIT
