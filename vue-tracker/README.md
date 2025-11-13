# Vue Tracker

A modern task management application built with Vue 3, TypeScript, and PrimeVue, featuring the same functionality as the Angular ng-tracker application.

## Features

- ✅ **Task Management**: Create, read, update, and delete tasks
- 🔔 **Reminders**: Set reminders for important tasks
- 🔍 **Search & Filter**: Quickly find tasks with search functionality
- 📄 **Pagination**: Handle large task lists efficiently
- 🌓 **Dark Mode**: Toggle between light and dark themes
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technology Stack

- **Vue 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Type-safe development
- **PrimeVue** - Rich UI component library
- **Vite** - Fast build tool and dev server
- **Nx** - Monorepo management and build tools
- **Axios** - HTTP client for API requests
- **Tailwind CSS** - Utility-first CSS framework

## Project Structure

```
vue-tracker/
├── src/
│   ├── app/
│   │   └── App.vue           # Main app component
│   ├── components/
│   │   ├── shared/           # Shared components (Header, Footer)
│   │   └── tasks/            # Task-related components
│   ├── composables/          # Vue composables (useTheme, useConfirm)
│   ├── config/               # Configuration files
│   ├── interfaces/           # TypeScript interfaces
│   ├── router/               # Vue Router configuration
│   ├── services/             # API services
│   └── views/                # Page views
├── vite.config.ts            # Vite configuration
└── project.json              # Nx project configuration
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (workspace package manager)
- Running backend server (nest-backend on port 5000)

### Development

1. **Start the backend server** (in another terminal):

   ```bash
   pnpm dev-back
   ```

2. **Start the Vue development server**:

   ```bash
   pnpm dev-vue
   ```

3. Open your browser to `http://localhost:4200`

### Available Scripts

- `nx serve vue-tracker` - Start development server
- `nx build vue-tracker` - Build for production
- `nx test vue-tracker` - Run unit tests
- `nx lint vue-tracker` - Lint the code

## API Integration

The application connects to a NestJS backend API running on `http://localhost:5000/tasks`. The proxy configuration in `vite.config.ts` forwards requests from `/tasks` to the backend server.

### API Endpoints

- `GET /tasks` - Fetch paginated tasks with optional search
- `POST /tasks/create` - Create a new task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

## Key Components

### TasksComponent.vue

Main component that displays the task list with search, pagination, and real-time updates.

### TaskItem.vue

Individual task card with reminder indicator and delete functionality. Double-click to toggle reminder.

### TaskForm.vue

Form component for adding new tasks with validation.

### HeaderComponent.vue

Navigation header with routing and theme toggle.

## Composables

### useTheme

Manages light/dark theme switching with localStorage persistence.

### useConfirm

Provides confirmation dialogs for destructive actions like task deletion.

## Styling

The application uses a combination of:

- **Tailwind CSS** for utility classes
- **PrimeVue themes** (Aura preset) for component styling
- **Dark mode** support via CSS classes

## Comparison with ng-tracker

This Vue application implements the same features as the Angular ng-tracker application:

- Identical UI/UX
- Same API integration
- Feature parity (CRUD operations, search, pagination, reminders)
- Similar project structure adapted for Vue best practices

## License

MIT
