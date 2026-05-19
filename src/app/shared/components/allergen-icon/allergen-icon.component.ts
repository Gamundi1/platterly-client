import { Component, input } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { Allergen } from '../../interfaces/menu.interface';

@Component({
  selector: 'allergen-icon',
  templateUrl: './allergen-icon.component.html',
  imports: [MatTooltip],
})
export class AllergenIconComponent {
  public allergen = input.required<Allergen>();

  icons: Record<string, string> = {
    egg: '/images/menus/allergens/egg.svg',
  };

  getIconPath(): string {
    return this.icons[this.allergen().icon];
  }
}
