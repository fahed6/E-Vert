import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./Order";
import { User } from "./User";

export enum PaymentMethod {
  CARD = "card",
  STORE_PICKUP = "store_pickup",
  DELIVERY="delivery"

}

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "float" })
  amount!: number;

  @Column({
    type: "enum",
    enum: PaymentMethod
  })
  method!: PaymentMethod;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user!: User;

  @OneToOne(() => Order, order => order.payment)
  @JoinColumn()
  order!: Order;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;
}