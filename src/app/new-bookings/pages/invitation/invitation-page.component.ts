import {
  Component,
  inject,
  OnInit,
  signal,
  TemplateRef,
  viewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
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
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { ErrorModalComponent } from '../../../shared/components/error-modal/error-modal.component';
import { User, UserRole } from '../../../shared/interfaces/user.interface';

@Component({
  imports: [ReactiveFormsModule, FormField, FaIconComponent, MatDialogClose, RouterLink],
  templateUrl: './invitation-page.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './invitation-page.component.scss',
})
export class InvitationPageComponent implements OnInit {
  private readonly httpHandleService = inject(HttpHandlerService);
  private readonly matDialog = inject(MatDialog);
  private readonly authService = inject(AuthService);
  private readonly invitationModal = viewChild<TemplateRef<unknown>>('invitationModal');
  private readonly successfulModal = viewChild<TemplateRef<unknown>>('successfulModal');
  private readonly activatedRoute = inject(ActivatedRoute);
  protected tryToLogIn = signal(true);
  protected faXMark = faXmark;
  protected faTriangleExclamation = faTriangleExclamation;
  protected faCheck = faCheckCircle;

  private bookingModel = signal({
    name: '',
  });

  protected bookingForm = form(this.bookingModel, (model) => {
    required(model.name);
  });

  async ngOnInit() {
    const tableNumber = this.activatedRoute.snapshot.params['tableNumber'];
    const hour = this.activatedRoute.snapshot.params['hour'];
    const date = this.activatedRoute.snapshot.params['date'];
    this.matDialog.open(this.invitationModal()!, {
      data: {
        tableNumber,
        hour,
        date,
      },
    });
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
      const user: User = {
        name: this.bookingForm().value().name,
        role: UserRole.USER,
      };
      await firstValueFrom(this.authService.register(user));
      this.sendJoinRequest();
    } else {
      this.sendJoinRequest();
    }
  }

  sendJoinRequest() {
    this.httpHandleService
      .postRequest(UrlProvider.joinBooking, undefined, {
        bookingId: this.activatedRoute.snapshot.queryParams['bookingId'],
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

          this.matDialog.open(ErrorModalComponent, {
            data: {
              title: 'Error al unirse a la reserva',
              message,
            },
          });
          throw error;
        }),
      )
      .subscribe(() => {
        this.matDialog.open(this.successfulModal()!);
      });
  }
}
