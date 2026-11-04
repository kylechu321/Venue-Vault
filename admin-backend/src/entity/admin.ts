import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
} from "typeorm";

@Entity("Admin")
export class Admin {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 50 })
    username: string;

    @Column({ type: "varchar", length: 50 })
    password: string;
}