import { apiCall } from "../config/api/apiCall";
import { Cart } from "../types/Cart";

export class CartService {
  private BASE_URL = "http://localhost:5000/cart";

  public async getCart(userId: number): Promise<Cart> {
    return await apiCall(`${this.BASE_URL}/${userId}`, "GET");
  }

  public async addToCart(userId: number, productId: number, quantity: number, size?: string): Promise<Cart> {
    return await apiCall(`${this.BASE_URL}/${userId}/add`, "POST", {
      productId,
      quantity,
      size,
    });
  }

  public async removeFromCart(userId: number, productId: number, size?: string): Promise<Cart> {
    return await apiCall(`${this.BASE_URL}/${userId}/remove`, "POST", {
      productId,
      size,
    });
  }

  public async updateCartItem(userId: number, productId: number, quantity: number, size?: string): Promise<Cart> {
    return await apiCall(`${this.BASE_URL}/${userId}/update`, "PUT", {
      productId,
      quantity,
      size,
    });
  }

  public async clearCart(userId: number): Promise<void> {
    try {
      await apiCall(`${this.BASE_URL}/${userId}/clear`, "DELETE");
    } catch (error) {
      console.error('Clear cart error:', error);
      // Still resolve the promise since cart clearing isn't critical
      return;
    }
  }
}