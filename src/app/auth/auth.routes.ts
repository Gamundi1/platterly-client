import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register-page/register-page.component').then((m) => m.RegisterPage),
  },
];
