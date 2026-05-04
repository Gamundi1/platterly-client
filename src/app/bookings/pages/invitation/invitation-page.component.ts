import {
  AfterViewInit,
  Component,
  effect,
  inject,
  OnInit,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { ModalService } from '../../../shared/services/modal.service';
import { form, FormField, required } from '@angular/forms/signals';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpHandlerService } from '../../../shared/services/http-handler.service';
import { UrlProvider } from '../../../shared/enums/url-provider.enum';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Booking } from '../../interfaces/booking.interface';

@Component({
  selector: 'app-invitation',
  imports: [ReactiveFormsModule, FormField],
  templateUrl: './invitation-page.component.html',
  styleUrl: './invitation-page.component.scss',
})
export class InvitationPageComponent implements OnInit {
  private readonly modalService = inject(ModalService);
  private readonly httpHandleService = inject(HttpHandlerService);
  private readonly invitationModal = viewChild<TemplateRef<unknown>>('invitationModal');
  private readonly activatedRoute = inject(ActivatedRoute);
  protected tryToLogIn = signal(true);
  protected booking: Booking | null = null;

  private bookingModel = signal({
    name: '',
  });

  protected bookingForm = form(this.bookingModel, (model) => {
    required(model.name);
  });

  async ngOnInit() {
    if (this.activatedRoute.snapshot.queryParams['bookingId']) {
      this.booking = await firstValueFrom(
        this.httpHandleService.getRequest<Booking>(UrlProvider.getBooking, {
          bookingId: this.activatedRoute.snapshot.queryParams['bookingId'],
        }),
      );
    }

    if (this.booking) {
      this.open();
    }
  }

  open() {
    this.modalService.showModal(this.invitationModal()!);
  }

  async joinTable(event: Event) {
    event.preventDefault();

    if (!this.tryToLogIn() && this.bookingForm().valid()) {
      await this.httpHandleService.postRequest(UrlProvider.register, undefined, {
        name: this.bookingModel().name,
      });
    }

    await this.httpHandleService.postRequest(UrlProvider.joinBooking, undefined, {
      bookingId: this.activatedRoute.snapshot.params['bookingId'],
    });
  }
}
