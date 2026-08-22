import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { UrlProvider } from '../../../../../shared/enums/url-provider.enum';
import { Dish } from '../../../../../shared/interfaces/menu.interface';
import { HttpHandlerService } from '../../../../../shared/services/http-handler.service';

@Service()
export class ProductsService {
  private readonly httpHandlerService = inject(HttpHandlerService);

  getAllAvailableDish(): Observable<Dish[]> {
    return this.httpHandlerService.getRequest(UrlProvider.getDishes);
  }
}
