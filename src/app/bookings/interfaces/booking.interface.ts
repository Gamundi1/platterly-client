export interface Booking {
  id: string;
  guests: number;
  date: string;
  status: string;
  bookingGuests: Guests[];
}

interface Guests {
  id: string;
  owner: boolean;
}
