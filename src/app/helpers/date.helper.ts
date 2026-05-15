import { AvailableHour } from '../new-bookings/interfaces/available-hour.interface';
import { TimeInterval } from '../shared/enums/time-interval.enum';

function parseTimeToHoursMinutes(time: string) {
  const [hourText, minuteText] = time.trim().split(':');
  const hours = Number(hourText);
  const minutes = Number(minuteText);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    throw new Error(`Invalid time format: ${time}`);
  }

  return { hours, minutes };
}

export function isDateAfterOrBefore(day: Date, hour: AvailableHour): TimeInterval {
  const now = new Date(Date.now());
  const [startText, endText] = hour.interval.split(' - ');
  const { hours: startHours, minutes: startMinutes } = parseTimeToHoursMinutes(startText);
  const { hours: endHours, minutes: endMinutes } = parseTimeToHoursMinutes(endText);

  const bookingStart = new Date(day);
  bookingStart.setHours(startHours, startMinutes, 0, 0);

  const bookingEnd = new Date(day);
  bookingEnd.setHours(endHours, endMinutes, 0, 0);

  if (bookingStart > now && bookingEnd > now) {
    return TimeInterval.AFTER;
  }

  if (bookingStart < now && bookingEnd < now) {
    return TimeInterval.BEFORE;
  }

  return TimeInterval.WITHIN;
}
