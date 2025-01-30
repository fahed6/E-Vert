import admin from '../config/firebase';

export async function setAdminRole(uid: string) {
  try {
    await admin.auth().setCustomUserClaims(uid, { role: 'admin' });
    console.log(`Custom claims set for user ${uid}`);
  } catch (error) {
    console.error('Error setting custom claims:', error);
  }
}
