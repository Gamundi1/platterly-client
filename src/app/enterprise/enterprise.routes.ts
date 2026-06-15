export const ENTERPRISE_ROUTES = [
  {
    path: 'waiter',
    loadComponent: () =>
      import('./pages/waiter-page/waiter-page.component').then((m) => m.WaiterPageComponent),
  },
  {
    path: 'host',
    loadComponent: () =>
      import('./pages/host-page/host-page.component').then((m) => m.HostPageComponent),
  },
  {
    path: 'chef',
    loadComponent: () =>
      import('./pages/chef-page/chef-page.component').then((m) => m.ChefPageComponent),
  },
];
