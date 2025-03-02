// src/hooks/useUserData.ts
import { useState, useEffect } from 'react';
import { auth } from '../config/firebase-config';
import { UserService } from '../services/UserService';
import { onAuthStateChanged } from 'firebase/auth';

const userService = new UserService();

const useUserData = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const uid = currentUser.uid;
          const userData = await userService.getUserByUid(uid);
          setUser(userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return user;
};

export default useUserData;
