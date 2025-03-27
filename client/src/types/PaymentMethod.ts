export type PaymentMethod = "card" | "store_pickup" | "delivery"; 

export interface Payment {
    id: number;
    amount: number;
    method: PaymentMethod;
    // Add other payment properties as needed
  }