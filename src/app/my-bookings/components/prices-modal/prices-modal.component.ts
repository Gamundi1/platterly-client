import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { Price } from '../../interfaces/price.interface';
import { CurrencyPipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { HttpHandlerService } from '../../../shared/services/http-handler.service';
import { UrlProvider } from '../../../shared/enums/url-provider.enum';
import { catchError } from 'rxjs/internal/operators/catchError';
import { ErrorService } from '../../../shared/services/error.service';
import { tap } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  templateUrl: './prices-modal.component.html',
  styleUrls: ['./prices-modal.component.scss'],
  imports: [CurrencyPipe, TranslocoPipe, MatDialogClose, FaIconComponent, MatProgressSpinner],
})
export class PricesModalComponent {
  protected readonly data = inject<Price>(MAT_DIALOG_DATA);
  protected readonly faClose = faClose;
  private readonly httpHandlerService = inject(HttpHandlerService);
  private readonly errorService = inject(ErrorService);
  protected readonly isLoading = signal<boolean>(false);

  payOrders() {
    this.isLoading.set(true);
    this.httpHandlerService
      .putRequest(UrlProvider.payOrders, undefined, { ordersToPay: this.data.ordersUnpaid })
      .pipe(
        tap(() => {
          this.isLoading.set(false);
        }),
        catchError((error) => {
          this.errorService.showErrorModal(error.error, 'button_retry', () => {
            this.errorService.closeErrorModal();
          });
          this.isLoading.set(false);
          return [];
        }),
      )
      .subscribe();
  }
}
