import AppDataSource from "../data-source";
import { Category } from "../entities/Category";
import { Partner } from "../entities/Partner";
import { Product } from "../entities/Product";

export class ProductService {
  private productRepository = AppDataSource.getRepository(Product);
  private partnerRepository = AppDataSource.getRepository(Partner);
  private categoryRepository = AppDataSource.getRepository(Category);

  async getProductDistribution(): Promise<{name: string, value: number}[]> {
    // Get product count by category
    const result = await this.productRepository
      .createQueryBuilder('product')
      .select('category.name', 'name')
      .addSelect('COUNT(product.id)', 'value')
      .innerJoin('product.categories', 'category')
      .groupBy('category.name')
      .orderBy('value', 'DESC')
      .getRawMany();
  
    // Format the result for the chart
    return result.map(row => ({
      name: row.name,
      value: parseInt(row.value) || 0
    }));
  }

  async countProducts(): Promise<number> {
  
      const count = await this.productRepository.count();
      return Number(count)// Ensure it's a valid number
     
  }

  async createProduct(productData: Partial<Product>): Promise<Product> {
    const { ownerId, categories = [], ...rest } = productData;

    // Find the owner (Partner)
    const partner = await this.partnerRepository.findOne({
      where: { id: ownerId },
    });
    if (!partner) {
      throw new Error("Owner must be a Partner");
    }

    // Ensure categories is an array of strings
    const categoryNames = categories as unknown as string[];

    // Find or create categories
    const categoryEntities = await Promise.all(
      categoryNames.map(async (categoryName: string) => {
        let category = await this.categoryRepository.findOne({
          where: { name: categoryName },
        });
        if (!category) {
          category = this.categoryRepository.create({ name: categoryName });
          await this.categoryRepository.save(category);
        }
        return category;
      })
    );

    // Create the product
    const product = this.productRepository.create({
      ...rest,
      owner: partner,
      categories: categoryEntities,
    });

    return await this.productRepository.save(product);
  }

  async getAllProducts(page: number = 1, limit: number = 10): Promise<{ products: Product[]; total: number; page: number; totalPages: number }> {
    const [products, total] = await this.productRepository.findAndCount({
        relations: ["owner", "categories"],
        skip: (page - 1) * limit,
        take: limit,
    });

    return {
        products,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };
}

  async getRandomProducts(limit: number = 7): Promise<Product[]> {
    return await this.productRepository.find({
      relations: ["owner", "categories"],
      take: limit,
      order: { id: "DESC" },
    });
  }

  async getProductById(id: number): Promise<Product | null> {
    return await this.productRepository.findOne({
      where: { id },
      relations: ["owner", "categories"],
    });
  }

  async updateProduct(
    id: number,
    productData: Partial<Product>
  ): Promise<Product | null> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ["owner", "categories"],
    });
    if (!product) {
      throw new Error("Product not found");
    }
  
    // Update owner if ownerId is provided
    if (productData.ownerId) {
      const partner = await this.partnerRepository.findOne({
        where: { id: productData.ownerId },
      });
      if (!partner) {
        throw new Error("Owner must be a Partner");
      }
      product.owner = partner;
    }
  
    // Update categories if categories are provided
    if (productData.categories) {
      // Type guard to check if something is a Category object
      const isCategory = (obj: any): obj is Category => {
        return obj && typeof obj === 'object' && 'name' in obj;
      };
  
      // Normalize input to always be an array
      const categoryInput = Array.isArray(productData.categories) 
        ? productData.categories 
        : [productData.categories];
  
      // Extract category names safely
      const categoryNames = categoryInput.map(item => {
        if (typeof item === 'string') return item;
        if (isCategory(item)) return item.name;
        throw new Error('Invalid category format');
      });
  
      const categoryEntities = await Promise.all(
        categoryNames.map(async (name: string) => {
          const category = await this.categoryRepository.findOne({
            where: { name },
          });
          if (!category) {
            throw new Error(`Category '${name}' not found`);
          }
          return category;
        })
      );
      product.categories = categoryEntities;
    }
  
    // Update other fields (excluding categories and owner which we handled separately)
    const { categories, ownerId, ...otherFields } = productData;
    Object.assign(product, otherFields);
  
    return await this.productRepository.save(product);
  }

  async deleteProduct(id: number): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new Error("Product not found");
    }
    await this.productRepository.remove(product);
  }
}