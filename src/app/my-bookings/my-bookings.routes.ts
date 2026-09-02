import { Routes } from '@angular/router';
import { roleGuard } from '../shared/guards/role.guard';
import { UserRole } from '../shared/interfaces/user.interface';

export const MY_BOOKING_ROUTES: Routes = [
  {
    canActivate: [roleGuard],
    data: { roles: [UserRole.USER], requiresAuth: true },
    path: '',
    loadComponent: () =>
      import('./pages/my-bookings-page/my-bookings-page.component').then((m) => m.MyBookingsPage),
  },
  {
    canActivate: [roleGuard],
    data: { roles: [UserRole.USER], requiresAuth: true },
    path: ':bookingId',
    loadComponent: () =>
      import('./pages/booking-page/booking-page.component').then((m) => m.BookingPageComponent),
  },
];
