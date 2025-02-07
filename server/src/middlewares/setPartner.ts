import admin from '../config/firebase';
import { UserService } from '../services/userService';


export async function setPartnerRole(uid: string) {
    const userService= new UserService();
  try {
    await admin.auth().setCustomUserClaims(uid, { role: 'partner' });
    console.log(`Custom claims set for partner ${uid}`);

  // Update the local database to reflect the role change
  const user = await userService.findByUid(uid);
  if (user) {
    await userService.update(user.id, { role: 'partner' });
    console.log(`partner role updated in local database for user ${uid}`);
  } else {
    console.warn(`User with UID ${uid} not found in local database`);
  }
    } catch (error) {
  console.error('Error setting custom claims or updating database:', error);
        }
}
