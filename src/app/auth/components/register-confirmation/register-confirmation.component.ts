import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';

@Component({
  templateUrl: './register-confirmation.component.html',
  styleUrl: './register-confirmation.component.scss',
  imports: [RouterLink, FaIconComponent],
})
export class RegisterConfirmationComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  protected readonly faCircleCheck = faCircleCheck;

  protected openLogin() {
    this.router.navigate(['/home']).then(() => {
      this.authService.showLoginModal();
    });
  }
}
