export const UrlProvider = {
  baseUrl: 'http://localhost:3000/api',
  login: '/v1/auth/sign-in',
  getAvailableTables: '/v1/table/available/${date}',
  getAvailableHours: '/v1/booking/available-hours'
} as const;
