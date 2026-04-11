import { Component, signal } from '@angular/core';
import { LoginComponent } from '../auth/components/login/login.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [LoginComponent],
})
export class HeaderComponent {
  protected showLogin = signal(false);

  showLoginModal() {
    this.showLogin.set(true);
  }
}
