import { Component, model } from '@angular/core';
import { InputComponent } from '../../../../../shared/components/input/input.component';
import { form, min, required } from '@angular/forms/signals';

interface CreateProductModel {
  name: string;
  price: number;
}

@Component({
  templateUrl: './create-product-page.component.html',
  styleUrl: './create-product-page.component.scss',
  imports: [InputComponent],
})
export class CreateProductPageComponent {
  createProductModel = model<CreateProductModel>({
    name: '',
    price: 0,
  });

  createProductForm = form(this.createProductModel, (model) => {
    (required(model.name), required(model.price)), min(model.price, 0);
  });
}
