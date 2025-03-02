// src/entities/Address.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity({ name: "address" })
export class Address {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int" })
  CodePost!: number;

  @Column({ type: "text" })
  City!: string;

  @Column({ type: "text" })
  State!: string;

  @Column({ type: "text" })
  StreetAddress!: string;

  @OneToOne(() => User, (user) => user.address)
  @JoinColumn()
  user!: User;
}