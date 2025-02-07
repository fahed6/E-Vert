import { Request, Response, Router } from 'express';
import AuthMiddleware from '../middlewares/authMiddleware'; // Import middleware
import { UserService } from '../services/userService';

export class UserController {
  private userService: UserService;
  public router: Router;

  constructor() {
    this.userService = new UserService();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/', this.add.bind(this));
    this.router.get('/', AuthMiddleware.decodeToken, AuthMiddleware.isAdmin, this.getAll.bind(this)); //  Admin only
    this.router.get('/:id', this.getById.bind(this)); // not Protected
    this.router.put('/:id', this.update.bind(this)); // not Protected
    this.router.patch('/:id', this.deactivate.bind(this)); // not Protected
    this.router.delete('/:id', this.delete.bind(this)); // not Protected
  }

  // Create a new user
  public async add(req: Request, res: Response) {
    try {
      const user = await this.userService.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  // Get all users (🔒 Admin only)
  public async getAll(req: Request, res: Response) {
    try {
      const users = await this.userService.findAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  // Get a user by ID
  public async getById(req: Request, res: Response) {
    try {
      const user = await this.userService.findById(Number(req.params.id));
      user ? res.json(user) : res.status(404).json({ message: 'User not found' });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  // Update a user
  public async update(req: Request, res: Response) {
    try {
      const user = await this.userService.update(Number(req.params.id), req.body);
      user ? res.json(user) : res.status(404).json({ message: 'User not found' });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  // Deactivate user
  public async deactivate(req: Request, res: Response) {
    try {
      const user = await this.userService.deactivate(Number(req.params.id));
      user ? res.json(user) : res.status(404).json({ message: 'User not found' });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  // Delete user permanently
  public async delete(req: Request, res: Response) {
    try {
      await this.userService.delete(Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}