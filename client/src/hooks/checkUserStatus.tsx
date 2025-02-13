import Swal from "sweetalert2";
import { apiCall } from "../config/api/apiCall";

export const checkUserStatus = async (uid: string): Promise<boolean> => {
  try {
    const user = await apiCall(`http://localhost:5000/user/uid/${uid}`, "GET");

    if (!user) {
      console.log("User not found in local database, creating a new one...");
      return false; // User doesn't exist
    }

    if (!user.isActive) {
      await Swal.fire({
        icon: "error",
        title: "Account Disabled",
        text: "Your account has been disabled. Please contact support.",
      });
      return false; // User is deactivated
    }

    return true; // User exists & is active
  } catch (error) {
    console.error("Error checking user status:", error);
    return false;
  }
};
