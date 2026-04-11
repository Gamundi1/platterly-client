import { Injectable, signal } from '@angular/core';
import { HttpHandlerService } from '../../shared/services/http-handler.service';
import { UrlProvider } from '../../shared/enums/url-provider.enum';
import { catchError, take, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private readonly httpHandlerService: HttpHandlerService) {}

  private user = signal<string | null>(null);

  login(email: string, password: string) {
    return this.httpHandlerService
      .postRequest<string>(UrlProvider.login, undefined, {
        email,
        password,
      })
      .pipe(
        take(1),
        tap((response) => this.user.set(response)),
      );
  }
}
