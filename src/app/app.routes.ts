import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./home/pages/home-page/home-page.component').then((m) => m.HomePageComponent),
  },
  {
    path: 'bookings',
    loadChildren: () =>
      import('./new-bookings/new-bookings.routes').then((m) => m.NEW_BOOKING_ROUTES),
  },
  {
    path: 'my-bookings',
    loadChildren: () => import('./my-bookings/my-bookings.routes').then((m) => m.MY_BOOKING_ROUTES),
  },
  {
    path: 'enterprise',
    loadChildren: () => import('./enterprise/enterprise.router').then((m) => m.ENTERPRISE_ROUTES),
  },
  {
    path: 'menu',
    loadChildren: () => import('./menu/menu.routes').then((m) => m.MENU_ROUTES),
  },
  {
    path: '403',
    loadComponent: () =>
      import('./error/pages/not-authorized-page/not-authorized-page.component').then(
        (m) => m.NotAuthorizedPageComponent,
      ),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
