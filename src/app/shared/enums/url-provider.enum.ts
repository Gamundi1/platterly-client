export const UrlProvider = {
  baseUrl: 'http://localhost:3000/api',
  login: '/v1/auth/sign-in',
  register: '/v1/auth/register',
  getAvailableTables: '/v1/table/available/${date}',
  getAvailableHours: '/v1/booking/available-hours',
  createBooking: '/v1/booking',
  getBooking: '/v1/booking/get/${bookingId}',
  joinBooking: '/v1/booking/join',
} as const;
