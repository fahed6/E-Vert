import { apiCall } from '../config//api/apiCall';

const BASE_URL = 'http://localhost:5000/partner'; 

export class PartnerService{
    async getProductsByOwnerId(ownerId:number){
        return apiCall(`${BASE_URL}/${ownerId}`, 'GET');
    }
}