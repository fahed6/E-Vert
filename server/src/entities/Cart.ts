import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { CartItem } from "./CartItem";
import { Order } from "./Order";

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
  items!: CartItem[];

  @OneToMany(() => Order, order => order.cart)
  orders!: Order[];

  @Column()
  userId!: number; // ID of the user who owns the cart
}