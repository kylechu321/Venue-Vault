import { AppDataSource } from "../data-source";
import { Admin } from "../entity/admin";
import { Venue } from "../entity/venue";
import { Vendor } from "../entity/vendor";
import { VenueApplication } from "../entity/venueApplication";
import { User } from "../entity/user";
import { Hirer } from "../entity/hirer";

const adminRepository = AppDataSource.getRepository(Admin);
const venueRepository = AppDataSource.getRepository(Venue);
const vendorRepository = AppDataSource.getRepository(Vendor);
const appRepository = AppDataSource.getRepository(VenueApplication);
const userRepository = AppDataSource.getRepository(User);

export const resolvers = {
  Query: {
    adminLogin: async (_: any, { username, password }: { username: string; password: string }) => {
      const admin = await adminRepository.findOne({ where: { username, password } });
      if (!admin) throw new Error("Invalid username or password");
      return { id: admin.id, username: admin.username, role: "admin" };
    },

    venues: async () => {
      return await venueRepository.find();
    },

    venue: async (_: any, { id }: { id: number }) => {
      const venue = await venueRepository.findOneBy({ id });
      if (!venue) throw new Error("Venue not found");
      return venue;
    },

    vendors: async () => {
      return await vendorRepository.find();
    },

    vendor: async (_: any, { id }: { id: number }) => {
      const vendor = await vendorRepository.findOneBy({ id });
      if (!vendor) throw new Error("Vendor not found");
      return vendor;
    },

    topPopularVenues: async () => {
      const applications = await appRepository.find({
        relations: ["venue"],
      });

      // count applications per venue
      const venueMap: Record<number, {
        venue: Venue;
        total: number;
        dayCount: Record<string, number>;
        timeCount: Record<string, number>;
      }> = {};

      for (const app of applications) {
        const vid = app.venueId;
        if (!venueMap[vid]) {
          venueMap[vid] = {
            venue: app.venue,
            total: 0,
            dayCount: {},
            timeCount: {},
          };
        }
        venueMap[vid].total += 1;

        const day = new Date(app.hireDate).toLocaleDateString("en-AU", { weekday: "long" });
        venueMap[vid].dayCount[day] = (venueMap[vid].dayCount[day] ?? 0) + 1;

        const timeSlot = `${app.startTime} (${app.hours}hr)`;
        venueMap[vid].timeCount[timeSlot] = (venueMap[vid].timeCount[timeSlot] ?? 0) + 1;
      }
      const sorted = Object.values(venueMap)
        .sort((a, b) => b.total - a.total)
        .slice(0, 3);

      return sorted.map((entry, index) => {
        const mostPopularDay = Object.entries(entry.dayCount)
          .sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N/A";
        const mostPopularTimeSlot = Object.entries(entry.timeCount)
          .sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N/A";

        return {
          rank: index + 1,
          venue: entry.venue,
          totalBookings: entry.total,
          mostPopularDay,
          mostPopularTimeSlot,
        };
      });
    },

    // return top 3 hirers
    topActiveApplicants: async () => {
      const applications = await appRepository.find();
      const hirerRepo = AppDataSource.getRepository(Hirer);
      const hirerMap: Record<number, { total: number; successful: number }> = {};

      for (const app of applications) {
        const hid = app.hirerId;
        if (!hirerMap[hid]) {
          hirerMap[hid] = { total: 0, successful: 0 };
        }
        hirerMap[hid].total += 1;
        if (app.pending === 1) hirerMap[hid].successful += 1;
      }

      const sorted = Object.entries(hirerMap)
          .sort((a, b) => b[1].total - a[1].total)
          .slice(0, 3);

      const result = [];
      for (let i = 0; i < sorted.length; i++) {
        const [hirerId, counts] = sorted[i];

        // find hirer record first then get the linked user
        const hirer = await hirerRepo.findOne({
          where: { id: Number(hirerId) },
          relations: ["user"],
        });

        if (!hirer || !hirer.user) continue;

        const successRate = counts.total > 0
            ? `${Math.round((counts.successful / counts.total) * 100)}%`
            : "0%";

        result.push({
          rank: i + 1,
          hirer: {
            id: hirer.user.id,
            firstName: hirer.user.firstName,
            lastName: hirer.user.lastName,
            email: hirer.user.email,
          },
          successfulBookings: counts.successful,
          totalApplications: counts.total,
          successRate,
        });
      }

      return result;
    },
  },

  Mutation: {
    createVenue: async (_: any, args: {
      vendorId: number;
      venueName: string;
      description: string;
      location: string;
      capacity: number;
      suitability: string;
      featured: number;
    }) => {
      const newVenue = venueRepository.create(args);
      return await venueRepository.save(newVenue);
    },

    updateVenue: async (_: any, { id, ...args }: {
      id: number;
      vendorId?: number;
      venueName?: string;
      description?: string;
      location?: string;
      capacity?: number;
      suitability?: string;
      featured?: number;
    }) => {
      const venue = await venueRepository.findOneBy({ id });
      if (!venue) throw new Error("Venue not found");
      Object.assign(venue, args);
      return await venueRepository.save(venue);
    },

    deleteVenue: async (_: any, { id }: { id: number }) => {
      const venue = await venueRepository.findOneBy({ id });
      if (!venue) throw new Error("Venue not found");
      await venueRepository.remove(venue);
      return true;
    },

    toggleFeaturedVenue: async (_: any, { id }: { id: number }) => {
      const venue = await venueRepository.findOneBy({ id });
      if (!venue) throw new Error("Venue not found");
      venue.featured = venue.featured === 1 ? 0 : 1;
      return await venueRepository.save(venue);
    },

    assignVendorToVenue: async (_: any, { venueId, vendorId }: { venueId: number; vendorId: number }) => {
      const venue = await venueRepository.findOneBy({ id: venueId });
      if (!venue) throw new Error("Venue not found");
      const vendor = await vendorRepository.findOneBy({ id: vendorId });
      if (!vendor) throw new Error("Vendor not found");
      venue.vendorId = vendorId;
      return await venueRepository.save(venue);
    },
  },
};