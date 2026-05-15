import { BookingStatus } from '../../shared/enums/booking-status.enum';
import { AvailableHour } from './available-hour.interface';
import { Table } from './table.interface';

export interface Booking {
  id: string;
  guests: number;
  table: Table;
  hour: AvailableHour;
  date: Date;
  status: BookingStatus;
  users: [
    {
      name: string;
      id: string;
    },
  ];
}
