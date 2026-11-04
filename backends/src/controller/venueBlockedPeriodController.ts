import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { VenueBlockedPeriod } from "../entity/venueBlockedPeriod";

const parseDate = (value: unknown) => new Date(value as string);

export class VenueBlockedPeriodController {
    private venueBlockedPeriodRepository = AppDataSource.getRepository(VenueBlockedPeriod);

    async all(request: Request, response: Response) {
        const venueBlockedPeriods = await this.venueBlockedPeriodRepository.find();
        return response.json(venueBlockedPeriods);
    }

    async one(request: Request, response: Response) {
        const id = parseInt(request.params.id as string);
        const venueBlockedPeriod = await this.venueBlockedPeriodRepository.findOne({ where: { id } });

        if (venueBlockedPeriod) {
            return response.json(venueBlockedPeriod);
        } else {
            return response.status(404).json({ message: "Venue blocked period not found" });
        }
    }

    async save(request: Request, response: Response) {
        const { venueId, startDate, endDate } = request.body;
                const venueBlockedPeriod = Object.assign(new VenueBlockedPeriod(), {
                    venueId: Number(venueId),
                    startDate: parseDate(startDate),
                    endDate: parseDate(endDate)
                });
        
                try {
                    const savedVenueBlockedPeriod = await this.venueBlockedPeriodRepository.save(venueBlockedPeriod);
                    return response.status(201).json(savedVenueBlockedPeriod);
                } catch (error) {
                    return response.status(400).json({ message: "Error saving blocked period", error });
                };
    }

    async remove(request: Request, response: Response) {
        const id = parseInt(request.params.id as string);
        try {
            const venueBlockedPeriodToRemove = await this.venueBlockedPeriodRepository.findOne({ where: { id } });

            if (!venueBlockedPeriodToRemove) {
                return response.status(404).json({ message: "Venue blocked period not found" });
            }
            await this.venueBlockedPeriodRepository.remove(venueBlockedPeriodToRemove);
            return response.json({ message: "Venue blocked period removed successfully" });
        } catch (error) {
            return response
            .status(400)
            .json({ message: "Error removing venue blocked period", error });
        }
    }

    async update(request: Request, response: Response) {
        const id = parseInt(request.params.id as string);
        const { venueId, startDate, endDate } = request.body;
        let venueBlockedPeriodToUpdate = await this.venueBlockedPeriodRepository.findOne({ where: { id } });
        
        if (!venueBlockedPeriodToUpdate) {
            return response.status(404).json({ message: "Venue blocked period not found" });
        }

        venueBlockedPeriodToUpdate = Object.assign(venueBlockedPeriodToUpdate, {
            venueId: Number(venueId),
            startDate: parseDate(startDate),
            endDate: parseDate(endDate)
        });

        try {
            const updatedVenueBlockedPeriod = await this.venueBlockedPeriodRepository.save(venueBlockedPeriodToUpdate);
            return response.json(updatedVenueBlockedPeriod);
        } catch (error) {
            return response
            .status(400)
            .json({ message: "Error updating venue blocked period", error });
        }
    }

    async removeAll(request: Request, response: Response) {
        try {
            const deleteResult = await this.venueBlockedPeriodRepository.clear();
            return response.json({ message: "All blocked periods removed successfully", deleteResult });
        } catch (error) {
            return response.status(400).json({ message: "Error removing all blocked periods", error });
        }
    }
}