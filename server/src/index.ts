import cors from "cors";
import express from "express";
import "reflect-metadata";
import { RoleController } from "./controller/RoleController";
import { UserController } from "./controller/UserController";
import AppDataSource from "./data-source";



const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize User Controller
const userController = new UserController();
app.use("/user", userController.router);

// Initialize role Controller
const roleController = new RoleController();
app.use("/role", roleController.router);

const PORT = process.env.PORT || 5000;




AppDataSource.initialize()
  .then(() => {
    console.log("✅ Database connected!");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

  })
  .catch((error) => console.log("❌ Database connection error:", error));
