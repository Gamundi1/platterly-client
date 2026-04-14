import { Routes } from '@angular/router';

export const BOOKING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/new-booking-page/new-booking-page.component').then(
        (m) => m.NewBookingPageComponent,
      ),
  },
];
