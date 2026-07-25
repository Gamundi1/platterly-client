import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './auth/services/auth.service';
import { HeaderComponent } from './header/header.component';
import { SocketService } from './socket/services/socket.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, MatIcon],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.component.scss',
})
export class App {
  private readonly socketService: SocketService = inject(SocketService);
  private readonly router: Router = inject(Router);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly authService = inject(AuthService);

  constructor() {
    this.router.events.pipe(filter((event) => event instanceof NavigationStart)).subscribe(() => {
      this.dialog.closeAll();
    });
    this.socketService.connect();

    effect(() => {
      this.authService.getUserDetails();
    });
  }
}
