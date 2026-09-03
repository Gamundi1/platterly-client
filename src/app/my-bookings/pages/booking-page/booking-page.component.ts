import { CurrencyPipe, NgClass, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { catchError, map } from 'rxjs';
import { getBookingStatusColor, getBookingStatusText } from '../../../helpers/booking-status';
import { Booking } from '../../../new-bookings/interfaces/booking.interface';
import { BookingStatus } from '../../../shared/enums/booking-status.enum';
import { UrlProvider } from '../../../shared/enums/url-provider.enum';
import { ErrorService } from '../../../shared/services/error.service';
import { HttpHandlerService } from '../../../shared/services/http-handler.service';
import { SocketService } from '../../../socket/services/socket.service';
import { OrderCardComponent } from '../../components/order-card/order-card.component';
import { PricesModalComponent } from '../../components/prices-modal/prices-modal.component';
import { Order } from '../../interfaces/order.interface';
import { Price } from '../../interfaces/price.interface';

@Component({
  templateUrl: './booking-page.component.html',
  styleUrl: './booking-page.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    NgClass,
    FaIconComponent,
    NgOptimizedImage,
    RouterLink,
    OrderCardComponent,
    MatIconModule,
    CurrencyPipe,
  ],
})
export class BookingPageComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly httpHandlerService = inject(HttpHandlerService);
  private readonly matDialog = inject(MatDialog);
  private readonly socketService = inject(SocketService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly errorService = inject(ErrorService);

  protected booking = signal<Booking | null>(null);
  protected orders = signal<Order[] | []>([]);

  protected faPlus = faPlus;

  protected readonly bookingStatus = BookingStatus;

  ngOnInit(): void {
    const bookingId = this.activatedRoute.snapshot.params['bookingId'];
    if (bookingId) {
      this.httpHandlerService
        .getRequest<Booking>(UrlProvider.getBooking, { bookingId })
        .pipe(
          catchError((error) => {
            this.errorService.showErrorModal(error.error);
            throw error;
          }),
        )
        .subscribe((booking) => {
          this.booking.set(booking);
          this.fetchOrderItems();
          this.socketService.joinBookingRoom(bookingId);
        });
    }
  }

  protected getBookingStatusText(): string {
    if (!this.booking()) {
      return '';
    }
    return getBookingStatusText(this.booking()!);
  }

  protected getBookingStatusColor(): string {
    if (!this.booking()) {
      return '';
    }
    return getBookingStatusColor(this.booking()!);
  }

  protected bookingTotalPrice(): number {
    return this.orders().reduce((total, order) => total + this.getOrderPrice(order), 0);
  }

  protected getOrderPrice(order: Order): number {
    return order.products.reduce((total, product) => total + product.price * product.quantity, 0);
  }

  protected retrieveTotalPrice(): void {
    this.httpHandlerService
      .getRequest<Price>(UrlProvider.getTotalPriceByBookingId, {
        bookingId: this.booking()!.id,
      })
      .pipe(
        catchError((error) => {
          this.errorService.showErrorModal(error.error, 'understood_button', () =>
            this.errorService.closeErrorModal(),
          );
          throw error;
        }),
      )
      .subscribe((response) => {
        this.matDialog.open(PricesModalComponent, {
          data: {
            totalPrice: response.totalPrice,
            ordersUnpaid: response.ordersUnpaid,
          },
          panelClass: 'fullscreen',
        });
      });
  }

  protected retrieveUserOrdersTotalPrice(): void {
    this.httpHandlerService
      .getRequest<Price>(UrlProvider.getUserOrdersTotalPrice, {
        bookingId: this.booking()!.id,
      })
      .pipe(
        catchError((error) => {
          this.errorService.showErrorModal(error.error, 'understood_button', () =>
            this.errorService.closeErrorModal(),
          );
          throw error;
        }),
      )
      .subscribe((response) => {
        this.matDialog.open(PricesModalComponent, {
          data: {
            totalPrice: response.totalPrice,
            ordersUnpaid: response.ordersUnpaid,
          },
          panelClass: 'fullscreen',
        });
      });
  }

  private fetchOrderItems() {
    this.httpHandlerService
      .getRequest<Order[]>(UrlProvider.getOrdersByBookingId, {
        bookingId: this.booking()!.id,
      })
      .pipe(
        map((orders) =>
          orders.sort(
            (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime(),
          ),
        ),
      )
      .subscribe((orders) => {
        if (Array.isArray(orders)) {
          this.orders.set(orders);
        }
      });

    this.socketService
      .onOrderCreated()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((order) => {
        const existingOrder = this.orders().find((o) => o.id === order.id);

        if (!existingOrder) {
          this.orders.update((currentOrders) => [...currentOrders, order]);
        }
      });

    this.socketService.onOrderUpdate().subscribe((updatedOrder) => {
      console.log(updatedOrder);
      const index = this.orders().findIndex((o) => o.id === updatedOrder.id);
      if (index !== -1) {
        this.orders.update((currentOrders) => {
          const newOrders = [...currentOrders];
          newOrders[index] = updatedOrder;
          return newOrders;
        });
      }
    });
  }
}
