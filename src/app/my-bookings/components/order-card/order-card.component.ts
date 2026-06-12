import { DatePipe, NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { getOrderStatusColor, getOrderStatusText } from '../../../helpers/order-status';
import { OrderStatus } from '../../enums/order-status.enum';
import { Order } from '../../interfaces/order.interface';
import { ProductsTableComponent } from '../../../shared/components/products-table/products-table.component';
import { getUserAvatarColor } from '../../../helpers/user.helper';

@Component({
  selector: 'order-card',
  templateUrl: './order-card.component.html',
  styleUrl: './order-card.component.scss',
  imports: [ProductsTableComponent, DatePipe, NgClass],
})
export class OrderCardComponent {
  public order = input.required<Order>();
  public buttonClicked = output<void>();

  protected getOrderStatusText(orderStatus: OrderStatus): string {
    return getOrderStatusText(orderStatus);
  }

  protected getCurrentOrderStatusColor(orderStatus: OrderStatus): string {
    return getOrderStatusColor(orderStatus);
  }

  protected getCurrentUserAvatarColor(user: string): string {
    return getUserAvatarColor(user);
  }
}
