import { roleGuard } from '../shared/guards/role.guard';
import { UserRole } from '../shared/interfaces/user.interface';

export const ENTERPRISE_ROUTES = [
  {
    path: 'waiter',
    canActivate: [roleGuard],
    data: { roles: [UserRole.WAITER], requiresAuth: true },
    loadComponent: () =>
      import('./pages/waiter-page/waiter-page.component').then((m) => m.WaiterPageComponent),
  },
  {
    path: 'host',
    canActivate: [roleGuard],
    data: { roles: [UserRole.HOST], requiresAuth: true },
    loadComponent: () =>
      import('./pages/host-page/host-page.component').then((m) => m.HostPageComponent),
  },
  {
    path: 'chef',
    canActivate: [roleGuard],
    data: { roles: [UserRole.CHEF], requiresAuth: true },
    loadComponent: () =>
      import('./pages/chef-page/chef-page.component').then((m) => m.ChefPageComponent),
  },
  {
    path: 'admin',
    canActivate: [roleGuard],
    data: { roles: [UserRole.ADMIN], requiresAuth: true },
    loadChildren: () => import('./pages/admin-page/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
];
