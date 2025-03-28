import { signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { apiCall } from "../config/api/apiCall"; // Import API call function
import { auth, googleProvider } from "../config/firebase-config";
import { checkUserStatus } from "../hooks/checkUserStatus";

const useAuth = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  // 🔹 Email/Password Sign-In Handler
  const handleSignIn = async (): Promise<void> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in:", userCredential.user);

      const idToken = await userCredential.user.getIdToken();
      localStorage.setItem("firebaseIdToken", idToken);

      const userExists = await checkUserStatus(userCredential.user.uid);
      if (userExists) {
        navigate("/home");
      }
    } catch (error: any) {
      console.error("Error signing in:", error.message);

      // 🔹 Show popup ONLY when the user is disabled
      if (error.code === "auth/user-disabled") {
        await Swal.fire({
          icon: "error",
          title: "Account Disabled",
          text: "Your account has been disabled. Please contact support.",
        });
      }
    }
  };

  // 🔹 Google Sign-In Handler
  const handleGoogleSignIn = async (): Promise<void> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("User signed in with Google:", result.user);

      const idToken = await result.user.getIdToken();
      localStorage.setItem("firebaseIdToken", idToken);

      const user = result.user;
      const userExists = await checkUserStatus(user.uid);

      if (!userExists) {
        // If user doesn't exist, create in local DB
        const newUser = {
          uid: user.uid,
          email: user.email || "",
          firstName: user.displayName?.split(" ")[0] || "",
          lastName: user.displayName?.split(" ")[1] || "",
          phoneNumber: user.phoneNumber || "",
          isActive: true,
          role: "user",
        };

        const response = await apiCall("http://localhost:5000/user", "POST", newUser);

        if (response) {
          console.log("New user added to the local database.");
          navigate("/home");
        } else {
          console.error("Error creating user in the database.");
        }
      } else {
        navigate("/home");
      }
    } catch (error: any) {
      console.error("Error signing in with Google:", error.message);

      // 🔹 Show popup ONLY when the user is disabled
      if (error.code === "auth/user-disabled") {
        await Swal.fire({
          icon: "error",
          title: "Account Disabled",
          text: "Your account has been disabled. Please contact support.",
        });
      }
    }
  };

  // 🔹 Logout Handler
  const handleLogout = async (): Promise<void> => {
    try {
      await signOut(auth);
      localStorage.removeItem("firebaseIdToken");
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    handleSignIn,
    handleGoogleSignIn,
    handleLogout,
  };
};

export default useAuth;
