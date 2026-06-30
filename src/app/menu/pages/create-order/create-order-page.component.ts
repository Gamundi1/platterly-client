import { AsyncPipe, CurrencyPipe, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
  signal,
  TemplateRef,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { catchError, map, Observable } from 'rxjs';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';
import { MenuDisplayComponent } from '../../../shared/components/menu-display/menu-display.component';
import { UrlProvider } from '../../../shared/enums/url-provider.enum';
import { Dish } from '../../../shared/interfaces/menu.interface';
import { HttpHandlerService } from '../../../shared/services/http-handler.service';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { MatIcon } from '@angular/material/icon';
import { BreakpointObserver } from '@angular/cdk/layout';

interface OrderItem {
  dish: Dish;
  quantity: number;
}

@Component({
  templateUrl: './create-order-page.component.html',
  styleUrls: ['./create-order-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MenuDisplayComponent,
    CurrencyPipe,
    MatExpansionModule,
    MatDialogClose,
    MatDialogActions,
    MatDialogTitle,
    MatDialogContent,
    RouterLink,
    FaIconComponent,
    NgTemplateOutlet,
    MatIcon,
    AsyncPipe,
  ],
})
export class CreateOrderPageComponent implements OnInit {
  protected orderItems = signal<OrderItem[]>([]);
  protected isMobile$: Observable<boolean>;

  private readonly verificationModal = viewChild<TemplateRef<any>>('verificationModal');
  private readonly confirmationModal = viewChild<TemplateRef<any>>('confirmationModal');
  private readonly cartModal = viewChild<TemplateRef<any>>('cart');
  private readonly matDialog = inject(MatDialog);
  private readonly httpHandlerService = inject(HttpHandlerService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly breakpointObserver = inject(BreakpointObserver);

  protected bookingId: string;
  protected faCircleCheck = faCircleCheck;

  constructor() {
    this.bookingId = this.activatedRoute.snapshot.queryParams['bookingId'];
    this.isMobile$ = this.breakpointObserver
      .observe('(max-width: 768px)')
      .pipe(map((result) => result.matches));
  }

  ngOnInit(): void {
    if (!this.bookingId) {
      this.matDialog.open(ErrorModalComponent, {
        data: {
          title: 'Error al crear el pedido',
          message: 'No se ha podido identificar la reserva para la que quieres crear el pedido.',
        },
      });
    }
    this.httpHandlerService
      .getRequest(UrlProvider.getBooking, {
        bookingId: this.bookingId,
      })
      .pipe(
        catchError((error) => {
          this.matDialog.open(ErrorModalComponent, {
            data: this.getErrorMessage(error.error.code),
          });
          throw error;
        }),
      )
      .subscribe();
  }

  protected selectedDish(dish: Dish): void {
    if (this.orderItems().some((item) => item.dish.id === dish.id)) {
      this.orderItems.update((items) =>
        items.map((item) => {
          if (item.dish.id === dish.id) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        }),
      );
    } else {
      this.orderItems.update((items) => [...items, { dish, quantity: 1 }]);
    }
  }

  protected removeDish(dish: Dish): void {
    const orderItem = this.orderItems().find((item) => item.dish.id === dish.id);

    if (orderItem && orderItem.quantity > 1) {
      this.orderItems.update((items) =>
        items.map((item) => {
          if (item.dish.id === dish.id) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        }),
      );
    } else {
      this.orderItems.update((items) => items.filter((item) => item.dish.id !== dish.id));
    }
  }

  protected getTotalPrice(): number {
    const total = this.orderItems().reduce(
      (total, product) => total + Number(product.dish.price) * product.quantity,
      0,
    );
    return total;
  }

  protected nextStep(): void {
    if (!this.orderItems().length) {
      this.matDialog.open(ErrorModalComponent, {
        data: {
          title: 'Error al crear el pedido',
          message: 'Por favor, selecciona al menos un producto para continuar',
        },
      });
      return;
    }
    this.matDialog.open(this.verificationModal()!);
  }

  protected confirmOrder(): void {
    this.httpHandlerService
      .postRequest(
        UrlProvider.postOrder,
        {
          bookingId: this.bookingId,
        },
        {
          products: this.orderItems().map((item) => ({
            productId: item.dish.id,
            quantity: item.quantity,
          })),
        },
      )
      .subscribe(() => {
        this.matDialog.open(this.confirmationModal()!, {
          disableClose: true,
        });
      });
  }

  protected viewCart(): void {
    this.matDialog.open(this.cartModal()!);
  }

  private getErrorMessage(errorCode: string): { title: string; message: string } {
    switch (errorCode) {
      case 'BOOKING_NOT_FOUND':
        return {
          title: 'Reserva no encontrada',
          message: 'No se ha podido encontrar la reserva para la que quieres crear el pedido.',
        };
      case 'USER_NOT_IN_BOOKING':
        return {
          title: 'No eres parte de esta reserva',
          message:
            'Lo sentimos, no puedes acceder a los detalles de esta reserva porque no formas parte de la misma.',
        };
      default:
        return {
          title: 'Error al crear el pedido',
          message:
            'Ha ocurrido un error al intentar crear el pedido. Por favor, inténtalo de nuevo más tarde.',
        };
    }
  }
}
