import cors from "cors";
import express, { Application } from "express";
import "reflect-metadata";
import AppDataSource from "./data-source";
import {User} from "./entities/User"; // Assuming `User` is a TypeORM entity

const app: Application = express();

app.use(cors());
app.use(express.json());

const PORT: number = 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

AppDataSource.initialize()
  .then(async () => {
    console.log("Database connected");

    // Example: Adding a user
    const user = new User();
    user.firstName = "John";
    user.lastName = "Doe";
    user.isActive = true;

    await AppDataSource.manager.save(user);
    console.log("User has been saved:", user);
  })
  .catch((error: Error) => console.error("Database connection error:", error));
