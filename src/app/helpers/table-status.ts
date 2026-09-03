import { Table, TableStatus } from '../new-bookings/interfaces/table.interface';

export function getTableStatusText(table: Table): string {
  switch (table.status) {
    case TableStatus.FREE:
      return 'libre';
    case TableStatus.NEEDS_CLEANING:
      return 'necesita limpieza';
    case TableStatus.OCCUPIED:
      return 'ocupada';
    default:
      return 'libre';
  }
}
