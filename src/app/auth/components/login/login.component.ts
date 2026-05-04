import { Component, inject, output, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { email, form, FormField, required } from '@angular/forms/signals';
import { LoginData } from '../../interfaces/login-data.interface';
import { AuthService } from '../../services/auth.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [FormField, ReactiveFormsModule, FaIconComponent],
})
export class LoginComponent {
  private readonly authService = inject(AuthService);

  protected closeDialog = output<void>();

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

  protected submitLogin(event: Event) {
    event.preventDefault();
    if (this.loginForm().valid()) {
      this.authService.login(this.loginModel().email, this.loginModel().password).subscribe();
    }
  }
}
