import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Signal, viewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ServicesGridComponent } from '../../components/services-grid/services-grid.component';
import { BookingIncentiveComponent } from "../../components/booking-incentive/booking-incentive.component";

@Component({
  templateUrl: './home-page.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './home-page.component.scss',
  imports: [NgOptimizedImage, RouterLink, MatIcon, ServicesGridComponent, BookingIncentiveComponent],
})
export class HomePageComponent {
  private summaryServices: Signal<ElementRef | undefined> = viewChild('servicesSummary');

  protected scrollToSummary(): void {
    if (!this.summaryServices()) {
      return;
    }
    this.summaryServices()!.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
