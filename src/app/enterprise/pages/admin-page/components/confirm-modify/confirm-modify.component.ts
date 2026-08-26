import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';

@Component({
  template: `
    <section open class="ok-response">
      <div class="icon-container">
        <fa-icon [icon]="faCircleCheck"></fa-icon>
      </div>
      <h2>Menú modificado correctamente</h2>
      <a class="admin-panel" routerLink="/enterprise/admin">Panel de administración</a>
    </section>
  `,
  imports: [FaIconComponent, RouterLink],
})
export class ConfirmModifyComponent {
  faCircleCheck = faCircleCheck;
}
