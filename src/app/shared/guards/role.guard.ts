// role.guard.ts
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { UserRole } from '../interfaces/user.interface';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as UserRole[];
  const hasToBeAuthenticated = route.data['requiresAuth'] as boolean;

  if (hasToBeAuthenticated && !authService.getUserDetails()) {
      return false;
  }

  // Ruta sin roles -> permitir
  if (!requiredRoles || requiredRoles.length === 0) {

    return true;
  }

  // Tiene algún rol requerido
  const hasPermission = authService.hasAnyRole(requiredRoles);

  if (!hasPermission) {
    return router.createUrlTree(['/403']);
  }

  return true;
};
