import { Routes } from '@angular/router';

export const MENU_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/view-menu/view-menu-page.component').then((m) => m.ViewMenuPage),
  },
];
