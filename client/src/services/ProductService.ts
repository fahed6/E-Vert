import { apiCall } from '../config/api/apiCall';
import { Product } from '../types/Product';

const BASE_URL_PRODUCT = 'http://localhost:5000/product'; // Base URL for product endpoints

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  };
}

export class ProductService {

  async getDistribution(){
    return apiCall(`${BASE_URL_PRODUCT}/analytics/distribution`, 'GET')
  }

  // Create a new product with file upload
  async createProduct(productData: FormData): Promise<Product> {
    return apiCall(`${BASE_URL_PRODUCT}`, 'POST', productData, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    });
  }

  // Get all products
  async getAllProducts(
    page: number = 1, 
    limit: number = 10
  ): Promise<PaginatedResponse<Product>> {
    return apiCall(
      `${BASE_URL_PRODUCT}?page=${page}&limit=${limit}`, 
      'GET'
    );
  }
  async getRandomProducts(): Promise<Product[]> {
    return apiCall(`${BASE_URL_PRODUCT}/random`, 'GET');
  }
  // Get a product by ID
  async getProductById(id: number): Promise<Product> {
    return apiCall(`${BASE_URL_PRODUCT}/${id}`, 'GET');
  }

  // Update a product
  async updateProduct(id: number, data: Partial<Product> | FormData): Promise<Product> {
    // If data is FormData, let the browser set the Content-Type header
    if (data instanceof FormData) {
      return apiCall(`${BASE_URL_PRODUCT}/${id}`, 'PUT', data);
    }
    
    // For regular JSON data
    return apiCall(`${BASE_URL_PRODUCT}/${id}`, 'PUT', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  // Delete a product
  async deleteProduct(id: number): Promise<void> {
    return apiCall(`${BASE_URL_PRODUCT}/${id}`, 'DELETE');
  }
  async count() {
    return apiCall(`${BASE_URL_PRODUCT}/count/total`, 'GET');
  }
}