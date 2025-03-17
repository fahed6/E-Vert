import axios from "axios";
import { Product } from "../types/Product";

const BASE_URL = "http://localhost:5000/category";

export class CategoryService {
  /**
   * Fetch products by category
   * @param categoryName - The name of the category
   * @returns A list of products in the specified category
   */
  async getProductsByCategory(categoryName: string): Promise<Product[]> {
    try {
      const response = await axios.get(`${BASE_URL}/${categoryName}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching products by category:", error);
      throw error;
    }
  }

  /**
   * Fetch all categories
   * @returns A list of all categories
   */
  async getAllCategories() {
    try {
      const response = await axios.get(`${BASE_URL}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching all categories:", error);
      throw error;
    }
  }

  /**
   * Create a new category
   * @param name - The name of the category
   * @returns The created category
   */
  async createCategory(name: string) {
    try {
      const response = await axios.post(`${BASE_URL}/`, { name });
      return response.data;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }

  /**
   * Delete a category
   * @param id - The ID of the category to delete
   */
  async deleteCategory(id: number) {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  }
}
