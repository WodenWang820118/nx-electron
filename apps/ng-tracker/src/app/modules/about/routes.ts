import { Routes } from '@angular/router';

export const ABOUT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./views/about-view.component').then((m) => m.AboutViewComponent),
  },
];
