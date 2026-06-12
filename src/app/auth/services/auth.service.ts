import { effect, inject, Injectable, signal } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { tap } from 'rxjs';
import { UrlProvider } from '../../shared/enums/url-provider.enum';
import { DEFAULT_LOGIN_CONFIG, LoginConfig } from '../../shared/interfaces/login-config.interface';
import { HttpHandlerService } from '../../shared/services/http-handler.service';
import { LoginComponent } from '../components/login/login.component';
import { JwtTokens } from '../interfaces/jwt-tokens.interface';
import { UserRole } from '../../shared/interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private jwtTokens = signal<JwtTokens | null>(null);
  private loginConfig = signal<LoginConfig>(DEFAULT_LOGIN_CONFIG);
  private userDetails = signal<any | null>(null);
  public readonly loginConfiguration = this.loginConfig.asReadonly();

  private readonly httpHandlerService = inject(HttpHandlerService);
  private readonly matDialog = inject(MatDialog);

  private loginComponentRef: MatDialogRef<LoginComponent> | null = null;

  constructor() {
    effect(() => {
      if (this.jwtTokens()) {
        this.httpHandlerService.getRequest(UrlProvider.user).subscribe((user) => {
          this.userDetails.set(user);
        });
      }
    });

    const accessToken = localStorage.getItem('access-token');

    if (accessToken) {
      this.jwtTokens.set({
        accessToken,
      });
    }
  }

  login(email: string, password: string) {
    return this.httpHandlerService
      .postRequest<{ 'access-token': string }>(UrlProvider.login, undefined, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          this.saveTokens(response);
        }),
      );
  }

  logout() {
    this.httpHandlerService.postRequest(UrlProvider.logout).subscribe(() => {
      this.jwtTokens.set(null);
      this.userDetails.set(null);
      localStorage.removeItem('access-token');
    });
  }

  register(name: string) {
    return this.httpHandlerService
      .postRequest<{ 'access-token': string }>(UrlProvider.register, undefined, {
        name,
      })
      .pipe(
        tap((response) => {
          this.saveTokens(response);
        }),
      );
  }

  hasAnyRole(roles: UserRole[]): boolean {
    const user = this.userDetails();
    if (!user || !user.role) {
      return false;
    }
    return roles.includes(user.role);
  }

  public getAccessToken() {
    return this.jwtTokens()?.accessToken;
  }

  public getUserDetails() {
    return this.userDetails();
  }

  public showLoginModal() {
    this.loginComponentRef = this.matDialog.open(LoginComponent, {
      data: { configuration: this.loginConfiguration() },
      panelClass: 'login-modal',
      maxWidth: '100vw',
    });
  }

  public closeLoginModal() {
    if (this.loginComponentRef) {
      this.loginComponentRef.close();
    }
  }

  public modifyLoginConfig(configuration: LoginConfig) {
    this.loginConfig.set({ ...this.loginConfig(), ...configuration });
  }

  public refreshTokens() {
    return this.httpHandlerService
      .postRequest<{ 'access-token': string }>(UrlProvider.refresh)
      .pipe(tap((tokens) => this.saveTokens(tokens)));
  }

  private saveTokens(tokens: { 'access-token': string }) {
    this.jwtTokens.set({
      accessToken: tokens['access-token'],
    });
    localStorage.setItem('access-token', tokens['access-token']);
  }
}
