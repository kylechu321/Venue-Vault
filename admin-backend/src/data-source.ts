import "reflect-metadata";
import { DataSource } from "typeorm";
import {Admin} from "./entity/admin";
import { User } from "./entity/user";
import { Vendor } from "./entity/vendor";
import { Venue } from "./entity/venue";
import {VenueApplication} from "./entity/venueApplication";
import {Hirer} from "./entity/hirer";



export const AppDataSource = new DataSource({
  type: "mssql",
  host: "dipto-database.cn2ems8y2mfe.ap-southeast-2.rds.amazonaws.com",
  username: "s4094103",
  password: "DizIzFSD@2!",
  database: "s4094103",
      options: {
        encrypt: false, // Use this for Azure SQL Database
        //trustedConnection: false // Use this for Windows Authentication (if applicable)
    },
  // synchronize: true will automatically create database tables based on entity definitions
  // and update them when entity definitions change. This is useful during development
  // but should be disabled in production to prevent accidental data loss.
  synchronize: false, 
  logging: true, // Enable logging for debugging purposes
  entities: [Admin, Vendor, Venue, VenueApplication, User, Hirer],
  migrations: [],
  subscribers: [],
});