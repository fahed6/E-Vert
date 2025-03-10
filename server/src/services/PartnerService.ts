import AppDataSource from "../data-source";
import { Partner } from "../entities/Partner";
import { Product } from "../entities/Product";

export class PartnerService{
    
    private productRepository = AppDataSource.getRepository(Product);
    private partnerRepository = AppDataSource.getRepository(Partner); 

    async getPartnerProducts(ownerId: number): Promise<Product[]> {
        return await this.productRepository.find({
          where: { ownerId }, 
          relations: ["owner"], 
        });
      }
}