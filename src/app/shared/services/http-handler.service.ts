import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { UrlProvider } from '../enums/url-provider.enum';
import { take } from 'rxjs';

type PrimitiveParam = string | number | boolean;

@Injectable({ providedIn: 'root' })
export class HttpHandlerService {
  private readonly http = inject(HttpClient);

  postRequest<T>(templateUrl: string, urlParams?: Record<string, PrimitiveParam>, body?: unknown) {
    const url = this.resolveTemplateUrl(templateUrl, urlParams);

    return this.http.post<T>(url, body).pipe(take(1));
  }

  putRequest<T>(templateUrl: string, urlParams?: Record<string, PrimitiveParam>, body?: unknown) {
    const url = this.resolveTemplateUrl(templateUrl, urlParams);

    return this.http.put<T>(url, body).pipe(take(1));
  }

  getRequest<T>(templateUrl: string, urlParams?: Record<string, PrimitiveParam>) {
    const url = this.resolveTemplateUrl(templateUrl, urlParams);

    return this.http.get<T>(url).pipe(take(1));
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
