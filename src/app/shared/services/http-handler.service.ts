import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UrlProvider } from '../enums/url-provider.enum';

type PrimitiveParam = string | number | boolean;

@Injectable({ providedIn: 'root' })
export class HttpHandlerService {
  private readonly http = inject(HttpClient);

  postRequest<T>(templateUrl: string, urlParams?: Record<string, PrimitiveParam>, body?: unknown) {
    const url = this.resolveTemplateUrl(templateUrl, urlParams);

    return this.http.post<T>(url, body);
  }

  private resolveTemplateUrl(template: string, params?: Record<string, PrimitiveParam>): string {
    const url = UrlProvider.baseUrl + template;

    return url.replace(/\$\{([^}]+)\}/g, (_, key: string) => {
      const value = params?.[key];

      if (value === undefined || value === null) {
        throw new Error(`Missing URL parameter: ${key}`);
      }

      return encodeURIComponent(String(value));
    });
  }
}
