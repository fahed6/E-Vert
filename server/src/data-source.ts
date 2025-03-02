import { DataSource } from "typeorm";
import {User} from "./entities/User"; // Ensure the path is correct
import { Address } from "./entities/Address";

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "123",
  database: "E-Vert",
  synchronize: true, // Set to false in production
  logging: false,
  entities: [User,Address], // Include all your entities here
  migrations: [],
  subscribers: [],
});

export default AppDataSource;
