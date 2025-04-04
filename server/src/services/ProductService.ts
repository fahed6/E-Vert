import AppDataSource from "../data-source";
import { Partner } from "../entities/Partner";
import { Product } from "../entities/Product";
import { Category } from "../entities/Category";

export class ProductService {
  private productRepository = AppDataSource.getRepository(Product);
  private partnerRepository = AppDataSource.getRepository(Partner);
  private categoryRepository = AppDataSource.getRepository(Category);

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

  async getAllProducts(): Promise<Product[]> {
    return await this.productRepository.find({
      relations: ["owner", "categories"],
    });
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
      const categoryNames = productData.categories as unknown as string[]; // Ensure categories is an array of strings
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
      product.categories = categoryEntities;
    }

    // Update other fields
    Object.assign(product, productData);

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