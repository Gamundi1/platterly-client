import { Component } from '@angular/core';
import { OrderStatus } from '../../../my-bookings/enums/order-status.enum';
import { Order } from '../../../my-bookings/interfaces/order.interface';
import { OrderItemComponent } from '../../components/order-item/order-item.component';
import { OrderManagementDirective } from '../../directives/order-management/order-management.directive';

@Component({
  templateUrl: './chef-page.component.html',
  styleUrl: './chef-page.component.scss',
  imports: [OrderItemComponent],
})
export class ChefPageComponent extends OrderManagementDirective {
  orderStatus = OrderStatus;

  protected updateOrderStatusToGiven(order: Order, status: OrderStatus) {
    this.updateOrderStatus(order, status);
  }
}
