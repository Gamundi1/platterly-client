import { CurrencyPipe, NgClass, NgOptimizedImage } from '@angular/common';
import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  ChangeDetectionStrategy,
  viewChild,
  TemplateRef,
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
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';
import { OrderCardComponent } from '../../components/order-card/order-card.component';
import { BookingStatus } from '../../../shared/enums/booking-status.enum';
import { UrlProvider } from '../../../shared/enums/url-provider.enum';
import { HttpHandlerService } from '../../../shared/services/http-handler.service';
import { SocketService } from '../../../socket/services/socket.service';
import { Order } from '../../interfaces/order.interface';

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

  protected booking = signal<Booking | null>(null);
  protected orders = signal<Order[] | []>([]);
  private readonly priceModal = viewChild<TemplateRef<any>>('showPrices');

  protected faPlus = faPlus;

  protected readonly bookingStatus = BookingStatus;

  ngOnInit(): void {
    const bookingId = this.activatedRoute.snapshot.params['bookingId'];
    if (bookingId) {
      this.httpHandlerService
        .getRequest<Booking>(UrlProvider.getBooking, { bookingId })
        .pipe(
          catchError((error) => {
            this.showErrorModal(error.error);
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
      .getRequest<{ totalPrice: number }>(UrlProvider.getTotalPriceByBookingId, {
        bookingId: this.booking()!.id,
      })
      .subscribe((response) => {
        this.matDialog.open(this.priceModal()!, {
          data: {
            response: response.totalPrice,
          },
        });
      });
  }

  protected retrieveUserOrdersTotalPrice(): void {
    this.httpHandlerService
      .getRequest<{ totalPrice: number }>(UrlProvider.getUserOrdersTotalPrice, {
        bookingId: this.booking()!.id,
      })
      .subscribe((response) => {
        this.matDialog.open(this.priceModal()!, {
          data: {
            price: response.totalPrice,
          },
        });
      });
  }

  protected payOrders(): void {}

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

  private showErrorModal(error: { code: string; label: string; message: string }) {
    const { code, label, message } = error;

    if (code) {
      this.matDialog.open(ErrorModalComponent, {
        data: {
          title: label,
          message: message,
        },
      });
    }
  }
}
