import { Injectable, signal } from '@angular/core';
import { take, tap } from 'rxjs';
import { UrlProvider } from '../../shared/enums/url-provider.enum';
import { HttpHandlerService } from '../../shared/services/http-handler.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private readonly httpHandlerService: HttpHandlerService) {}

  private user = signal<{ 'access-token': string } | null>(null);
  private showLogin = signal(false);
  public readonly loginModalOpen = this.showLogin.asReadonly();

  login(email: string, password: string) {
    return this.httpHandlerService
      .postRequest<{ 'access-token': string }>(UrlProvider.login, undefined, {
        email,
        password,
      })
      .pipe(
        take(1),
        tap((response) => this.user.set(response)),
      );
  }

  public getUserDetails() {
    return this.user();
  }

  public showLoginModal() {
    this.showLogin.set(true);
  }
  public closeLoginModal() {
    this.showLogin.set(false);
  }
}
