import { apiCall } from '../config/api/apiCall';
import { Product } from '../types/Product';

const BASE_URL = 'http://localhost:5000/product'; // Base URL for product endpoints

export class ProductService {
  // Create a new product with file upload
  async createProduct(productData: FormData): Promise<Product> {
    return apiCall(`${BASE_URL}`, 'POST', productData, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    });
  }

  // Get all products
  async getAllProducts(): Promise<Product[]> {
    return apiCall(`${BASE_URL}`, 'GET');
  }

  // Get a product by ID
  async getProductById(id: number): Promise<Product> {
    return apiCall(`${BASE_URL}/${id}`, 'GET');
  }

  // Update a product
  async updateProduct(id: number, productData: Partial<Product>): Promise<Product> {
    return apiCall(`${BASE_URL}/${id}`, 'PUT', productData);
  }

  // Delete a product
  async deleteProduct(id: number): Promise<void> {
    return apiCall(`${BASE_URL}/${id}`, 'DELETE');
  }
}