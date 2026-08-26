import { Component, inject, OnInit, signal } from '@angular/core';
import { disabled, form, minLength, required } from '@angular/forms/signals';
import { InputComponent } from '../../../shared/components/input/input.component';
import { AuthService } from '../../services/auth.service';
import { User, UserRole } from '../../../shared/interfaces/user.interface';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-register-page',
  imports: [InputComponent],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
})
export class RegisterPage implements OnInit {
  ngOnInit(): void {
    this.fillNameIfAvailable();
  }
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly matDialog = inject(MatDialog);

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
    minLength(model.password, 12);
    disabled(model.name, { when: () => this.authService.getUserDetails()?.name !== undefined });
  });

  protected openLogin() {
    this.router.navigate(['/home']).then(() => {
      this.authService.showLoginModal();
    });
  }

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
      this.authService
        .register(user)
        .pipe(
          catchError(() => {
            this.showErrorModal();
            return [];
          }),
        )
        .subscribe(() => {
          this.router.navigate(['/home']);
        });
    } else {
    }
  }

  private showErrorModal() {
    this.matDialog.open(ErrorModalComponent, {
      data: {
        title: 'Error creando el usuario',
        message:
          'Ha ocurrido un error al crear el usuario. Por favor, revisa los datos e inténtalo de nuevo.',
      },
    });
  }

  private fillNameIfAvailable() {
    const user = this.authService.getUserDetails();
    if (user && user.name) {
      this.registerForm.name().value.set(user.name);
    }
  }
}
