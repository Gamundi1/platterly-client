import { Component, computed, effect, inject, model, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { form, FormField, required } from '@angular/forms/signals';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslocoPipe } from '@jsverse/transloco';
import { catchError, filter } from 'rxjs';
import { UrlProvider } from '../../../../../shared/enums/url-provider.enum';
import { Menu, MenuType } from '../../../../../shared/interfaces/menu.interface';
import { HttpHandlerService } from '../../../../../shared/services/http-handler.service';
import { DishesList } from '../../components/dishes-list/dishes-list.component';
import { ConfirmModifyComponent } from '../../components/confirm-modify/confirm-modify.component';
import { DrinksList } from '../../components/drinks-list/drinks-list.component';
import { ErrorService } from '../../../../../shared/services/error.service';

interface ModifyMenuModel {
  menuId: string;
  availableFrom: Date | null;
  availableTo: Date | null;
}

@Component({
  templateUrl: './modify-menu-page.component.html',
  styleUrl: './modify-menu-page.component.scss',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    FormField,
    TranslocoPipe,
    DishesList,
    DrinksList,
  ],
})
export class ModifyMenuPageComponent {
  modifyMenuModel = model<ModifyMenuModel>({
    menuId: '',
    availableFrom: null,
    availableTo: null,
  });

  modifyMenuForm = form(this.modifyMenuModel, (model) => {
    (required(model.menuId), required(model.availableFrom), required(model.availableTo));
  });

  readonly menuId = computed(() => this.modifyMenuForm().value().menuId);

  protected menuInfo = signal<Menu | null>(null);

  get minDate() {
    if (!this.modifyMenuForm().value().availableFrom) {
      return null;
    }

    return new Date(this.modifyMenuForm().value().availableFrom!);
  }

  private readonly httpHandlerService = inject(HttpHandlerService);
  private readonly matDialog = inject(MatDialog);
  private readonly errorService = inject(ErrorService);

  readonly availableMenus = toSignal(
    this.httpHandlerService.getRequest<MenuType[]>(UrlProvider.getAllMenus),
  );

  constructor() {
    effect(() => {
      const menuId = this.menuId();
      if (menuId) {
        const menu = this.availableMenus()?.find((menu) => menu.id === menuId);
        if (!menu) {
          return;
        }
        if (menu) {
          this.modifyMenuForm.availableFrom().value.set(new Date(menu.availableFrom));
          this.modifyMenuForm.availableTo().value.set(new Date(menu.availableTo));
        }
        this.httpHandlerService
          .getRequest<Menu>(UrlProvider.getMenu, { menuId })
          .pipe(filter((data) => !!data))
          .subscribe((menuInfo) => {
            this.menuInfo.set(menuInfo);
          });
      }
    });
  }

  async saveMenu() {
    this.modifyMenuForm().markAsTouched();
    if (this.modifyMenuForm().valid()) {
      const dishes = this.menuInfo()!.products.dishes.map((dish) => dish.id);
      const drinks = this.menuInfo()!.products.drinks.map((drink) => drink.id);
      this.httpHandlerService
        .putRequest(UrlProvider.modifyMenu, undefined, {
          id: this.modifyMenuForm().value().menuId,
          availableFrom: this.modifyMenuForm().value().availableFrom,
          availableTo: this.modifyMenuForm().value().availableTo,
          products: [...dishes, ...drinks],
        })
        .pipe(
          catchError((error) => {
            this.errorService.showErrorModal(error.error, 'Volver a intentar', () => {
              this.errorService.closeErrorModal();
            });
            throw error;
          }),
        )
        .subscribe(() => {
          this.matDialog.open(ConfirmModifyComponent, {
            data: {
              isModified: true,
            },
            disableClose: true,
            panelClass: 'fullscreen'
          });
        });
    }
  }
}
