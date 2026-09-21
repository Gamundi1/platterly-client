import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { Allergen } from '../../interfaces/menu.interface';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'allergen-icon',
  templateUrl: './allergen-icon.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatTooltip, TranslocoPipe],
})
export class AllergenIconComponent {
  public allergen = input.required<Allergen>();

  getIconPath(): string {
    return `/images/menus/allergens/${this.allergen().icon}.svg`;
  }
}
