import { OrderStatus } from '../my-bookings/enums/order-status.enum';

export function getOrderStatusColor(orderStatus: OrderStatus): string {
  switch (orderStatus) {
    case OrderStatus.DELIVERED:
      return 'delivered';
    case OrderStatus.IN_PROGRESS:
      return 'in-progress';
    case OrderStatus.READY:
      return 'ready';
    case OrderStatus.SCHEDULED:
      return 'scheduled';
    default:
      return 'gray';
  }
}


export function getOrderStatusText(orderStatus: OrderStatus): string {
  switch (orderStatus) {
    case OrderStatus.SCHEDULED:
      return 'En lista';
    case OrderStatus.IN_PROGRESS:
      return 'En preparación';
    case OrderStatus.READY:
      return 'Listo para entregar';
    case OrderStatus.DELIVERED:
      return 'Entregado';
  }
}
