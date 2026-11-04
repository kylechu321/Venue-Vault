import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn
} from "typeorm";

import { Venue } from "./venue";


@Entity("VenueBlockedPeriod")
export class VenueBlockedPeriod {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "int" })
    venueId: number;

    @ManyToOne(() => Venue)
    @JoinColumn({ name: "venueId" })
    venue: Venue;

    @Column({ type: "date" })
    startDate: Date;

    @Column({ type: "date" })
    endDate: Date;

}