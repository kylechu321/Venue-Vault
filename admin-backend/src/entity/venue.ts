import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn
} from "typeorm";

import { Vendor } from "./vendor";

@Entity()
export class Venue {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "int" })
    vendorId: number;

    @ManyToOne(() => Vendor)
    @JoinColumn({ name: "vendorId" })
    vendor: Vendor;

    @Column( {type: "varchar", length: 50 })
    venueName: string;

    @Column( {type: "varchar", length: 255 })
    description: string;

    @Column( {type: "varchar", length: 50 })
    location: string;

    @Column({ type: "int" })
    capacity: number;

    @Column( {type: "varchar", length: 50 })
    suitability: string;

    @Column( {type: "int" })
    featured: number;
}