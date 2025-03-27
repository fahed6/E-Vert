import { DataSource } from "typeorm";
import { Address } from "./entities/Address";
import { Category } from "./entities/Category";
import { Partner } from "./entities/Partner";
import { Product } from "./entities/Product";
import { User } from "./entities/User";
import { Cart } from "./entities/Cart";
import { CartItem } from "./entities/CartItem";
import { Payment } from "./entities/Payment";
import { Order } from "./entities/Order";

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "123",
  database: "E-Vert",
  synchronize: true, 
  logging: false,
  entities: [User,Address,Product,Partner,Category,Cart,CartItem,Order,Payment], 
  migrations: [],
  subscribers: [],
});

export default AppDataSource;
