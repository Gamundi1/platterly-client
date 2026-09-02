import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChildren,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { getUserAvatarColor } from '../helpers/user.helper';
import { UserRole } from '../shared/interfaces/user.interface';
import { CdkTrapFocus } from '@angular/cdk/a11y';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [RouterLink, RouterLinkActive, MatMenuModule, MatIconModule, CdkTrapFocus],
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly links = viewChildren<ElementRef>('link');

  protected readonly focusedIndex = signal(0);

  protected sideNavOpen = signal<boolean>(false);

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

  protected getCurrentUserAvatarColor(): string {
    return getUserAvatarColor(this.userDetails()?.name || '');
  }

  protected headerMapByRole() {
    switch (this.userDetails()?.role) {
      case UserRole.USER:
        return [
          {
            link: '/home',
            label: 'Inicio',
          },
          {
            link: '/menu',
            label: 'Nuestras Cartas',
          },
          {
            link: '/bookings',
            label: 'Reservar Mesa',
          },
          {
            link: '/my-bookings',
            label: 'Mis Reservas',
          },
        ];
      case UserRole.CHEF:
        return [
          {
            link: '/home',
            label: 'Inicio',
          },
          {
            link: '/enterprise/chef',
            label: 'Pedidos',
          },
        ];
      case UserRole.WAITER:
        return [
          {
            link: '/home',
            label: 'Inicio',
          },
          {
            link: '/enterprise/waiter',
            label: 'Pedidos',
          },
          {
            link: '/enterprise/orders',
            label: 'Crear pedido',
          },
        ];
      case UserRole.HOST:
        return [
          {
            link: '/home',
            label: 'Inicio',
          },
          {
            link: '/enterprise/host',
            label: 'Ver reservas',
          },
          {
            link: '/bookings',
            label: 'Crear reserva',
          },
        ];
      case UserRole.ADMIN:
        return [
          {
            link: '/home',
            label: 'Inicio',
          },
          {
            link: '/enterprise/admin',
            label: 'Panel de administración',
          },
        ];
      default:
        return [
          {
            link: '/home',
            label: 'Inicio',
          },
          {
            link: '/menu',
            label: 'Nuestras Cartas',
          },
          {
            link: '/bookings',
            label: 'Reservar Mesa',
          },
        ];
    }
  }

  protected toggleSideNav() {
    this.sideNavOpen.set(!this.sideNavOpen());
    if (this.sideNavOpen()) {
      this.disableBackgroundScroll();
    }
  }

  protected closeSideNav() {
    this.sideNavOpen.set(false);
    document.body.style.overflow = 'auto';
  }

  protected disableBackgroundScroll() {
    document.body.style.overflow = 'hidden';
  }

  protected manageKeyboardNavigation(event: KeyboardEvent) {
    if (!this.links().length) {
      return;
    }

    let nextIndex = this.focusedIndex();

    switch (event.key) {
      case 'ArrowRight':
        nextIndex = (nextIndex + 1) % this.links().length;
        break;

      case 'ArrowLeft':
        nextIndex = (nextIndex - 1 + this.links().length) % this.links().length;
        break;

      case 'Home':
        event.preventDefault();
        nextIndex = 0;
        break;

      case 'End':
        event.preventDefault();
        nextIndex = this.links().length - 1;
        break;
    }

    this.focusedIndex.set(nextIndex);
    this.links()[nextIndex].nativeElement.focus();
  }
}
