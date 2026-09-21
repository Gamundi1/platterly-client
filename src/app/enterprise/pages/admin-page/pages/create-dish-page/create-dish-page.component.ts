import { Component, inject, model } from '@angular/core';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { form, min, required } from '@angular/forms/signals';
import { TranslocoPipe } from '@jsverse/transloco';
import { HttpHandlerService } from '../../../../../shared/services/http-handler.service';
import { UrlProvider } from '../../../../../shared/enums/url-provider.enum';

interface CreateDishModel {
  name: string;
  price: number;
  cookTime: number;
  images: string;
}

@Component({
  templateUrl: './create-dish-page.component.html',
  styleUrl: './create-dish-page.component.scss',
  imports: [InputComponent, TranslocoPipe],
})
export class CreateDishPageComponent {
  createDishModel = model<CreateDishModel>({
    name: '',
    price: 0,
    cookTime: 0,
    images: '',
  });

  selectedIngredients = model<string[]>([]);

  private readonly httpHandlerService = inject(HttpHandlerService);

  createProductForm = form(this.createDishModel, (model) => {
    ((required(model.name), required(model.price)), min(model.price, 0));
  });

  createDish() {
    if (this.createProductForm().valid()) {
      this.httpHandlerService
        .postRequest(UrlProvider.postDish, undefined, {
          ...this.createDishModel(),
          ingredients: this.selectedIngredients(),
          priceUnits: 'EUR',
          images: [this.createDishModel().images],
        })
        .subscribe(() => console.log('dish created'));
    }
  }
}
