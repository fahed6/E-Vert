import { Request, Response, Router } from 'express';
import { MailService } from '../services/MailService';
import { UserService } from '../services/userService';


export class UserController {
  private userService: UserService;
  public router: Router;
  private mailService : MailService;
  

  constructor() {
    this.userService = new UserService();
    this.router = Router();
    this.initializeRoutes();
    this.mailService = new MailService();
    
  }

  private initializeRoutes() {
    this.router.post('/', this.add.bind(this)); // not Protected
    this.router.get('/', this.getAll.bind(this));  // not Protected
    this.router.get('/:id', this.getById.bind(this)); // not Protected
    this.router.get('/uid/:uid', this.getByUid.bind(this));  // not Protected
    this.router.put('/:id', this.update.bind(this)); // not Protected
    this.router.delete('/:id', this.delete.bind(this)); // not Protected
    this.router.patch("/:id/activate", this.activate.bind(this)); // Protected
    this.router.patch("/:id/deactivate", this.deactivate.bind(this));// not Protected
    this.router.get('/count/regular', this.countRegularUsers.bind(this)); // New endpoint
    this.router.get('/count/partners', this.countPartnerUsers.bind(this)); // New endpoint

  }


  public async countRegularUsers(req: Request, res: Response) {
    try {
      const count = await this.userService.countRegularUsers();
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  // Count partner users (role="partner")
  public async countPartnerUsers(req: Request, res: Response) {
    try {
      const count = await this.userService.countPartnerUsers();
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
  public async activate(req: Request, res: Response) {
    try {
      const user = await this.userService.activate(Number(req.params.id));
      user ? res.json(user) : res.status(404).json({ message: "User not found" });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  // Deactivate a user account
  public async deactivate(req: Request, res: Response) {
    try {
      const user = await this.userService.deactivate(Number(req.params.id));
      user ? res.json(user) : res.status(404).json({ message: "User not found" });
    } catch (error) {
      res.status(500).json({ error });
    }
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

    // Get a user by UID
    public async getByUid(req: Request, res: Response) {
      try {
        const user = await this.userService.findByUid(String(req.params.uid));
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