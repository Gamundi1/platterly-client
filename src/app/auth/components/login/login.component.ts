import { Component, Inject, inject, OnDestroy, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { email, form, FormField, required } from '@angular/forms/signals';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import {
  DEFAULT_LOGIN_CONFIG,
  LoginConfig,
} from '../../../shared/interfaces/login-config.interface';
import { LoginData } from '../../interfaces/login-data.interface';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [FormField, ReactiveFormsModule, FaIconComponent, MatDialogClose],
})
export class LoginComponent implements OnDestroy {
  private readonly authService = inject(AuthService);

  constructor(@Inject(MAT_DIALOG_DATA) public data: { configuration: LoginConfig }) {}

  protected faXMark = faXmark;

  private loginModel = signal<LoginData>({
    email: '',
    password: '',
  });

  protected loginForm = form(this.loginModel, (model) => {
    required(model.email);
    required(model.password);
    email(model.email);
  });

  ngOnDestroy(): void {
    this.authService.modifyLoginConfig(DEFAULT_LOGIN_CONFIG);
  }

  protected submitLogin(event: Event) {
    event.preventDefault();
    if (this.loginForm().valid()) {
      this.authService.login(this.loginModel().email, this.loginModel().password).subscribe(() => {
        this.data.configuration.successCallback?.();
        this.authService.closeLoginModal();
      });
    }
  }
}
