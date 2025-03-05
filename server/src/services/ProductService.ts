import AppDataSource from "../data-source";
import { Partner } from "../entities/Partner"; // Import the Partner entity
import { Product } from "../entities/Product";

export class ProductService {
  private productRepository = AppDataSource.getRepository(Product);
  private partnerRepository = AppDataSource.getRepository(Partner); // Repository for Partner

  // Create a new product
  async createProduct(productData: Partial<Product>): Promise<Product> {
    const { ownerId, ...rest } = productData;

    // Validate that the owner is a Partner
    const partner = await this.partnerRepository.findOne({
      where: { id: ownerId },
    });
    if (!partner) {
      throw new Error("Owner must be a Partner");
    }

    const product = this.productRepository.create({
      ...rest,
      owner: partner, // Set the owner as the Partner
    });

    return await this.productRepository.save(product);
  }

  // Get all products
  async getAllProducts(): Promise<Product[]> {
    return await this.productRepository.find({
      relations: ["owner"], // Fetch the owner (Partner)
    });
  }

  // Get a product by ID
  async getProductById(id: number): Promise<Product | null> {
    return await this.productRepository.findOne({
      where: { id },
      relations: ["owner"], // Fetch the owner (Partner)
    });
  }

  // Update a product
  async updateProduct(
    id: number,
    productData: Partial<Product>
  ): Promise<Product | null> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new Error("Product not found");
    }

    // If ownerId is provided, validate that it's a Partner
    if (productData.ownerId) {
      const partner = await this.partnerRepository.findOne({
        where: { id: productData.ownerId },
      });
      if (!partner) {
        throw new Error("Owner must be a Partner");
      }
      product.owner = partner; // Update the owner
    }

    // Update other fields
    Object.assign(product, productData);

    return await this.productRepository.save(product);
  }

  // Delete a product
  async deleteProduct(id: number): Promise<void> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new Error("Product not found");
    }
    await this.productRepository.remove(product);
  }
}