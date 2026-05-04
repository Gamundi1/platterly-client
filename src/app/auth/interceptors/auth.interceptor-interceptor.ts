import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core/primitives/di';
import { AuthService } from '../services/auth.service';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const userDetails = authService.getUserDetails();

  if (userDetails) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${userDetails['access-token']}`),
    });
    return next(authReq);
  }

  return next(req);
};
