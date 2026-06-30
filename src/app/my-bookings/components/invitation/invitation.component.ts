import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { Booking } from '../../../new-bookings/interfaces/booking.interface';
import { InvitationButtonComponent } from '../../../shared/components/invitation-button/invitation-button.component';

@Component({
  templateUrl: './invitation.component.html',
  styleUrl: './invitation.component.scss',
  imports: [FaIconComponent, InvitationButtonComponent, MatDialogClose],
})
export class InvitationComponent {
  protected faClose = faClose;

  protected readonly booking = inject<Booking>(MAT_DIALOG_DATA);
}
