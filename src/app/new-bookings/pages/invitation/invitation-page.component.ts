import { Component, inject, OnInit, signal, TemplateRef, viewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { form, FormField, required } from '@angular/forms/signals';
import { MatDialog, MatDialogClose } from '@angular/material/dialog';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faTriangleExclamation, faXmark } from '@fortawesome/free-solid-svg-icons';
import { catchError, firstValueFrom } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { UrlProvider } from '../../../shared/enums/url-provider.enum';
import { HttpHandlerService } from '../../../shared/services/http-handler.service';
import { Booking } from '../../interfaces/booking.interface';

@Component({
  imports: [ReactiveFormsModule, FormField, FaIconComponent, MatDialogClose, RouterLink],
  templateUrl: './invitation-page.component.html',
  styleUrl: './invitation-page.component.scss',
})
export class InvitationPageComponent implements OnInit {
  private readonly httpHandleService = inject(HttpHandlerService);
  private readonly matDialog = inject(MatDialog);
  private readonly authService = inject(AuthService);
  private readonly invitationModal = viewChild<TemplateRef<unknown>>('invitationModal');
  private readonly errorModal = viewChild<TemplateRef<unknown>>('errorModal');
  private readonly activatedRoute = inject(ActivatedRoute);
  protected tryToLogIn = signal(true);
  protected booking: Booking | null = null;
  protected faXMark = faXmark;
  protected faTriangleExclamation = faTriangleExclamation;

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

    if (this.booking && !this.getUserDetails()) {
      this.matDialog.open(this.invitationModal()!, {
        data: this.booking,
      });
    }

    if (this.getUserDetails()) {
      this.sendJoinRequest();
    }
  }

  openLogInModal() {
    this.authService.modifyLoginConfig({
      title: 'Inicia sesión para unirte',
      subtitle: '',
      loginButtonLabel: 'Unirse',
      successCallback: () => {
        this.sendJoinRequest();
      },
    });
    this.authService.showLoginModal();
  }

  getUserDetails() {
    return this.authService.getUserDetails();
  }

  async joinTable(event: Event) {
    event.preventDefault();

    if (!this.tryToLogIn() && this.bookingForm().valid()) {
      await firstValueFrom(this.authService.register(this.bookingForm().value().name));
      this.sendJoinRequest();
    } else {
      this.sendJoinRequest();
    }
  }

  sendJoinRequest() {
    this.httpHandleService
      .postRequest(UrlProvider.joinBooking, undefined, {
        bookingId: this.activatedRoute.snapshot.params['bookingId'],
      })
      .pipe(
        catchError((error) => {
          let message = 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo más tarde.';
          if (error.error.code === 'BOOKING_NOT_FOUND') {
            message = 'Vaya!, parece que la reserva no fue encontrada.';
          }
          if (error.error.code === 'BOOKING_FULL') {
            message = 'La reserva a la que intentas unirte ya está llena.';
          }

          if (error.error.code === 'USER_ALREADY_IN_BOOKING') {
            message = 'Parece que ya formas parte de esta reserva.';
          }

          this.matDialog.open(this.errorModal()!, {
            data: message,
          });
          throw error;
        }),
      )
      .subscribe();
  }
}
