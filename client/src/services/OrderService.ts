// src/services/OrderService.ts
import { apiCall } from "../config/api/apiCall";
import { OrderState } from "../types/OrderState";
import { PaymentMethod } from "../types/PaymentMethod";

const BASE_URL = "http://localhost:5000/order";

interface CheckoutData {
  userId: number;
  cartId: number;
  addressId: number;
  paymentMethod: PaymentMethod;
  amount: number;
}

interface PaginationParams {
  page?: number;
  limit?: number;
  states?: OrderState[];
  userIds?: number[];
}

interface PaginatedResponse<T> {
  data: T;
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

export class OrderService {
  async getAllOrders(params?: PaginationParams): Promise<PaginatedResponse<any>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.states) queryParams.append('states', params.states.join(','));
    if (params?.userIds) queryParams.append('userIds', params.userIds.join(','));

    const url = `${BASE_URL}/?${queryParams.toString()}`;
    return apiCall(url, "GET");
  }

  async checkout(userId: number, data: CheckoutData) {
    const { userId: _, ...requestData } = data;
    return apiCall(
      `${BASE_URL}/${userId}/checkout`,
      "POST",
      requestData
    );
  }

  async getUserOrders(userId: number) {
    return apiCall(
      `${BASE_URL}/${userId}/orders`,
      "GET"
    );
  }

  async count() {
    return apiCall(
      `${BASE_URL}/count/total`,
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
}