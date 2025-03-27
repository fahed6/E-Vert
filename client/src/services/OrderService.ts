// src/services/OrderService.ts

import { apiCall } from "../config/api/apiCall";
import { OrderState } from "../types/OrderState";
import { PaymentMethod } from "../types/PaymentMethod";
 // Define these types as needed

const BASE_URL = "http://localhost:5000/order";

interface CheckoutData {
  userId:number;
  cartId: number;
  addressId: number;
  paymentMethod: PaymentMethod;
  amount: number;
}

export class OrderService  {
  async checkout(userId: number, data: CheckoutData) {
    // Remove userId from the data being sent
    const { userId: _, ...requestData } = data;
    return apiCall(
      `${BASE_URL}/${userId}/checkout`,
      "POST",
      requestData // Send only the necessary data
    );
  }

  async getUserOrders(userId: number) {
    return apiCall(
      `${BASE_URL}/${userId}/orders`,
      "GET"
    );
  }

  async getOrderById(orderId: number) {
    return apiCall(
      `${BASE_URL}/${orderId}`,
      "GET"
    );
  }

  async updateOrderState(orderId: number, state: OrderState) {
    return apiCall(
      `${BASE_URL}/${orderId}/state`,
      "PUT",
      { state }
    );
  }
};