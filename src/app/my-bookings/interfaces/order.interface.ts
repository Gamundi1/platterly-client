import { OrderStatus } from "../enums/order-status.enum";

export interface Order {
  id: string;
  status: OrderStatus;
  scheduledAt: Date;
  deliveredAt?: Date;
  user: {
    name: string;
    surname: string;
  };
  products: OrderProduct[];
  booking?: {
    table: number;
  }
}

export interface OrderProduct {
  name: string;
  price: number;
  quantity: number;
}
