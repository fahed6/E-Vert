import { Request, Response, Router } from "express";
import { CartService } from "../services/CartService";

export class CartController {
  private cartService: CartService;
  public router: Router;

  constructor() {
    this.cartService = new CartService();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Bind the methods to the class instance
    this.router.get("/:id", this.getCart.bind(this));
    this.router.post("/:id/add", this.addToCart.bind(this));
    this.router.post("/:id/remove", this.removeFromCart.bind(this));
    this.router.put("/:id/update", this.updateCartItem.bind(this));
    this.router.delete("/:id/clear", this.clearCart.bind(this));
  }

  private async getCart(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.params.id as any).id; // Access the user ID
      const cart = await this.cartService.getCart(userId);
      res.status(200).json(cart);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  private async addToCart(req: Request, res: Response) {
    try {
      
      const userId = (req.params.id as any).id; // Access the user ID
      const { productId, quantity, size } = req.body;
      const cart = await this.cartService.addToCart(userId, productId, quantity, size);
      res.status(200).json(cart);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  private async removeFromCart(req: Request, res: Response) {
    try {
      
      const userId = (req.params.id as any).id; // Access the user ID
      const { productId, size } = req.body;
      const cart = await this.cartService.removeFromCart(userId, productId, size);
      res.status(200).json(cart);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  private async updateCartItem(req: Request, res: Response) {
    try {
      
      const userId = (req.params.id as any).id; // Access the user ID
      const { productId, quantity, size } = req.body;
      const cart = await this.cartService.updateCartItem(userId, productId, quantity, size);
      res.status(200).json(cart);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  private async clearCart(req: Request, res: Response){
    try {
      
      const userId = (req.params.id as any).id; // Access the user ID
      await this.cartService.clearCart(userId);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}