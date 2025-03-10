import { apiCall } from '../config/api/apiCall';

const BASE_URL = 'http://localhost:5000/address'; 

export class AddressService {
  // Save or update an address
  async saveAddress(userId: number, addressData: any) {
    return apiCall(`${BASE_URL}`, 'POST', { userId, ...addressData });
  }

  // Get address by user ID
  async getAddressByUserId(userId: number) {
    return apiCall(`${BASE_URL}/${userId}`, 'GET');
  }

  // Update address by user ID
  async updateAddress(userId: number, addressData: any) {
    return apiCall(`${BASE_URL}/${userId}`, 'PUT', addressData);
  }

  // Delete address by user ID
  async deleteAddress(userId: number) {
    return apiCall(`${BASE_URL}/${userId}`, 'DELETE');
  }
}