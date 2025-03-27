import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Address } from "./Address";
import { Cart } from "./Cart";
import { Payment } from "./Payment";
import { User } from "./User";

export enum OrderState {
  HOLD = "hold",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  // Changed to optional and added jsonb snapshot
  @ManyToOne(() => Cart, cart => cart.orders, { nullable: true })
  @JoinColumn()
  cart?: Cart;

  @Column({ type: 'jsonb', nullable: true })
  cartSnapshot!: {
    items: Array<{
      productId: number;
      name: string;
      price: number;
      imageUrl: string | null;
      size: string;
      quantity: number;
    }>;
    total: number;
  };

  @ManyToOne(() => User, user => user.orders)

  user!: User;

  @ManyToOne(() => Address)
  @JoinColumn({ name: "addressId" })
  address!: Address;

  @Column({
    type: "enum",
    enum: OrderState,
    default: OrderState.HOLD
  })
  orderState!: OrderState;

  @OneToOne(() => Payment, payment => payment.order, { cascade: true })
  payment!: Payment;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  // Helper method to create snapshot
  createSnapshot(cart: Cart): void {
    this.cartSnapshot = {
      items: cart.items.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        imageUrl: item.product.image || null,  // Handle null case
        size: item.size,
        quantity: item.quantity
      })),
      total: cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
    };
  }}