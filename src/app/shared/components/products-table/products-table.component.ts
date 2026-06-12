import { Component, input } from '@angular/core';
import { OrderProduct } from '../../../my-bookings/interfaces/order.interface';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'products-table',
  templateUrl: './products-table.component.html',
  styleUrl: './products-table.component.scss',
  imports: [CurrencyPipe],
})
export class ProductsTableComponent {
  public products = input.required<OrderProduct[]>();
  public showPrice = input<boolean>(true);
}
