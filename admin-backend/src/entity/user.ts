import {
  Entity,
  PrimaryGeneratedColumn,
  Column, CreateDateColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column( {type: "varchar", length: 50 })
  firstName: string;

  @Column( {type: "varchar", length: 50 })
  lastName: string;

  @Column( {type: "varchar", length: 50 })
  email: string;

  @Column( {type: "varchar", length: 50 })
  password: string;

  @Column( {type: "varchar", length: 50 })
  phoneNumber: string;

  @Column( {type: "varchar", length: 50, default: "none"} )
  role: string;

  @Column({ nullable: true, type: "float" })
  rating: number;

  @CreateDateColumn({type: "datetime", default: () => "GETDATE()"})
  createdAt: Date;
}
