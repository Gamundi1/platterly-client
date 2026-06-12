import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { HeaderComponent } from './header/header.component';
import { SocketService } from './socket/services/socket.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.component.scss',
})
export class App {
  constructor(
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly socketService: SocketService,
  ) {
    this.router.events.pipe(filter((event) => event instanceof NavigationStart)).subscribe(() => {
      this.dialog.closeAll();
    });
    this.socketService.connect();
  }
}
