import { Directive, inject, OnInit, signal } from '@angular/core';
import { map } from 'rxjs';
import { OrderStatus } from '../../../my-bookings/enums/order-status.enum';
import { Order } from '../../../my-bookings/interfaces/order.interface';
import { UrlProvider } from '../../../shared/enums/url-provider.enum';
import { HttpHandlerService } from '../../../shared/services/http-handler.service';
import { SocketService } from '../../../socket/services/socket.service';

@Directive({
  selector: '[appOrderManagement]',
})
export class OrderManagementDirective implements OnInit {
  private readonly httpHandlerService = inject(HttpHandlerService);
  private readonly socketService = inject(SocketService);

  protected orders = signal<Order[] | []>([]);

  get readyOrders() {
    return this.orders().filter((order) => order.status === OrderStatus.READY);
  }

  get alreadyDeliveredOrders() {
    return this.orders()
      .filter((order) => order.status === OrderStatus.DELIVERED)
      .sort((a, b) => {
        const dateA = new Date(a.deliveredAt!).getTime();
        const dateB = new Date(b.deliveredAt!).getTime();
        return dateA - dateB;
      });
  }

  get preparingOrders() {
    return this.orders().filter((order) => order.status === OrderStatus.IN_PROGRESS);
  }

  get scheduledOrders() {
    return this.orders().filter((order) => order.status === OrderStatus.SCHEDULED);
  }

  ngOnInit(): void {
    this.socketService.notifyOrderCreated();
    this.socketService.notifyOrdersUpdated();
    this.fetchOrders();
  }

  protected fetchOrders() {
    this.httpHandlerService
      .getRequest<Order[]>(UrlProvider.getOrdersByDate, {
        date: new Date().toISOString().split('T')[0],
      })
      .pipe(
        map((orders) => {
          this.orders.set(orders);
        }),
      )
      .subscribe(() => {
        this.listenToOrdersUpdates();
        this.listenToOrdersCreated();
      });
  }

  protected updateOrderStatus(order: Order, status: OrderStatus) {
    this.httpHandlerService
      .postRequest(UrlProvider.updateOrderStatus, undefined, {
        orderId: order.id,
        status: status,
      })
      .subscribe(() => {
        this.orders.update((orders) => [
          ...orders.filter((o) => o.id !== order.id),
          { ...order, status: status },
        ]);
      });
  }

  private listenToOrdersCreated() {
    this.socketService.onOrderCreated().subscribe((newOrder) => {
      this.orders.update((orders) => [...orders, newOrder]);
    });
  }

  private listenToOrdersUpdates() {
    this.socketService.onOrderUpdate().subscribe((updatedOrder) => {
      this.orders.update((orders) => [
        ...orders.filter((o) => o.id !== updatedOrder.id),
        updatedOrder,
      ]);
    });
  }
}
