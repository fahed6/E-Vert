import { Request, Response, Router } from "express";
import { PartnerService } from "../services/PartnerService";

export class PartnerController {
    private partnerService: PartnerService;
    public router: Router;

    constructor() {
        this.partnerService = new PartnerService();
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get("/:ownerId", this.getPartnerProducts.bind(this));
        this.router.get("/count/:ownerId", this.getCountProducts.bind(this));
    }

    async getCountProducts(req: Request, res: Response) {
        try {
            const count = await this.partnerService.getTotalCount(Number(req.params.ownerId));
            res.status(200).json({ count });
        } catch (error) {
            console.error("Get total order count error:", error);
            res.status(500).json({ 
                message: error instanceof Error ? error.message : "Failed to get order count" 
            });
        }
    }

    async getPartnerProducts(req: Request, res: Response) {
        try {
            const ownerId = Number(req.params.ownerId);
            const page = req.query.page ? Number(req.query.page) : 1;
            const limit = req.query.limit ? Number(req.query.limit) : 10;

            const { products, totalCount } = await this.partnerService.getPartnerProducts(
                ownerId,
                page,
                limit
            );

            res.json({
                success: true,
                data: products,
                pagination: {
                    page,
                    limit,
                    totalCount,
                    totalPages: Math.ceil(totalCount / limit)
                }
            });
        } catch (error: any) {
            res.status(500).json({ 
                success: false,
                message: error.message 
            });
        }
    }
}