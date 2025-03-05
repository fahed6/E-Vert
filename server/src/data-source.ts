import { DataSource } from "typeorm";
import { Address } from "./entities/Address";
import { Partner } from "./entities/Partner";
import { Product } from "./entities/Product";
import { User } from "./entities/User";

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "123",
  database: "E-Vert",
  synchronize: true, 
  logging: false,
  entities: [User,Address,Product,Partner], 
  migrations: [],
  subscribers: [],
});

export default AppDataSource;
