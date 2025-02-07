import { Request, Response, Router } from 'express';
import AuthMiddleware from '../middlewares/authMiddleware';
import { RoleService } from "../services/RoleService";

export class RoleController {
    private roleService: RoleService;
    public router: Router;

    constructor() {
        this.roleService = new RoleService();
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/setAdmin', AuthMiddleware.decodeToken, AuthMiddleware.isAdmin, this.setAdmin.bind(this));//  Admin only
        this.router.post('/setPartner', AuthMiddleware.decodeToken, AuthMiddleware.isAdmin, this.setPartner.bind(this));//  Admin only
    }

    public async setAdmin(req: Request, res: Response): Promise<void> {
        try {
            const { uid } = req.body;
            if (!uid) {
                res.status(400).json({ error: "UID is required" });
                return;
            }
            await this.roleService.setAdmin(uid);
            res.status(200).json({ message: `User ${uid} is now an admin` });
        } catch (error) {
            res.status(500).json({ error: "Failed to set admin role", details: error });
        }
    }

    public async setPartner(req: Request, res: Response): Promise<void> {
        try {
            const { uid } = req.body;
            if (!uid) {
                res.status(400).json({ error: "UID is required" });
                return;
            }
            await this.roleService.setPartner(uid);
            res.status(200).json({ message: `User ${uid} is now a partner` });
        } catch (error) {
            res.status(500).json({ error: "Failed to set partner role", details: error });
        }
    }
}
