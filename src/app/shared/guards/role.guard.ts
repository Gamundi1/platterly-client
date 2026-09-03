import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { UserRole } from '../interfaces/user.interface';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, Observable, take } from 'rxjs';

export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as UserRole[];
  const hasToBeAuthenticated = route.data['requiresAuth'] as boolean;

  return toObservable(authService.isAuthInitialized).pipe(
    filter((isAuthInitialized) => isAuthInitialized),
    take(1),
    map(() => {
      const user = authService.getUserDetails();

      if (hasToBeAuthenticated && !user) {
        authService.modifyLoginConfig({
          successCallback: () => {
            router.navigateByUrl(state.url);
          },
        });
        authService.showLoginModal();
        return false;
      }

      if (!requiredRoles || requiredRoles.length === 0) {
        return true;
      }

      const hasPermission = authService.hasAnyRole(requiredRoles);

      if (!hasPermission) {
        return router.createUrlTree(['/403']);
      }

      return true;
    }),
  );
};
