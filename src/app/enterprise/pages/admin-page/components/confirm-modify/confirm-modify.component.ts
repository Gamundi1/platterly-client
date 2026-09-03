import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  template: `
    <section open class="ok-response">
      <div class="icon-container">
        <fa-icon [icon]="faCircleCheck"></fa-icon>
      </div>
      <h2>{{ (data.isModified ? 'menu_modified' : 'menu_created') | transloco }}</h2>
      <a class="admin-panel" routerLink="/enterprise/admin">Panel de administración</a>
    </section>
  `,
  imports: [FaIconComponent, RouterLink, TranslocoPipe],
  styles: [
    `
      .ok-response {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        padding: 2rem;
      }

      h2 {
        flex-grow: 1;
      }

      a {
        text-decoration: none;
        color: var(--primary-color);
        border: 1px solid var(--primary-color);
        border-radius: 0.5rem;
        padding: 0.5rem 1rem;
      }

      .icon-container {
        block-size: 2rem;
        align-content: center;
        border-radius: 1rem;
        background-color: #c5e7d6;
        padding-inline: 0.6rem;

        fa-icon {
          color: oklch(from var(--secondary-color) 0.5 c h);
        }
      }
    `,
  ],
})
export class ConfirmModifyComponent {
  faCircleCheck = faCircleCheck;

  protected readonly data = inject<{ isModified: boolean }>(MAT_DIALOG_DATA);
}
