import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { OrderProduct } from '../../../my-bookings/interfaces/order.interface';
import { CurrencyPipe } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'products-table',
  templateUrl: './products-table.component.html',
  styleUrl: './products-table.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CurrencyPipe, TranslocoPipe],
})
export class ProductsTableComponent {
  public products = input.required<OrderProduct[]>();
  public showPrice = input<boolean>(true);
}
