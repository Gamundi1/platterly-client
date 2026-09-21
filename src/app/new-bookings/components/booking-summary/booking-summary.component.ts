import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';
import { DateTime } from 'luxon';

@Component({
  imports: [MatIcon, DatePipe, TranslocoPipe],
  selector: 'booking-summary',
  styleUrl: './booking-summary.component.scss',
  templateUrl: './booking-summary.component.html',
})
export class BookingSummaryComponent {
  public dateSelected = input.required<DateTime>();
  public tableSelected = input.required();
  public hourSelected = input.required();
}
