import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { UrlProvider } from '../../shared/enums/url-provider.enum';
import { Observable } from 'rxjs';
import { Order } from '../../my-bookings/interfaces/order.interface';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket!: Socket;

  connect() {
    this.socket = io(UrlProvider.socketBaseUrl, {
      transports: ['websocket'],
    });
  }

  joinBookingRoom(bookingId: string) {
    this.socket.emit('joinBooking', bookingId);
  }

  notifyOrderCreated() {
    this.socket.emit('notifyOrderCreated');
  }

  notifyOrdersUpdated() {
    this.socket.emit('notifyOrdersUpdated');
  }

  onOrderCreated(): Observable<Order> {
    return new Observable((observer) => {
      this.socket.on('order.created', (order: Order) => {
        observer.next(order);
      });
    });
  }

  onOrderUpdate(): Observable<Order> {
    return new Observable((observer) => {
      this.socket.on('order.updated', (order: Order) => {
        observer.next(order);
      });
    });
  }
}
