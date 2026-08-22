import { Component, inject, signal } from '@angular/core';
import { Dish, Drink } from '../../../../../shared/interfaces/menu.interface';
import { MatExpansionModule } from '@angular/material/expansion';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslocoPipe } from '@jsverse/transloco';
import { CurrencyPipe, NgTemplateOutlet } from '@angular/common';

@Component({
  templateUrl: './products-modal.component.html',
  styleUrl: './products-modal.component.scss',
  imports: [MatExpansionModule, TranslocoPipe, CurrencyPipe, NgTemplateOutlet],
})
export class ProductsModalComponent {
  protected readonly products = inject<Drink[] | Dish[]>(MAT_DIALOG_DATA);

  get dishes() {
    return this.products as Dish[];
  }

  get drinks() {
    return this.products as Drink[];
  }
}
