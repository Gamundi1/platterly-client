import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { form, required } from '@angular/forms/signals';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { TranslocoPipe } from '@jsverse/transloco';
import { catchError, take } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { ErrorModalComponent } from '../../../../../shared/components/error-modal/error-modal.component';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { UrlProvider } from '../../../../../shared/enums/url-provider.enum';
import { Allergen } from '../../../../../shared/interfaces/menu.interface';
import { HttpHandlerService } from '../../../../../shared/services/http-handler.service';
import { ErrorService } from '../../../../../shared/services/error.service';

interface CreateIngredientModel {
  name: string;
  description: string;
  allergens: string[];
}

@Component({
  templateUrl: './create-ingredient-page.component.html',
  styleUrl: './create-ingredient-page.component.scss',
  imports: [InputComponent, AsyncPipe, MatCheckbox, TranslocoPipe],
})
export class CreateIngredientPageComponent {
  private readonly httpHandlerService = inject(HttpHandlerService);
  private readonly matDialog = inject(MatDialog);
  private readonly errorService = inject(ErrorService);

  availableAllergens$: Observable<Allergen[]>;

  createIngredientModel = signal<CreateIngredientModel>({
    name: '',
    description: '',
    allergens: [],
  });

  createIngredientForm = form(this.createIngredientModel, (model) => {
    (required(model.name), required(model.description));
  });

  constructor() {
    this.availableAllergens$ = this.httpHandlerService.getRequest<Allergen[]>(
      UrlProvider.getAllergens,
    );
  }

  isChecked(allergenId: string): boolean {
    return this.createIngredientModel().allergens.includes(allergenId);
  }

  update(isChecked: boolean, allergenId: string) {
    if (isChecked) {
      this.createIngredientModel.update((model) => ({
        ...model,
        allergens: [...model.allergens, allergenId],
      }));
    } else {
      this.createIngredientModel.update((model) => ({
        ...model,
        allergens: model.allergens.filter((id) => id !== allergenId),
      }));
    }
  }

  saveIngredient() {
    this.httpHandlerService
      .postRequest(UrlProvider.postIngredient, undefined, {
        name: this.createIngredientModel().name,
        description: this.createIngredientModel().description,
        allergens: this.createIngredientModel().allergens,
      })
      .pipe(
        catchError((error) => {
          this.errorService.showErrorModal(error.error, 'button_retry', () => {
            this.errorService.closeErrorModal();
          });
          return [];
        }),
        take(1),
      )
      .subscribe();
  }
}
