import { UserService } from '../services/UserService';
import { auth } from '../config/firebase-config';

export const checkAdmin = async (): Promise<boolean> => {
  const currentUser = auth.currentUser;
  if (!currentUser) return false;

  try {
    const userService = new UserService();
    const userData = await userService.getUserByUid(currentUser.uid); 
    return userData.role === 'admin'; 
  } catch (error) {
    console.error('Error checking admin role:', error);
    return false;
  }
};