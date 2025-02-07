import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "user" })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "text", unique: true })
  uid!: string; // Firebase UID

  @Column({ type: "text" })
  firstName!: string;

  @Column({ type: "text" })
  lastName!: string;

  @Column({ type: "text", unique: true })
  email!: string;

  @Column({ type: "text" })
  phoneNumber!: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @Column({ type: "varchar", length: 50, default: "user" })
  role!: "admin" | "user"| "partner"; 
}
