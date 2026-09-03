import { Component, inject, model, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { form, FormField, required } from '@angular/forms/signals';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslocoPipe } from '@jsverse/transloco';
import { catchError } from 'rxjs';
import { UrlProvider } from '../../../../../shared/enums/url-provider.enum';
import { Dish, Drink, MenuType } from '../../../../../shared/interfaces/menu.interface';
import { HttpHandlerService } from '../../../../../shared/services/http-handler.service';
import { ConfirmModifyComponent } from '../../components/confirm-modify/confirm-modify.component';
import { DishesList } from '../../components/dishes-list/dishes-list.component';
import { DrinksList } from '../../components/drinks-list/drinks-list.component';
import { ErrorService } from '../../../../../shared/services/error.service';

interface CreateMenuModel {
  name: string;
  availableFrom: Date | null;
  availableTo: Date | null;
}

@Component({
  templateUrl: './create-menu-page.component.html',
  styleUrl: './create-menu-page.component.scss',
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
export class CreateMenuPageComponent {
  createMenuModel = model<CreateMenuModel>({
    name: '',
    availableFrom: null,
    availableTo: null,
  });

  createMenuForm = form(this.createMenuModel, (model) => {
    (required(model.name), required(model.availableFrom), required(model.availableTo));
  });

  protected selectedDishes = signal<Dish[]>([]);
  protected selectedDrinks = signal<Drink[]>([]);

  get minDate() {
    if (!this.createMenuForm().value().availableFrom) {
      return null;
    }

    return new Date(this.createMenuForm().value().availableFrom!);
  }

  private readonly httpHandlerService = inject(HttpHandlerService);
  private readonly matDialog = inject(MatDialog);
  private readonly errorService = inject(ErrorService);

  readonly availableMenus = toSignal(
    this.httpHandlerService.getRequest<MenuType[]>(UrlProvider.getAllMenus),
  );

  async createMenu() {
    if (this.createMenuForm().valid()) {
      const dishes = this.selectedDishes().map((dish) => dish.id);
      const drinks = this.selectedDrinks().map((drink) => drink.id);
      this.httpHandlerService
        .postRequest(UrlProvider.createMenu, undefined, {
          name: this.createMenuForm().value().name,
          availableFrom: this.createMenuForm().value().availableFrom,
          availableTo: this.createMenuForm().value().availableTo,
          products: [...dishes, ...drinks],
        })
        .pipe(
          catchError((error) => {
            this.errorService.showErrorModal(error.error, 'button_retry', () => {
              this.errorService.closeErrorModal();
            });
            throw error;
          }),
        )
        .subscribe(() => {
          this.matDialog.open(ConfirmModifyComponent, {
            data: {
              isModified: false,
            },
            disableClose: true,
            panelClass: 'fullscreen'
          });
        });
    }
  }
}
