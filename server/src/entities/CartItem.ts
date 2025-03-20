import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Cart } from "./Cart";
import { Product } from "./Product";

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "productId" })
  product!: Product;

  @Column()
  quantity!: number;

  @Column({ nullable: true })
  size!: string; // Optional size attribute

  @ManyToOne(() => Cart, (cart) => cart.items)
  cart!: Cart;
}