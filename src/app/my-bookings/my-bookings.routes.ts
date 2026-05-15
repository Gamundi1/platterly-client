import { Routes } from '@angular/router';

export const MY_BOOKING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/my-bookings-page/my-bookings-page.component').then((m) => m.MyBookingsPage),
  },
];
