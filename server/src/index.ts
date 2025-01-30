import cors from "cors";
import express from "express";
import "reflect-metadata";
import { UserController } from "./controller/UserController";
import AppDataSource from "./data-source";
import { setAdminRole } from "./middlewares/setAdmin";



const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize User Controller
const userController = new UserController();
app.use("/user", userController.router);

const PORT = process.env.PORT || 5000;

const userId = "MIpWFCoyuIbYnXUPPzEc7qURIZY2"; 
setAdminRole(userId)
  .then(() => console.log(`✅ Admin role set for user ${userId}`))
  .catch((error) => console.error("❌ Failed to set admin role:", error));


AppDataSource.initialize()
  .then(() => {
    console.log("✅ Database connected!");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

  })
  .catch((error) => console.log("❌ Database connection error:", error));
