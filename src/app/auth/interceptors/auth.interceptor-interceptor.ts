import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core/primitives/di';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { UrlProvider } from '../../shared/enums/url-provider.enum';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const accessToken = authService.getAccessToken();

  let authReq = req;
  const authEndpoints = [UrlProvider.login, UrlProvider.register, UrlProvider.refresh];
  const isAuthRequest = authEndpoints.some((path) => authReq.url.endsWith(path));

  if (accessToken) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
      withCredentials: true,
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401 && accessToken && !isAuthRequest) {
        return authService.refreshTokens().pipe(
          switchMap(() => {
            const newAccessToken = authService.getAccessToken();

            if (newAccessToken) {
              const newAuthReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${newAccessToken}`),
                withCredentials: true,
              });
              return next(newAuthReq);
            }

            return next(req);
          }),
        );
      }
      return throwError(() => error);
    }),
  );
};
