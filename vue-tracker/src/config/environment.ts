export const environment = {
  production: import.meta.env.PROD,
  taskApiUrl:
    import.meta.env.VITE_TASK_API_URL || 'http://localhost:3000/tasks',
};
