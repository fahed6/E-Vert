import { Request, Response, Router } from 'express';
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
        // Pass uid in the URL
        this.router.post('/setAdmin/:uid', this.setAdmin.bind(this));
        this.router.post('/setPartner/:uid', this.setPartner.bind(this));
    }

    public async setAdmin(req: Request, res: Response): Promise<void> {
        try {
            const { uid } = req.params; // Extract uid from URL parameters
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
            const { uid } = req.params; // Extract uid from URL parameters
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