import { Request, Response, Router } from "express";
import multer from "multer";
import { ProductService } from "../services/ProductService";
import { Product } from "../entities/Product";
import AppDataSource from "../data-source";
import { Category } from "../entities/Category";

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
  private categoryRepository = AppDataSource.getRepository(Category);

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
    this.router.put("/:id", upload.single("image"), this.updateProduct.bind(this));
    this.router.delete("/:id", this.deleteProduct.bind(this));
    this.router.get("/count/total", this.countProducts.bind(this));
  }

  public async countProducts(req: Request, res: Response) {
    try {
      const count = await this.productService.countProducts();
      res.status(200).json({ count });
    } catch (error) {
      console.error('Error in countProducts controller:', error);
      res.status(500).json({ 
        error: 'Failed to count products',

      });
    }
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
  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const { categories, ...otherFields } = req.body;
  
      const updateData: Partial<Product> = {
        ...otherFields,
        ...(req.file && { image: req.file.path }),
      };
  
      // Handle categories - expect JSON string array of category names
      if (categories) {
        try {
          const categoryNames = typeof categories === 'string' 
            ? JSON.parse(categories)
            : categories;
          
          // Find or create categories
          const categoryEntities = await Promise.all(
            categoryNames.map(async (name: string) => {
              let category = await this.categoryRepository.findOne({ 
                where: { name } 
              });
              if (!category) {
                category = this.categoryRepository.create({ name });
                await this.categoryRepository.save(category);
              }
              return category;
            })
          );
          
          updateData.categories = categoryEntities;
        } catch (e) {
          throw new Error('Invalid categories format');
        }
      }
  
      const product = await this.productService.updateProduct(
        Number(id),
        updateData
      );
  
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error});
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