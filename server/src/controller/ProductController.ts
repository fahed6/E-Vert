import { Request, Response, Router } from "express";
import multer from "multer";
import AppDataSource from "../data-source";
import { Category } from "../entities/Category";
import { Product } from "../entities/Product";
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
    this.router.get("/analytics/distribution", this.getProductDistribution.bind(this));
  }

  async getProductDistribution(req: Request, res: Response): Promise<void> {
    try {
      const distributionData = await this.productService.getProductDistribution();
      
      res.status(200).json({
        success: true,
        data: distributionData
      });
    } catch (error) {
      console.error("Get product distribution error:", error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Failed to get product distribution"
      });
    }
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
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        
        const result = await this.productService.getAllProducts(page, limit);
        
        res.status(200).json({
            success: true,
            data: result.products,
            pagination: {
                total: result.total,
                page: result.page,
                totalPages: result.totalPages,
                limit
            }
        });
    } catch (error: any) {
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
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
      const id = Number(req.params.id);
      const { categories, ...otherFields } = req.body;
  
      // 1. First find the existing product
      const existingProduct = await this.productService.getProductById(id);
      if (!existingProduct) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
  
      // 2. Prepare update data
      const updateData: Partial<Product> = {
        ...otherFields,
        ...(req.file && { image: req.file.path }),
      };
  
      // 3. Handle categories
      if (categories) {
        try {
          const categoryNames = typeof categories === 'string' 
            ? JSON.parse(categories)
            : categories;
          
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
  
      // 4. Perform the update - IMPORTANT: Use repository.update() for direct updates
      await AppDataSource.getRepository(Product).update(id, {
        name: updateData.name,
        description: updateData.description,
        stock: updateData.stock,
        price: updateData.price,
        image: updateData.image,
        ownerId: updateData.ownerId,
      });
  
      // 5. Handle relations separately if needed
      if (updateData.categories) {
        await AppDataSource.getRepository(Product)
          .createQueryBuilder()
          .relation(Product, "categories")
          .of(id)
          .addAndRemove(
            updateData.categories,
            existingProduct.categories
          );
      }
  
      // 6. Return the updated product
      const updatedProduct = await this.productService.getProductById(id);
      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error('Update error:', error);
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
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