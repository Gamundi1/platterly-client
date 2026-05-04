import { Component, inject } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [RouterLink],
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);

  protected showLoginModal() {
    this.authService.showLoginModal();
  }
}
