export interface User {
  id?: string;
  name: string;
  surname?: string;
  secondSurname?: string;
  email?: string;
  password?: string;
  role: UserRole;
}

export enum UserRole {
  USER = 'user',
  CHEF = 'chef',
  WAITER = 'waiter',
  ADMIN = 'admin',
  HOST = 'host',
}
