import cors from "cors";
import express from "express";
import path from "path";
import "reflect-metadata";
import { AddressController } from "./controller/AddressController";
import { CategoryController } from "./controller/CategoryController";
import { PartnerController } from "./controller/PartnerController";
import { ProductController } from "./controller/ProductController";
import { RoleController } from "./controller/RoleController";
import { UserController } from "./controller/UserController";
import AppDataSource from "./data-source";
import { CartController } from "./controller/CartController";
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

const categoryController = new CategoryController();
app.use("/category", categoryController.router);

const cartController = new CartController();
app.use("/cart", cartController.router);

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
