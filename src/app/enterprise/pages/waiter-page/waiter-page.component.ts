import { Component } from '@angular/core';
import { OrderStatus } from '../../../my-bookings/enums/order-status.enum';
import { Order } from '../../../my-bookings/interfaces/order.interface';
import { OrderItemComponent } from '../../components/order-item/order-item.component';
import { OrderManagementDirective } from '../../directives/order-management/order-management.directive';

@Component({
  templateUrl: './waiter-page.component.html',
  styleUrl: './waiter-page.component.scss',
  imports: [OrderItemComponent],
})
export class WaiterPageComponent extends OrderManagementDirective {
  protected updateOrderStatusToDelivered(order: Order) {
    this.updateOrderStatus(order, OrderStatus.DELIVERED);
  }
}
