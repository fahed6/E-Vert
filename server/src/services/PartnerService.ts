import { FindManyOptions } from "typeorm";
import AppDataSource from "../data-source";
import { Partner } from "../entities/Partner";
import { Product } from "../entities/Product";

export class PartnerService {
    private productRepository = AppDataSource.getRepository(Product);
    private partnerRepository = AppDataSource.getRepository(Partner); 

    async getPartnerProducts(
        ownerId: number, 
        page: number = 1, 
        limit: number = 10
    ): Promise<{ products: Product[]; totalCount: number }> {
        const skip = (page - 1) * limit;
        
        const options: FindManyOptions<Product> = {
            where: { ownerId },
            relations: ["owner"],
            skip,
            take: limit,
        };

        const [products, totalCount] = await this.productRepository.findAndCount(options);
        
        return {
            products,
            totalCount
        };
    }

    async getTotalCount(ownerId: number) {
        return await this.productRepository.count({
            where: { ownerId },
            relations: ["owner"],
        });
    }
}