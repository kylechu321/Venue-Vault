import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne, 
  JoinColumn
} from "typeorm";

import { User } from "./user";

@Entity()
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  userID: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userID" })
  user: User;

}
