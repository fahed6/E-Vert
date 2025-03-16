import { Request, Response, Router } from "express";
import multer from "multer";
import { ProductService } from "../services/ProductService";

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
  },
});

const upload = multer({ storage });

export class ProductController {
  private productService: ProductService;
  public router: Router;

  constructor() {
    this.productService = new ProductService();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/", upload.single("image"), this.createProduct.bind(this));
    this.router.get("/", this.getAllProducts.bind(this));
    this.router.get("/random", this.getRandomProducts.bind(this));
    this.router.get("/:id", this.getProductById.bind(this));
    this.router.put("/:id", this.updateProduct.bind(this));
    this.router.delete("/:id", this.deleteProduct.bind(this));
  }

  /**
   * Create a new product
   */
  async createProduct(req: Request, res: Response) {
    try {
      const { name, description, stock, price, ownerId, categories } = req.body;
      const image = req.file ? req.file.path : null; // Save the file path

      const product = await this.productService.createProduct({
        name,
        description,
        stock: Number(stock),
        price: Number(price),
        image,
        ownerId: Number(ownerId),
        categories: JSON.parse(categories), // Parse the categories JSON string
      });

      res.status(201).json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Fetch all products
   */
  async getAllProducts(req: Request, res: Response) {
    try {
      const products = await this.productService.getAllProducts();
      res.status(200).json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Fetch random products
   */
  async getRandomProducts(req: Request, res: Response) {
    try {
      const products = await this.productService.getRandomProducts();
      res.status(200).json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Fetch a product by ID
   */
  async getProductById(req: Request, res: Response) {
    try {
      const product = await this.productService.getProductById(
        Number(req.params.id)
      );
      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Update a product
   */
  async updateProduct(req: Request, res: Response) {
    try {
      const { name, description, stock, price, ownerId, categories } = req.body;
      const image = req.file ? req.file.path : null; // Save the file path

      const product = await this.productService.updateProduct(Number(req.params.id), {
        name,
        description,
        stock: Number(stock),
        price: Number(price),
        image,
        ownerId: Number(ownerId),
        categories: JSON.parse(categories), // Parse the categories JSON string
      });

      res.status(200).json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Delete a product
   */
  async deleteProduct(req: Request, res: Response) {
    try {
      await this.productService.deleteProduct(Number(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}