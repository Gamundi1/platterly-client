import { Component, inject, signal } from '@angular/core';
import { form, minLength, required } from '@angular/forms/signals';
import { InputComponent } from '../../../shared/components/input/input.component';
import { AuthService } from '../../services/auth.service';
import { User, UserRole } from '../../../shared/interfaces/user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  imports: [InputComponent],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
})
export class RegisterPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  registerModel = signal({
    name: '',
    surname: '',
    secondSurname: '',
    email: '',
    password: '',
  });

  registerForm = form(this.registerModel, (model) => {
    required(model.name);
    required(model.surname);
    required(model.email);
    required(model.password);
    minLength(model.password, 8);
  });

  protected registerUser(event: Event) {
    event.preventDefault();

    if (this.registerForm().valid()) {
      const user: User = {
        name: this.registerModel().name,
        surname: this.registerModel().surname,
        secondSurname: this.registerModel().secondSurname,
        email: this.registerModel().email,
        password: this.registerModel().password,
        role: UserRole.USER,
      };
      this.authService.register(user).subscribe(() => {
        this.router.navigate(['/home']);
      });
    } else {
      console.log('Form is invalid');
      console.log('Errors:', this.registerForm().errors());
    }
  }
}
