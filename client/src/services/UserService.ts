import { apiCall } from '../config//api/apiCall';

const BASE_URL = 'http://localhost:5000/user'; 


export class UserService {

  async activateUser(id: number) {
    return apiCall(`${BASE_URL}/${id}/activate`, 'PATCH');
  }
  async countUsers() {
    return apiCall(`${BASE_URL}/count/regular`, 'GET');
  }

  async countPartners() {
    return apiCall(`${BASE_URL}/count/partners`, 'GET');
  }


  async deactivateUser(id: number) {
    return apiCall(`${BASE_URL}/${id}/deactivate`, 'PATCH');
  }


  async createUser(userData: any) {
    return apiCall(`${BASE_URL}/`, 'POST', userData);
  }


  async getAllUsers() {
    return apiCall(`${BASE_URL}`, 'GET');
  }


  async getUserById(id: number) {
    return apiCall(`${BASE_URL}/${id}`, 'GET');
  }


  async  getUserByUid(uid: string) {
    return apiCall(`${BASE_URL}/uid/${uid}`, 'GET');
  }


  async updateUser(id: number, userData: any) {
    return apiCall(`${BASE_URL}/${id}`, 'PUT', userData);
  }


  async deleteUser(id: number) {
    return apiCall(`${BASE_URL}/${id}`, 'DELETE');
  }
}