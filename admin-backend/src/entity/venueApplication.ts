import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { Venue } from "./venue";

@Entity("venue_application")
export class VenueApplication {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "int" })
    venueId: number;

    @ManyToOne(() => Venue)
    @JoinColumn({ name: "venueId" })
    venue: Venue;

    @Column({ type: "int" })
    hirerId: number;

    @Column({ type: "varchar", length: 50 })
    eventName: string;

    @Column({ type: "int" })
    guestNum: number;

    @Column({ type: "date" })
    hireDate: Date;

    @Column({ type: "time" })
    startTime: string;

    @Column({ type: "int" })
    hours: number;

    @Column({ type: "varchar", length: 50 })
    comment: string;

    @Column({ type: "int", default: 0 })
    pending: number;
}