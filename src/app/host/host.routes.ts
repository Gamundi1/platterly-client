import { Routes } from '@angular/router';

export const HOST_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/host-page/host-page.component').then((m) => m.HostPageComponent),
  },
];
