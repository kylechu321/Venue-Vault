import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { Hirer } from "@/entity/hirer";
import { VenueApplication } from "@/entity/venueApplication";
import { VenueHirerStat } from "@/entity/venueHirerStats";

export class VenueHirerStatsController {
    async getHirerStats(req: Request, res: Response) {
        try {
            const hirerRepo = AppDataSource.getRepository(Hirer);
            const appRepo = AppDataSource.getRepository(VenueApplication);

            const hirers = await hirerRepo.find({ relations: ["user"] });

            const stats = await Promise.all(
                hirers.map(async (hirer) => {
                    const totalCount = await appRepo.count({
                        where: { hirerId: hirer.id },
                    });
                    const approvalCount = await appRepo.count({
                        where: { hirerId: hirer.id, pending: 1 },
                    });

                    return {
                        id: hirer.id,
                        hirerId: hirer.id,
                        firstNameOfHirer: hirer.user.firstName,
                        lastNameOfHirer: hirer.user.lastName,
                        ratingOfTheHirer: hirer.user.rating ?? 0,
                        approvalCount,
                        totalCount,
                    };
                })
            );

            res.status(200).json(stats);
        } catch (error) {
            console.error("Error fetching hirer stats:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    // Grabs stats for the hirers
    async getHirerChartStats(req: Request, res: Response) {
        try {
            const hirerRepo = AppDataSource.getRepository(Hirer);
            const appRepo = AppDataSource.getRepository(VenueApplication);

            const hirers = await hirerRepo.find({ relations: ["user"] });

            const chartData = await Promise.all(
                hirers.map(async (hirer) => {
                    const applications = await appRepo.find({
                        where: { hirerId: hirer.id },
                        relations: ["venue"],
                    });

                    const venueMap: Record<string, { venueName: string; approved: number; total: number }> = {};
                    for (const app of applications) {
                        const key = String(app.venueId);
                        if (!venueMap[key]) {
                            venueMap[key] = {
                                venueName: app.venue.venueName,
                                approved: 0,
                                total: 0,
                            };
                        }
                        venueMap[key].total += 1;
                        if (app.pending === 1) venueMap[key].approved += 1;
                    }

                    // Returns stats
                    return {
                        hirerId: hirer.id,
                        hirerName: `${hirer.user.firstName} ${hirer.user.lastName}`,
                        venueBreakdown: Object.values(venueMap),
                        totalApproved: applications.filter((a) => a.pending === 1).length,
                        totalPending: applications.filter((a) => a.pending === 0).length,
                        totalCount: applications.length,
                    };
                })
            );

            res.status(200).json(chartData);
        } catch (error) {
            console.error("Error fetching hirer chart stats:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async getHirerRatings(req: Request, res: Response) {
        try {
            const hirerId = parseInt(Array.isArray(req.params.hirerId) ? req.params.hirerId[0] : req.params.hirerId, 10);
            const repo = AppDataSource.getRepository(Hirer);
            const hirer = await repo.findOne({ where: { id: hirerId } });
            const hirerStats = await AppDataSource.getRepository(VenueHirerStat).findOne({ where: { hirerId } });

            if (!hirer) {
                return res.status(404).json({ message: "Hirer not found" });
            }

            if (!hirerStats) {
                return res.status(404).json({ message: "Hirer stats not found" });
            }

            res.status(200).json({ averageRating: hirerStats.ratingOfTheHirer });
        } catch (error) {
            console.error("Error fetching hirer ratings:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}