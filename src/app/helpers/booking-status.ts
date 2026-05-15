import { Booking } from '../new-bookings/interfaces/booking.interface';
import { BookingStatus } from '../shared/enums/booking-status.enum';

export function getBookingStatusColor(booking: Booking): string {
  switch (booking.status) {
    case BookingStatus.CONFIRMED:
      return 'confirmed';
    case BookingStatus.CANCELLED:
      return 'cancelled';
    case BookingStatus.ACTIVE:
      return 'active';
    case BookingStatus.COMPLETED:
      return 'completed';
    default:
      return 'gray';
  }
}

export function getBookingStatusText(booking: Booking): string {
  switch (booking.status) {
    case BookingStatus.CONFIRMED:
      return 'confirmada';
    case BookingStatus.CANCELLED:
      return 'cancelada';
    case BookingStatus.ACTIVE:
      return 'activa';
    case BookingStatus.COMPLETED:
      return 'completada';
    default:
      return 'confirmada';
  }
}
