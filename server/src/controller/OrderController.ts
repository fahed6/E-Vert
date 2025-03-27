import { Request, Response, Router } from "express";
import { OrderState } from "../entities/Order";
import { OrderService } from "../services/OrderService";

export class OrderController {
  private orderService: OrderService;
  public router: Router;

  constructor() {
    this.orderService = new OrderService();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/:userId/checkout", this.checkout.bind(this)); // Add userId to the route
    this.router.get("/:userId/orders", this.getUserOrders.bind(this)); // Add userId to the route
    this.router.get("/:id", this.getOrderById.bind(this)); // Get order by orderId
    this.router.put("/:id/state", this.updateOrderState.bind(this)); // Update order state by orderId
  }

  async checkout(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      const { cartId, addressId, paymentMethod, amount } = req.body;
  
      if (isNaN(userId)) {
        res.status(400).json({ message: "Invalid user ID" });
        return;
      }
  
      // Calculate amount in controller or get from frontend
      const order = await this.orderService.checkout({
        cartId,
        userId,
        addressId,
        paymentMethod,
        amount
      });
  
      res.status(201).json(order);
    } catch (error) {
      console.error("Checkout error:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Checkout failed" 
      });
    }
  }

  async getUserOrders(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId); // Get userId from route params
      if (isNaN(userId)) {
        res.status(400).json({ message: "Invalid user ID" });
        return;
      }

      const orders = await this.orderService.getUserOrders(userId);
      res.status(200).json(orders);
    } catch (error) {
      console.error("Get user orders error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const orderId = parseInt(req.params.id); // Get orderId from route params
      if (isNaN(orderId)) {
        res.status(400).json({ message: "Invalid order ID" });
        return;
      }

      const order = await this.orderService.getOrderById(orderId);
      res.status(200).json(order);
    } catch (error) {
      if (error=== "Order not found") {
        res.status(404).json({ message: error });
      } else {
        console.error("Get order by ID error:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }

  async updateOrderState(req: Request, res: Response): Promise<void> {
    try {
      const orderId = parseInt(req.params.id); // Get orderId from route params
      const { state } = req.body;

      if (isNaN(orderId) || !state || !Object.values(OrderState).includes(state)) {
        res.status(400).json({ message: "Invalid order ID or state" });
        return;
      }

      const updatedOrder = await this.orderService.updateOrderState(orderId, state);
      res.status(200).json(updatedOrder);
    } catch (error) {
      if (error === "Order not found") {
        res.status(404).json({ message: error });
      } else {
        console.error("Update order state error:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  }
}