import AppDataSource from "../data-source";
import { Category } from "../entities/Category";
import { Product } from "../entities/Product";

export class CategoryService {
  private categoryRepository = AppDataSource.getRepository(Category);
  private productRepository = AppDataSource.getRepository(Product);

  /**
   * Create a new category
   * @param name - The name of the category
   * @returns The created category
   */
  async createCategory(name: string): Promise<Category> {
    const category = this.categoryRepository.create({ name });
    return await this.categoryRepository.save(category);
  }

  /**
   * Fetch all categories
   * @returns A list of all categories
   */
  async getAllCategories(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  /**
   * Fetch products by category
   * @param categoryName - The name of the category
   * @returns A list of products in the specified category
   */
  async getProductsByCategory(categoryName: string): Promise<Product[]> {
    const products = await this.productRepository.find({
      relations: ["categories"], // Load the categories
      where: {
        categories: {
          name: categoryName, // Filter by category name
        },
      },
    });
    return products;
  }

  /**
   * Delete a category
   * @param id - The ID of the category to delete
   */
  async deleteCategory(id: number): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}