import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { Component, inject, model } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslocoPipe } from '@jsverse/transloco';
import { firstValueFrom, take } from 'rxjs';
import { Drink } from '../../../../../shared/interfaces/menu.interface';
import { ProductsService } from '../../services/products.service.ts/products.service';
import { ProductsModalComponent } from '../products-modal/products-modal.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'drinks-list',
  imports: [TranslocoPipe, CurrencyPipe, MatIcon],
  templateUrl: './drinks-list.component.html',
  styleUrl: './drinks-list.component.scss',
})
export class DrinksList {
  public drinks = model<Drink[]>([]);

  private readonly matDialog = inject(MatDialog);
  private readonly productService = inject(ProductsService);

  protected deleteDrink(drinkId: string): void {
    this.drinks.set(this.drinks().filter((drink) => drink.id !== drinkId));
  }

  protected async openAddProductModal() {
    let drinks = await firstValueFrom(this.productService.getAllAvailabledrinks());
    drinks = drinks.filter((drink) => !this.drinks().some((d) => d.id === drink.id));
    const dialogRef = this.matDialog.open(ProductsModalComponent, {
      data: {
        products: drinks,
      },
      panelClass: 'fullscreen',
    });
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((selectedProducts) => {
        if (selectedProducts) {
          this.drinks.set([...this.drinks(), ...selectedProducts]);
        }
      });
  }
}
