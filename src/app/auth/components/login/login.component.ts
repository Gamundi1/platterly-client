import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  inject,
  OnDestroy,
  Renderer2,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { email, form, required } from '@angular/forms/signals';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faTriangleExclamation, faXmark } from '@fortawesome/free-solid-svg-icons';
import { catchError } from 'rxjs';
import { InputComponent } from '../../../shared/components/input/input.component';
import {
  DEFAULT_LOGIN_CONFIG,
  LoginConfig,
} from '../../../shared/interfaces/login-config.interface';
import { LoginData } from '../../interfaces/login-data.interface';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FaIconComponent, MatDialogClose, InputComponent, RouterLink],
})
export class LoginComponent implements OnDestroy {
  private readonly authService = inject(AuthService);

  constructor(@Inject(MAT_DIALOG_DATA) public data: { configuration: LoginConfig }) {}

  protected faXMark = faXmark;
  protected faTriangleExclamation = faTriangleExclamation;

  private loginModel = signal<LoginData>({
    email: '',
    password: '',
  });

  protected invalidCredentials = signal(false);

  protected loginForm = form(this.loginModel, (model) => {
    required(model.email);
    required(model.password);
    email(model.email);
  });

  ngOnDestroy(): void {
    this.authService.modifyLoginConfig(DEFAULT_LOGIN_CONFIG);
    this.invalidCredentials.set(false);
  }

  protected submitLogin(event: Event) {
    event.preventDefault();
    if (this.loginForm().valid()) {
      this.authService
        .login(this.loginModel().email, this.loginModel().password)
        .pipe(
          catchError((error) => {
            this.manageLoginError(error.error.code);
            throw error;
          }),
        )
        .subscribe(() => {
          this.data.configuration.successCallback?.();
          this.authService.closeLoginModal();
        });
    }
  }

  private manageLoginError(errorCode: string) {
    if (errorCode === 'INVALID_CREDENTIALS') {
      this.invalidCredentials.set(true);
    }
  }
}
