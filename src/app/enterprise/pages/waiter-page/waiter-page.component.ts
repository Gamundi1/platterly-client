import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { OrderStatus } from '../../../my-bookings/enums/order-status.enum';
import { Order } from '../../../my-bookings/interfaces/order.interface';
import { OrderItemComponent } from '../../components/order-item/order-item.component';
import { OrderManagementDirective } from '../../directives/order-management/order-management.directive';
import { MatDialog } from '@angular/material/dialog';
import { TableStatusComponent } from '../../components/table-status/table-status.component';

@Component({
  templateUrl: './waiter-page.component.html',
  styleUrl: './waiter-page.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [OrderItemComponent],
})
export class WaiterPageComponent extends OrderManagementDirective {
  private readonly matDialog = inject(MatDialog);

  protected updateOrderStatusToDelivered(order: Order) {
    this.updateOrderStatus(order, OrderStatus.DELIVERED);
  }

  protected showTableModal(): void {
    this.matDialog.open(TableStatusComponent);
  }
}
