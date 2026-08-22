import { Component, computed, effect, inject, model, signal } from '@angular/core';
import { HttpHandlerService } from '../../../../../shared/services/http-handler.service';
import { filter, Observable } from 'rxjs';
import { UrlProvider } from '../../../../../shared/enums/url-provider.enum';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormField, required } from '@angular/forms/signals';
import { form } from '@angular/forms/signals';
import { TranslocoPipe } from '@jsverse/transloco';
import { Menu, MenuProduct } from '../../../../../shared/interfaces/menu.interface';
import { ProductsService } from '../../services/products.service.ts/products.service';
import { MatDialog } from '@angular/material/dialog';
import { ProductsModalComponent } from '../../components/products-modal/products-modal.component';

@Component({
  templateUrl: './modify-menu-page.component.html',
  styleUrl: './modify-menu-page.component.scss',
  imports: [
    AsyncPipe,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    FormField,
    TranslocoPipe,
    CurrencyPipe,
  ],
})
export class ModifyMenuPageComponent {
  allMenusAvailable$: Observable<any>;

  modifyMenuModel = model({
    menuId: '',
    availableFrom: '',
    availableTo: '',
    products: [''],
  });

  modifyMenuForm = form(this.modifyMenuModel, (model) => {
    (required(model.menuId), required(model.availableFrom), required(model.availableTo));
  });

  readonly menuId = computed(() => this.modifyMenuForm().value().menuId);

  protected menuInfo = signal<Menu | null>(null);

  get minDate() {
    return new Date(this.modifyMenuForm().value().availableFrom);
  }

  private readonly httpHandlerService = inject(HttpHandlerService);
  private readonly productsService = inject(ProductsService);
  private readonly matDialog = inject(MatDialog);

  constructor() {
    this.allMenusAvailable$ = this.httpHandlerService.getRequest<any>(UrlProvider.getAllMenus);
    effect(() => {
      const menuId = this.menuId();
      if (menuId) {
        this.httpHandlerService
          .getRequest<Menu>(UrlProvider.getMenu, { menuId })
          .pipe(filter((data) => !!data))
          .subscribe((menuInfo) => {
            this.menuInfo.set(menuInfo);
            this.modifyMenuForm.products().value.set(this.getMenuProducts(menuInfo.products));
          });
      }
    });
  }

  getMenuProducts(products: MenuProduct): string[] {
    const dishes = products.dishes.map((dish) => dish.id);
    const drinks = products.drinks.map((drink) => drink.id);
    return [...dishes, ...drinks];
  }

  showAddDishModal() {
    this.productsService.getAllAvailableDish().subscribe((dishes) => {
      this.matDialog.open(ProductsModalComponent, {
        data: dishes,
        panelClass: 'fullscreen',
      });
    });
  }
}
