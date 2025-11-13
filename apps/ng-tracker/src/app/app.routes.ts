import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./modules/tracker/routes').then((m) => m.TRACKER_ROUTES),
  },
  {
    path: 'add-task',
    loadChildren: () =>
      import('./modules/add-task/routes').then((m) => m.ADD_TASK_ROUTES),
  },
  {
    path: 'about',
    loadChildren: () =>
      import('./modules/about/routes').then((m) => m.ABOUT_ROUTES),
  },
];
