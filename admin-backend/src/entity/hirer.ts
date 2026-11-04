import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn
} from "typeorm";

import { User } from "./user";

@Entity("hirer")
export class Hirer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "int" })
    userID: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: "userID" })
    user: User;

    @Column({ type: "varchar", length: "MAX", nullable: true })
    driverLicenseDoc: String;

    @Column({ type: "varchar", length: "MAX", nullable: true })
    insuranceDoc: String;

    @Column({ type: "varchar", length: "MAX", nullable: true })
    registrationDoc: String;

}
