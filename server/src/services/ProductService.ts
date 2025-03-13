import AppDataSource from "../data-source";
import { Partner } from "../entities/Partner";
import { Product } from "../entities/Product";

export class ProductService {
  private productRepository = AppDataSource.getRepository(Product);
  private partnerRepository = AppDataSource.getRepository(Partner);

  async createProduct(productData: Partial<Product>): Promise<Product> {
    const { ownerId, ...rest } = productData;
    const partner = await this.partnerRepository.findOne({
      where: { id: ownerId },
    });
    if (!partner) {
      throw new Error("Owner must be a Partner");
    }
    const product = this.productRepository.create({
      ...rest,
      owner: partner,
    });
    return await this.productRepository.save(product);
  }

  async getAllProducts(): Promise<Product[]> {
    return await this.productRepository.find({
      relations: ["owner"],
    });
  }
  async getRandomProducts(limit: number = 7): Promise<Product[]> {
    return await this.productRepository.find({
      relations: ["owner"],
      take: limit,// Limit the number of results
      order: { id: "DESC" }, // Optional: Order by ID or any other field
    });
  }

  async getProductById(id: number): Promise<Product | null> {
    return await this.productRepository.findOne({
      where: { id },
      relations: ["owner"],
    });
  }

  async updateProduct(
    id: number,
    productData: Partial<Product>
  ): Promise<Product | null> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new Error("Product not found");
    }
    if (productData.ownerId) {
      const partner = await this.partnerRepository.findOne({
        where: { id: productData.ownerId },
      });
      if (!partner) {
        throw new Error("Owner must be a Partner");
      }
      product.owner = partner;
    }
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