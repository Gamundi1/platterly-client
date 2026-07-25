import { Component, inject, model } from '@angular/core';
import { HttpHandlerService } from '../../../../../shared/services/http-handler.service';
import { Observable } from 'rxjs';
import { UrlProvider } from '../../../../../shared/enums/url-provider.enum';
import { AsyncPipe } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormField, required } from '@angular/forms/signals';
import { form } from '@angular/forms/signals';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  templateUrl: './modify-menu-page.component.html',
  styleUrl: './modify-menu-page.component.scss',
  imports: [AsyncPipe, MatFormFieldModule, MatInputModule, MatDatepickerModule, FormField, TranslocoPipe],
})
export class ModifyMenuPageComponent {
  allMenusAvailable$: Observable<any>;

  modifyMenuModel = model({
    menuId: '',
    availableFrom: '',
    availableTo: '',
  });

  modifyMenuForm = form(this.modifyMenuModel, (model) => {
    (required(model.menuId), required(model.availableFrom), required(model.availableTo));
  });

  get minDate() {
    return new Date(this.modifyMenuForm().value().availableFrom);
  }

  private readonly httpHandlerService = inject(HttpHandlerService);

  constructor() {
    this.allMenusAvailable$ = this.httpHandlerService.getRequest<any>(UrlProvider.getAllMenus);
  }
}
