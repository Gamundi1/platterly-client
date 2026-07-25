import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors, withXhr } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';

import { routes } from './app.routes';
import { authInterceptor } from './auth/interceptors/auth.interceptor-interceptor';
import { provideLuxonDateAdapter } from '@angular/material-luxon-adapter';

import { provideTransloco } from '@jsverse/transloco';
import { I18nService } from './i18n/services/i18n.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAnimations(),
    provideTransloco({
      config: {
        defaultLang: 'es',
        availableLangs: ['es'],
      },
      loader: I18nService,
    }),
    provideHttpClient(withXhr(), withInterceptors([authInterceptor])),
    provideRouter(routes),
    {
      provide: LOCALE_ID,
      useValue: 'es-ES',
    },
    provideServiceWorker('ngsw-worker.js', { enabled: true }),
    provideLuxonDateAdapter(),
  ],
};
