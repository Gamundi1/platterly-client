import { Component, effect, inject, LOCALE_ID, TemplateRef, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { AuthService } from './auth/services/auth.service';
import { HeaderComponent } from './header/header.component';
import { OverlayContainerComponent } from './shared/components/overlay-container/overlay-container.component';
import { ModalService } from './shared/services/modal.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    LoginComponent,
    OverlayContainerComponent,
    FontAwesomeModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class App {
  private readonly authService = inject(AuthService);
  private readonly loginModal = viewChild<TemplateRef<LoginComponent>>('loginModal');
  private readonly modalService = inject(ModalService);

  constructor() {
    effect(() => {
      if (this.authService.loginModalOpen()) {
        this.modalService.showModal(this.loginModal()!);
      } else {
        this.modalService.closeModal();
      }
    });
  }

  protected closeLoginModal() {
    this.authService.closeLoginModal();
  }
}
