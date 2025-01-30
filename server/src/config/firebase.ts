import admin from "firebase-admin";
import serviceAccount from "./serviceAccount.json"; // Import the JSON file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount), // Explicitly cast to ServiceAccount
});

export default admin;
