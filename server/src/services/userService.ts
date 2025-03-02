import { Repository } from "typeorm";
import admin from "../config/firebase";
import AppDataSource from "../data-source";
import { User } from "../entities/User";
import { MailService } from "../services/MailService";

export class UserService {
  private userRepository: Repository<User>;
  private mailService = new MailService();
   



  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  // Create a new user
  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    this.mailService.welcomeMail(user.email,user.firstName);
    return this.userRepository.save(user);
  }

  // Find user by ID
  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  // Find user by UID
  async findByUid(uid: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { uid } });
  }

  // Find user by email
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  // Get all users
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  // Update user
  async update(id: number, updateData: Partial<User>): Promise<User | null> {
    await this.userRepository.update(id, updateData);
    return this.findById(id);
  }

  // Soft delete (deactivate user) & disable in Firebase
  async deactivate(id: number): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    await this.userRepository.update(id, { isActive: false });

    // Disable user in Firebase Authentication
    try {
      await admin.auth().updateUser(user.uid, { disabled: true });
      console.log(`User ${user.uid} disabled in Firebase`);
      this.mailService.deactivateMail(user.email,user.firstName)
    } catch (error) {
      console.error("Error disabling user in Firebase:", error);
    }

    return this.findById(id);
  }

  // Reactivate user & enable in Firebase
  async activate(id: number): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    await this.userRepository.update(id, { isActive: true });

    // Enable user in Firebase Authentication
    try {
      await admin.auth().updateUser(user.uid, { disabled: false });
      console.log(`User ${user.uid} enabled in Firebase`);
      this.mailService.activateMail(user.email,user.firstName)
    } catch (error) {
      console.error("Error enabling user in Firebase:", error);
    }

    return this.findById(id);
  }

  // Delete user permanently from local DB & Firebase
  async delete(id: number): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new Error("User not found");
    }

    await this.userRepository.delete(id);

    // Delete user from Firebase Authentication
    try {
      await admin.auth().deleteUser(user.uid);
      console.log(`User ${user.uid} deleted from Firebase`);
    } catch (error) {
      console.error("Error deleting user from Firebase:", error);
    }
  }
}
