import { CurrencyPipe, NgTemplateOutlet } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslocoPipe } from '@jsverse/transloco';
import { Dish, Drink } from '../../../../../shared/interfaces/menu.interface';
import { TranslateArrayPipe } from '../../../../../shared/pipes/translate-array.pipe';

@Component({
  templateUrl: './products-modal.component.html',
  styleUrl: './products-modal.component.scss',
  imports: [
    MatExpansionModule,
    TranslocoPipe,
    CurrencyPipe,
    NgTemplateOutlet,
    TranslateArrayPipe,
    MatDialogClose,
  ],
})
export class ProductsModalComponent {
  protected selectedProducts = signal<(Dish | Drink)[]>([]);

  protected readonly data = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<ProductsModalComponent>);

  get dishes() {
    return this.data.products as Dish[];
  }

  get drinks() {
    return this.data.products as Drink[];
  }

  protected emitSelectedProducts() {
    this.dialogRef.close(this.selectedProducts());
  }

  protected toggleProductSelection(product: Dish | Drink) {
    const currentSelection = this.selectedProducts();
    const isSelected = currentSelection.some((p) => p.id === product.id);

    if (isSelected) {
      this.selectedProducts.set(currentSelection.filter((p) => p.id !== product.id));
    } else {
      this.selectedProducts.set([...currentSelection, product]);
    }
  }
}
