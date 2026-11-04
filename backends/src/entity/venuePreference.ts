import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn
} from "typeorm";

import { Venue } from "./venue";
import { Hirer } from "./hirer";

@Entity("venuePreference")
export class VenuePreference {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column({ type: "int" })
    venueId: number;
    @ManyToOne(() => Venue)
    @JoinColumn({ name: "venueId" })
    venue: Venue;
    
    @Column({ type: "int" })
    hirerId: number;
    @ManyToOne(() => Hirer)
    @JoinColumn({ name: "hirerId" })
    hirer: Hirer;

    @Column({ type: "int" })
    ranking: number;
}