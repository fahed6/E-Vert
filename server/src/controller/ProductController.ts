import { Request, Response, Router } from "express";
import { ProductService } from "../services/ProductService";

export class ProductController {
  private productService: ProductService;
  public router: Router;

  constructor() {
    this.productService = new ProductService();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/", this.createProduct.bind(this));
    this.router.get("/", this.getAllProducts.bind(this));
    this.router.get("/:id", this.getProductById.bind(this));
    this.router.put("/:id", this.updateProduct.bind(this));
    this.router.delete("/:id", this.deleteProduct.bind(this));
  }

  async createProduct(req: Request, res: Response) {
    try {
      const product = await this.productService.createProduct(req.body);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllProducts(req: Request, res: Response) {
    try {
      const products = await this.productService.getAllProducts();
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async getProductById(req: Request, res: Response) {
    try {
      const product = await this.productService.getProductById(Number(req.params.id));
      product? res.json(product) : res.status(404).json({ message: 'User not found' });
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateProduct(req: Request, res: Response) {
    try {
      const product = await this.productService.updateProduct(Number(req.params.id), req.body);
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteProduct(req: Request, res: Response) {
    try {
      await this.productService.deleteProduct(Number(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}