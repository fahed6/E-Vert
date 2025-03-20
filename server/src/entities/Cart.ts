import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { CartItem } from "./CartItem";

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
  items!: CartItem[];

  @Column()
  userId!: number; // ID of the user who owns the cart
}