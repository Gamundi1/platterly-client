import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Order } from '../../../my-bookings/interfaces/order.interface';
import { ProductsTableComponent } from '../../../shared/components/products-table/products-table.component';

@Component({
  selector: 'enterprise-order-item',
  templateUrl: './order-item.component.html',
  styleUrl: './order-item.component.scss',
  imports: [ProductsTableComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateX(-30px)',
        }),
        animate(
          '300ms ease-out',
          style({
            opacity: 1,
            transform: 'translateX(0)',
          }),
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in',
          style({
            opacity: 0,
            transform: 'translateX(30px)',
          }),
        ),
      ]),
    ]),
  ],
})
export class OrderItemComponent {
  order = input.required<Order>();
  buttonText = input<string>('');
  buttonClicked = output<Order>();

  protected getTimeEllapsed(): string {
    const now = new Date().getTime();
    const orderTime = new Date(this.order().scheduledAt);
    const timeEllapsed = now - orderTime.getTime();
    const minutesEllapsed = Math.floor(timeEllapsed / 60000);
    if (minutesEllapsed < 5) {
      return 'Justo ahora';
    }
    return `${minutesEllapsed}m`;
  }

  protected onButtonClick() {
    this.buttonClicked.emit(this.order());
  }
}
