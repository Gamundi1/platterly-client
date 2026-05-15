import { Component, inject } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [RouterLink, RouterLinkActive],
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);

  protected showLoginModal() {
    this.authService.showLoginModal();
  }

  protected userDetails() {
    return this.authService.getUserDetails();
  }
}
