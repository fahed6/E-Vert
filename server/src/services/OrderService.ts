import { In } from "typeorm";
import AppDataSource from "../data-source";
import { Address } from "../entities/Address";
import { Cart } from "../entities/Cart";
import { Order, OrderState } from "../entities/Order";
import { Payment, PaymentMethod } from "../entities/Payment";
import { User } from "../entities/User";

interface CheckoutData {
  cartId: number;
  userId: number;
  addressId: number;
  paymentMethod: PaymentMethod;
  amount: number;
}

export class OrderService {
  private orderRepository = AppDataSource.getRepository(Order);
  private paymentRepository = AppDataSource.getRepository(Payment);
  private cartRepository = AppDataSource.getRepository(Cart);
  private userRepository = AppDataSource.getRepository(User);
  private addressRepository = AppDataSource.getRepository(Address);

  async getLastMonthRevenue(): Promise<number> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
  

  
    // Solution 2: Alternative using raw query with exact column names
    
    const result = await this.orderRepository.query(
      `SELECT SUM(CAST("cartSnapshot"::json->>'total' AS numeric)) as total 
       FROM "order" 
       WHERE "createdAt" >= $1 AND "orderState" != $2`,
      [startDate, OrderState.HOLD]
    );
    return parseFloat(result[0]?.total || "0");
    
  
    return parseFloat(result?.totalRevenue || "0");
  }

  async checkout(checkoutData: CheckoutData): Promise<Order> {
    const { cartId, userId, addressId, paymentMethod, amount } = checkoutData;
  
    // 1. Validate and get required entities
    const [user, cart, address] = await Promise.all([
      this.userRepository.findOne({ where: { id: userId } }),
      this.cartRepository.findOne({ 
        where: { id: cartId },
        relations: ["items", "items.product"]
      }),
      this.addressRepository.findOne({ where: { id: addressId } })
    ]);
  
    if (!user) throw new Error(`User ${userId} not found`);
    if (!cart) throw new Error(`Cart ${cartId} not found`);
    if (!address) throw new Error(`Address ${addressId} not found`);
    if (!cart.items?.length) throw new Error("Cart is empty");
  
    // 2. Create order with snapshot
    const order = this.orderRepository.create({
      user,
      address,
      orderState: OrderState.HOLD,
      cartSnapshot: {
        items: cart.items.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          imageUrl: item.product.image || null,
          size: item.size,
          quantity: item.quantity
        })),
        total: amount
      }
    });
  
    // 3. Save order
    const savedOrder = await this.orderRepository.save(order);
    if (!savedOrder) throw new Error("Failed to save order");
  
    // 4. Create and save payment
    const payment = this.paymentRepository.create({
      amount,
      method: paymentMethod,
      user,
      order: savedOrder
    });
    await this.paymentRepository.save(payment);
  
    // 5. Clear cart (preserve cart record)
    cart.items = [];
    await this.cartRepository.save(cart);
  
    // 6. Return full order details
    const completeOrder = await this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ["payment", "address", "user"]
    });
  
    if (!completeOrder) throw new Error("Order not found after creation");
    return completeOrder;
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: "DESC" }
    });
  }

  async getOrderById(orderId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ 
      where: { id: orderId },
      relations: ["payment", "cart", "address", "user", "cart.items", "cart.items.product"]
    });
    
    if (!order) {
      throw new Error("Order not found");
    }
    
    return order;
  }

  async updateOrderState(orderId: number, state: OrderState): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    
    if (!order) {
      throw new Error("Order not found");
    }
    
    order.orderState = state;
    return this.orderRepository.save(order);
  }

  async getTotalOrderCount(): Promise<number> {
    return this.orderRepository.count();
  }

  // New method to get all orders with pagination and filtering
  async getAllOrders({
    page = 1,
    limit = 10,
    states = [],
    userIds = []
  }: {
    page?: number;
    limit?: number;
    states?: OrderState[];
    userIds?: number[];
  } = {}): Promise<{ orders: Order[]; totalCount: number }> {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    if (states.length > 0) {
      where.orderState = In(states);
    }
    if (userIds.length > 0) {
      where.user = { id: In(userIds) };
    }

    const [orders, totalCount] = await this.orderRepository.findAndCount({
      where,
      relations: ["user"],
      order: { createdAt: "DESC" },
      skip,
      take: limit
    });

    return { orders, totalCount };
  }

}