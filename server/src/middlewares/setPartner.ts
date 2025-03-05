import admin from '../config/firebase';
import AppDataSource from '../data-source';
import { Partner } from '../entities/Partner';
import { UserService } from '../services/userService';

export async function setPartnerRole(uid: string) {
  const userService = new UserService();
  const partnerRepository = AppDataSource.getRepository(Partner);

  try {
    // Set custom claims in Firebase
    await admin.auth().setCustomUserClaims(uid, { role: 'partner' });
    console.log(`Custom claims set for partner ${uid}`);

    // Find the user by UID
    const user = await userService.findByUid(uid);
    if (user) {
      // Update the user's role to 'partner'
      await userService.update(user.id, { role: 'partner' });

      // Check if a Partner entity already exists for this user
      let partner = await partnerRepository.findOne({ where: { id: user.id } });
      if (!partner) {
        // Create a new Partner entity (only set the ID, as other fields are inherited)
        partner = partnerRepository.create({
          id: user.id, // Inherit the user's ID
        });
        await partnerRepository.save(partner);
        console.log(`Partner entity created for user ${uid}`);
      } else {
        console.log(`Partner entity already exists for user ${uid}`);
      }

      console.log(`Partner role updated in local database for user ${uid}`);
    } else {
      console.warn(`User with UID ${uid} not found in local database`);
    }
  } catch (error) {
    console.error('Error setting custom claims or updating database:', error);
  }
}