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
    path: 'host',
    loadChildren: () => import('./host/host.routes').then((m) => m.HOST_ROUTES),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
