export const ADMIN_ROUTES = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing-page/landing-page.component').then((m) => m.LandingPageComponent),
  },
  {
    path: 'modify-menu',
    loadComponent: () =>
      import('./pages/modify-menu-page/modify-menu-page.component').then(
        (m) => m.ModifyMenuPageComponent,
      ),
  },
];
