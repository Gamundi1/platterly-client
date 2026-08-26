import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

@Pipe({
  name: 'translateArray',
  pure: false,
})
export class TranslateArrayPipe implements PipeTransform {
  private readonly translocoService = inject(TranslocoService);

  transform(value: string[]): string {
    return value.map((item) => this.translocoService.translate(item)).join(', ');
  }
}
