import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'bookings',
    loadChildren: () => import('./bookings/bookings.routes').then((m) => m.BOOKING_ROUTES),
  },
];
