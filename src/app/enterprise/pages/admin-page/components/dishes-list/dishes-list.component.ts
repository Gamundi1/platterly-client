import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { Component, inject, model } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { Dish } from '../../../../../shared/interfaces/menu.interface';
import { TranslateArrayPipe } from '../../../../../shared/pipes/translate-array.pipe';
import { MatDialog } from '@angular/material/dialog';
import { ProductsModalComponent } from '../products-modal/products-modal.component';
import { ProductsService } from '../../services/products.service.ts/products.service';
import { firstValueFrom, take } from 'rxjs';

@Component({
  selector: 'dishes-list',
  imports: [TranslocoPipe, NgOptimizedImage, TranslateArrayPipe, CurrencyPipe],
  templateUrl: './dishes-list.component.html',
  styleUrl: './dishes-list.component.scss',
})
export class DishesList {
  public dishes = model<Dish[]>([]);

  private readonly matDialog = inject(MatDialog);
  private readonly productService = inject(ProductsService);

  protected deleteDish(dishId: string): void {
    this.dishes.set(this.dishes().filter((dish) => dish.id !== dishId));
  }

  protected async openAddProductModal() {
    let dishes = await firstValueFrom(this.productService.getAllAvailableDishes());
    dishes = dishes.filter((dish) => !this.dishes().some((d) => d.id === dish.id));
    const dialogRef = this.matDialog.open(ProductsModalComponent, {
      data: {
        products: dishes,
      },
      panelClass: 'fullscreen',
    });
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((selectedProducts) => {
        if (selectedProducts) {
          this.dishes.set([...this.dishes(), ...selectedProducts]);
        }
      });
  }
}
