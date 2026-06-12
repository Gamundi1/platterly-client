import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [RouterLink, RouterLinkActive, MatMenuModule, MatIconModule],
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected showLoginModal() {
    this.authService.showLoginModal();
  }

  protected userDetails() {
    return this.authService.getUserDetails();
  }

  protected logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
