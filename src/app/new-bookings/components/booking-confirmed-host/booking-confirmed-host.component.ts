import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-booking-confirmed-host',
  imports: [FaIconComponent, RouterLink],
  templateUrl: './booking-confirmed-host.component.html',
  styleUrl: './booking-confirmed-host.component.scss',
})
export class BookingConfirmedHostComponent {
  protected readonly faCircleCheck = faCircleCheck;
}
