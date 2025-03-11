import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Partner } from "./Partner";
  
  @Entity({ name: "product" })
  export class Product {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column({ type: "text" })
    name!: string;

    @Column({ type: "text" })
    stock!: number;

    @Column({ type: "text" })
    
    price!: number;
  
    @Column({ type: "text" })
    description!: string;
  
    @Column({ type: "text", nullable: true }) 
    image!: string | null;
  
    // Many-to-one relationship with Partner
    @ManyToOne(() => Partner, (partner) => partner.products)
    @JoinColumn({ name: "ownerId" })
    owner!: Partner;
  
    @Column({ type: "int" })
    ownerId!: number; 
  }