import { Routes } from '@angular/router';

export const NEW_BOOKING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/new-booking-page/new-booking-page.component').then(
        (m) => m.NewBookingPageComponent,
      ),
  },
  {
    path: 'invitation',
    loadComponent: () =>
      import('./pages/invitation/invitation-page.component').then((m) => m.InvitationPageComponent),
  },
];
