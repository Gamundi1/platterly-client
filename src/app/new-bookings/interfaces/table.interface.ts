export interface Table {
  number: number;
  capacity?: number;
  inlinePosition?: number;
  blockPosition?: number;
  availableHours?: string[];
  status: TableStatus;
}

export enum TableStatus {
  OCCUPIED = 'occupied',
  FREE = 'free',
  NEEDS_CLEANING = 'needs_cleaning',
  BLOCKED = 'blocked',
}
