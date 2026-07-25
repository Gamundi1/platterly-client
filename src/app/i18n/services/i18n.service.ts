import { inject, Service } from '@angular/core';
import { HttpHandlerService } from '../../shared/services/http-handler.service';
import { UrlProvider } from '../../shared/enums/url-provider.enum';
import { Observable } from 'rxjs/internal/Observable';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { map } from 'rxjs';

@Service({})
export class I18nService implements TranslocoLoader {
  private readonly httpHandlerService = inject(HttpHandlerService);

  getTranslation(language: string): Observable<any> {
    return this.httpHandlerService
      .getRequest<Translation>(UrlProvider.getTranslations, { language })
      .pipe(
        map((response) => {
          return response;
        }),
      );
  }
}
