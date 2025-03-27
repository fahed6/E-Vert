import { CartItem } from "./CartItem";

export interface Cart {
  id?: number;
  items: CartItem[];
  // Add other properties as needed (totalPrice, userId, etc.)
}