// import { CartItem } from './cartItem.types';

export interface Order {
    id: string;
    // items: CartItem[];
    totalPrice: number;
    status: string;
  }