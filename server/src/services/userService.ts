import { Repository } from "typeorm";
import admin from "../config/firebase";
import AppDataSource from "../data-source";
import { User } from "../entities/User";
import { MailService } from "../services/MailService";
import { Cart } from "../entities/Cart";

export class UserService {
  private userRepository: Repository<User>;
  private mailService = new MailService();
  private cartRepository = AppDataSource.getRepository(Cart);
   
  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    
  }


  async findRegularUsers(): Promise<User[]> {
    return this.userRepository.find({where:{role:"user"}});
  }
  async findPartnerUsers(): Promise<User[]> {
    return this.userRepository.find({ where: { role: "partner" } });
  }
  async countRegularUsers(): Promise<number> {
    return this.userRepository.count({ where: { role: "user" } });
  }
  async countPartnerUsers(): Promise<number> {
    return this.userRepository.count({ where: { role: "partner" } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);

    // Save the user first
    const savedUser = await this.userRepository.save(user);

    // Create a cart for the user
    const cart = this.cartRepository.create({ userId: savedUser.id, items: [] });
    await this.cartRepository.save(cart);

    // Send welcome email
    this.mailService.welcomeMail(savedUser.email, savedUser.firstName);

    return savedUser;
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByUid(uid: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { uid } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }


  async update(id: number, updateData: Partial<User>): Promise<User | null> {
    await this.userRepository.update(id, updateData);
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id }});
    if (user){
    this.mailService.infoChange(user.email,user.firstName);
  }
    return this.findById(id);
  }

  async deactivate(id: number): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    await this.userRepository.update(id, { isActive: false });
   
    try {
      await admin.auth().updateUser(user.uid, { disabled: true });
      console.log(`User ${user.uid} disabled in Firebase`);
      this.mailService.deactivateMail(user.email,user.firstName)
    } catch (error) {
      console.error("Error disabling user in Firebase:", error);
    }

    return this.findById(id);
  }

  async activate(id: number): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    await this.userRepository.update(id, { isActive: true });

    
    try {
      await admin.auth().updateUser(user.uid, { disabled: false });
      console.log(`User ${user.uid} enabled in Firebase`);
      this.mailService.activateMail(user.email,user.firstName)
    } catch (error) {
      console.error("Error enabling user in Firebase:", error);
    }

    return this.findById(id);
  }

 
  async delete(id: number): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    await this.userRepository.delete(id);

   
    try {
      await admin.auth().deleteUser(user.uid);
      console.log(`User ${user.uid} deleted from Firebase`);
    } catch (error) {
      console.error("Error deleting user from Firebase:", error);
    }
  }
}
