import { Component, inject, output, signal } from '@angular/core';
import { LoginData } from '../../interfaces/login-data.interface';
import { email, form, FormField, required } from '@angular/forms/signals';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [FormField],
})
export class LoginComponent {
  private readonly authService = inject(AuthService);

  protected closeDialog = output<void>();

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
