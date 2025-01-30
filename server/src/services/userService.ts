import { Repository } from "typeorm";
import { User } from "../entities/User";
import  AppDataSource  from "../data-source";

export class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  // Create a new user
  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
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

  // Soft delete (deactivate user)
  async deactivate(id: number): Promise<User | null> {
    await this.userRepository.update(id, { isActive: false });
    return this.findById(id);
  }

  // Delete user permanently
  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
