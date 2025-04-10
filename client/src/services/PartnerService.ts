import { apiCall } from '../config/api/apiCall';

const BASE_URL = 'http://localhost:5000/partner';

interface PaginationParams {
  page?: number;
  limit?: number;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: T;
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

export class PartnerService {
  async getProductsByOwnerId(
    ownerId: number,
    params?: PaginationParams
  ): Promise<PaginatedResponse<any>> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const url = `${BASE_URL}/${ownerId}?${queryParams.toString()}`;
    return apiCall(url, 'GET');
  }

  async getProductsCount(ownerId: number) {
    return apiCall(`${BASE_URL}/count/${ownerId}`, 'GET');
  }
}