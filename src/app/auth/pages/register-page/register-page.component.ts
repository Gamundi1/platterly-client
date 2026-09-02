import { Component, inject, OnInit, signal } from '@angular/core';
import { disabled, form, minLength, required } from '@angular/forms/signals';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { InputComponent } from '../../../shared/components/input/input.component';
import { User, UserRole } from '../../../shared/interfaces/user.interface';
import { ErrorService } from '../../../shared/services/error.service';
import { AuthService } from '../../services/auth.service';
import { RegisterConfirmationComponent } from '../../components/register-confirmation/register-confirmation.component';

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
  private readonly errorService = inject(ErrorService);
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
          catchError((error) => {
            this.errorService.showErrorModal(error.error, 'Entendido', () => {
              this.errorService.closeErrorModal();
            });
            return [];
          }),
        )
        .subscribe(() => {
          this.matDialog.open(RegisterConfirmationComponent, {
            disableClose: true,
            panelClass: 'fullscreen',
          });
        });
    }
  }

  private fillNameIfAvailable() {
    const user = this.authService.getUserDetails();
    if (user && user.name) {
      this.registerForm.name().value.set(user.name);
    }
  }
}
