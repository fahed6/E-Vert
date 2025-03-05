import { Router, Request, Response } from "express";
import { AddressService } from "../services/AddressService";

export class AddressController {
  private addressService: AddressService;
  public router: Router;

  constructor() {
    this.addressService = new AddressService();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post("/", this.saveAddress.bind(this));
    this.router.get("/:userId", this.getAddressByUserId.bind(this));
    this.router.put("/:userId", this.updateAddress.bind(this));
    this.router.delete("/:userId", this.deleteAddress.bind(this));
  }

  // Save or update an address
  private async saveAddress(req: Request, res: Response) {
    const { userId, CodePost, City, State, StreetAddress } = req.body;
    try {
      const addressData = { CodePost, City, State, StreetAddress };
      const address = await this.addressService.saveAddress(userId, addressData);
      res.status(200).json(address);
    } catch (error) {
      res.status(500).json({ error: "Failed to save address" });
    }
  }

  // Get address by user ID
  private async getAddressByUserId(req: Request, res: Response) {
    const { userId } = req.params;
    try {
      const address = await this.addressService.getAddressByUserId(Number(userId));
      if (address) {
        res.status(200).json(address);
      } else {
        res.status(404).json({ error: "Address not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch address" });
    }
  }

  // Update address by user ID
  private async updateAddress(req: Request, res: Response) {
    const { userId } = req.params;
    const { CodePost, City, State, StreetAddress } = req.body;
    try {
      const addressData = { CodePost, City, State, StreetAddress };
      const address = await this.addressService.updateAddress(Number(userId), addressData);
      res.status(200).json(address);
    } catch (error) {
      res.status(500).json({ error: "Failed to update address" });
    }
  }

  // Delete address by user ID
  private async deleteAddress(req: Request, res: Response) {
    const { userId } = req.params;
    try {
      await this.addressService.deleteAddress(Number(userId));
      res.status(200).json({ message: "Address deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete address" });
    }
  }
}