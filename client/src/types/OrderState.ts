export type OrderState = "hold" | "shipped" | "delivered";
export interface Order {
    id: number;
    userId: number;
    cartId: number;
    addressId: number;
    orderState: OrderState;
    createdAt: string;

    // Add other order properties as needed
  }