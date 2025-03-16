import { Request, Response, Router } from "express";
import { CategoryService } from "../services/CategoryService";

export class CategoryController {
  private categoryService: CategoryService;
  public router: Router;

  constructor() {
    this.categoryService = new CategoryService();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/", this.createCategory.bind(this));
    this.router.get("/", this.getAllCategories.bind(this));
    this.router.get("/:name", this.getProductsByCategory.bind(this));
    this.router.delete("/:id", this.deleteCategory.bind(this));
  }

  /**
   * Create a new category
   */
  async createCategory(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const category = await this.categoryService.createCategory(name);
      res.status(201).json(category);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Fetch all categories
   */
  async getAllCategories(req: Request, res: Response) {
    try {
      const categories = await this.categoryService.getAllCategories();
      res.status(200).json(categories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Fetch products by category
   */
  async getProductsByCategory(req: Request, res: Response) {
    try {
      const { name } = req.params;
      const products = await this.categoryService.getProductsByCategory(name);
      res.status(200).json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Delete a category
   */
  async deleteCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.categoryService.deleteCategory(Number(id));
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}