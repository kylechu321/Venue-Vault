import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn
} from "typeorm";
import { Hirer } from "./hirer";

@Entity("venueHirerStats")
export class VenueHirerStat {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "int" })
    hirerId: number;

    @ManyToOne(() => Hirer)
    @JoinColumn({ name: "hirerId" })
    hirer: Hirer;

    @Column({ type: "varchar", length: 50 })
    firstNameOfHirer: string;

    @Column({ type: "varchar", length: 50 })
    lastNameOfHirer: string;

    @Column({ type: "float", default: 0.0 })
    ratingOfTheHirer: number;

    @Column({ type: "int", default: 0 })
    approvalCount: number;

    @Column({ type: "int", default: 0 })
    totalCount: number;
}