import AppDataSource from "../data-source";
import { Address } from "../entities/Address";
import { User } from "../entities/User";
import { MailService } from "./MailService";


export class AddressService {
  private addressRepository = AppDataSource.getRepository(Address);
   private mailService = new MailService();


  // Save or update an address
  async saveAddress(userId: number, addressData: Partial<Address>): Promise<Address> {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: userId }, relations: ["address"] });

    if (!user) {
      throw new Error("User not found");
    }

    let address = user.address;
    if (address) {
      // Update existing address
      Object.assign(address, addressData);
    } else {
      // Create new address
      address = this.addressRepository.create(addressData);
      address.user = user;
    }
    this.mailService.infoChange(user.email,user.firstName)
    return await this.addressRepository.save(address);
  }

  // Get address by user ID
  async getAddressByUserId(userId: number): Promise<Address | null> {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: userId }, relations: ["address"] });

    if (!user) {
      throw new Error("User not found");
    }

    return user.address || null;
  }

  // Update address by user ID
  async updateAddress(userId: number, addressData: Partial<Address>): Promise<Address> {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: userId }, relations: ["address"] });
    const address = await this.getAddressByUserId(userId);
    if (!address) {
      throw new Error("Address not found");
    }
    Object.assign(address, addressData);
    if (user){
    this.mailService.infoChange(user.email,user.firstName);}
    return await this.addressRepository.save(address);
  }

  // Delete address by user ID
  async deleteAddress(userId: number): Promise<void> {
    const address = await this.getAddressByUserId(userId);
    if (!address) {
      throw new Error("Address not found");
    }
    await this.addressRepository.remove(address);
  }
}