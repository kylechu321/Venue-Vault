import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { VenueApplication } from "@/entity/venueApplication";
import { Hirer } from "@/entity/hirer";
import { VenueHirerStat } from "@/entity/venueHirerStats";

const parseDate = (value: string) => {
    return new Date(value);
};

export class VenueApplicationController {
    private venueApplicationRepository = AppDataSource.getRepository(VenueApplication);

    async all(request: Request, response: Response) {
        try {
            const venueApplications = await this.venueApplicationRepository.find();
            return response.json(venueApplications);
        } catch (error) {
            console.error("Error fetching venue applications:", error);
            return response.status(500).json({ message: "Internal server error fetching venue applications" });
        }
    }

    async one(request: Request, response: Response) {
        try {
            const id = parseInt(request.params.id as string);
            const venueApplication = await this.venueApplicationRepository.findOne({ where: { id } });

            if (venueApplication) {
                return response.json(venueApplication);
            } else {
                return response.status(404).json({ message: "Venue application not found" });
            }
        } catch (error) {
            console.error(`Error fetching venue application id=${request.params.id}:`, error);
            return response.status(500).json({ message: "Internal server error fetching venue application" });
        }
    }

    async save(request: Request, response: Response) {
        const { venueId, hirerId, eventName, guestNum, hireDate, startTime, hours, comment } = request.body;
        const venueApplication = Object.assign(new VenueApplication(), {
            venueId: Number(venueId),
            hirerId: Number(hirerId),
            eventName,
            guestNum: Number(guestNum),
            hireDate: parseDate(hireDate),
            startTime,
            hours: Number(hours),
            comment,
        });

        try {
            const savedVenueApplication = await this.venueApplicationRepository.save(venueApplication);
            await this.syncHirerStats(savedVenueApplication.hirerId);
            return response.status(201).json(savedVenueApplication);
        } catch (error) {
            return response.status(400).json({ message: "Error saving venue application", error });
        }
    }

    async remove(request: Request, response: Response) {
        const id = parseInt(request.params.id as string);
        try {
            const venueApplicationToRemove = await this.venueApplicationRepository.findOne({ where: { id } });

            if (!venueApplicationToRemove) {
                return response.status(404).json({ message: "Venue application not found" });
            }
            await this.venueApplicationRepository.remove(venueApplicationToRemove);
            return response.json({ message: "Venue application removed successfully" });
        } catch (error) {
            return response.status(400).json({ message: "Error removing venue application", error });
        }
    }

    async update(request: Request, response: Response) {
        const id = parseInt(request.params.id as string);
        const { venueId, hirerId, eventName, guestNum, hireDate, startTime, hours, comment, pending } = request.body;
        let venueApplicationToUpdate = await this.venueApplicationRepository.findOne({ where: { id } });

        if (!venueApplicationToUpdate) {
            return response.status(404).json({ message: "Venue application not found" });
        }

        venueApplicationToUpdate = Object.assign(venueApplicationToUpdate, {
            venueId: Number(venueId),
            hirerId: Number(hirerId),
            eventName,
            guestNum: Number(guestNum),
            hireDate: parseDate(hireDate),
            startTime,
            hours: Number(hours),
            comment,
            pending: Number(pending),
        });

        try {
            const updatedVenueApplication = await this.venueApplicationRepository.save(venueApplicationToUpdate);
            await this.syncHirerStats(updatedVenueApplication.hirerId);
            return response.json(updatedVenueApplication);
        } catch (error) {
            return response.status(400).json({ message: "Error updating venue application", error });
        }
    }

    async removeAll(request: Request, response: Response) {
        try {
            const deleteResult = await this.venueApplicationRepository.clear();
            return response.json({ message: "All venue applications removed successfully", deleteResult });
        } catch (error) {
            return response.status(400).json({ message: "Error removing all venue applications", error });
        }
    }

    async getByVenueId(request: Request, response: Response) {
        const venueId = parseInt(request.query.venueId as string);
        try {
            const venueApplications = await this.venueApplicationRepository.find({ where: { venueId } });
            return response.json(venueApplications);
        } catch (error) {
            console.error(`Error fetching venue applications for venueId=${venueId}:`, error);
            return response.status(500).json({ message: "Internal server error fetching venue applications by venue ID" });
        }
    }

    async updatePendingStatus(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id as string);
            const { pending, comment } = req.body;

            let app = await this.venueApplicationRepository.findOne({ where: { id } });
            if (!app) return res.status(404).json({ message: "Application not found" });

            app.pending = pending;
            if (comment !== undefined) app.comment = comment;
            await this.venueApplicationRepository.save(app);

            await this.syncHirerStats(app.hirerId);

            return res.json(app);
        } catch (error) {
            return res.status(500).json({ message: "Internal server error", error });
        }
    }

    private async syncHirerStats(hirerId: number) {
        const appRepo = AppDataSource.getRepository(VenueApplication);
        const hirerRepo = AppDataSource.getRepository(Hirer);
        const statsRepo = AppDataSource.getRepository(VenueHirerStat);

        const hirer = await hirerRepo.findOne({
            where: { id: hirerId },
            relations: ["user"],
        });
        if (!hirer) return;

        const totalCount = await appRepo.count({ where: { hirerId } });
        const approvalCount = await appRepo.count({ where: { hirerId, pending: 1 } });

        let stat = await statsRepo.findOne({ where: { hirerId } });
        if (!stat) {
            stat = new VenueHirerStat();
            stat.hirerId = hirerId;
        }

        stat.firstNameOfHirer = hirer.user.firstName;
        stat.lastNameOfHirer = hirer.user.lastName;
        stat.ratingOfTheHirer = hirer.user.rating ?? 0;
        stat.approvalCount = approvalCount;
        stat.totalCount = totalCount;

        await statsRepo.save(stat);
    }
}