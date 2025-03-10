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
  }

  async getPartnerProducts(req: Request, res: Response) {
        try {
          const ownerId = Number(req.params.ownerId);
          const products = await this.partnerService.getPartnerProducts(ownerId);
          res.json(products);
        } catch (error: any) {
          res.status(500).json({ message: error.message });
        }
      }
}