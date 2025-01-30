import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const serviceAccount = JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS || "{}");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export default admin;
