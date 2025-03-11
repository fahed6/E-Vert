import cors from "cors";
import express from "express";
import "reflect-metadata";
import { RoleController } from "./controller/RoleController";
import { UserController } from "./controller/UserController";
import AppDataSource from "./data-source";
import { AddressController } from "./controller/AddressController";
import { ProductController } from "./controller/ProductController";
import { PartnerController } from "./controller/PartnerController";
import path from "path";
const http = require("http");



const app = express();



// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const userController = new UserController();
app.use("/user", userController.router);

const addressController = new AddressController();
app.use("/address", addressController.router);

const roleController = new RoleController();
app.use("/role", roleController.router);

const productController = new ProductController();
app.use("/product", productController.router);

const partnerController = new PartnerController();
app.use("/partner", partnerController.router);

const PORT = process.env.PORT || 5000;


const server = http.createServer({
  maxHeaderSize: 132768, // Increase header size limit
}, app)

AppDataSource.initialize()
  .then(() => {
    console.log("✅ Database connected!");
    server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

  })
  .catch((error) => console.log("❌ Database connection error:", error));
