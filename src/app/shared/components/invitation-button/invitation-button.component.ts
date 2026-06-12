import { Component, inject, input, signal } from '@angular/core';
import { Booking } from '../../../new-bookings/interfaces/booking.interface';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'invitation-button',
  templateUrl: './invitation-button.component.html',
  styleUrl: './invitation-button.component.scss',
  imports: [FaIconComponent],
})
export class InvitationButtonComponent {
  booking = input.required<Booking>();

  protected faCopy = faCopy;
  protected faCheck = faCheck;

  protected invitationLink = signal<string>('');
  protected linkCopied = signal(false);

  private readonly clipBoard = inject(Clipboard);

  ngOnInit(): void {
    this.invitationLink.set(`${window.location.origin}/bookings/invitation?bookingId=${this.booking().id}&tableNumber=${this.booking().table.number}&hour=${this.booking().hour.interval}&date=${this.booking().date}`);
  }
  protected copyLink() {
    this.clipBoard.copy(this.invitationLink());
    this.linkCopied.set(true);
  }
}
