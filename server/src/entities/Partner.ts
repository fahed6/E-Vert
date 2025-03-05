import { ChildEntity, OneToMany } from "typeorm";
import { Product } from "./Product";
import { User } from "./User";

@ChildEntity("partner") 
export class Partner extends User {
  @OneToMany(() => Product, (product) => product.owner)
  products!: Product[];
}