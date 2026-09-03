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
  {
    path: 'create-menu',
    loadComponent: () =>
      import('./pages/create-menu-page/create-menu-page.component').then(
        (m) => m.CreateMenuPageComponent,
      ),
  },
  {
    path: 'create-product',
    loadComponent: () =>
      import('./pages/create-product-page/create-product-page.component').then(
        (m) => m.CreateProductPageComponent,
      ),
  },
  {
    path: 'create-ingredient',
    loadComponent: () =>
      import('./pages/create-ingredient-page/create-ingredient-page.component').then(
        (m) => m.CreateIngredientPageComponent,
      ),
  },
];
