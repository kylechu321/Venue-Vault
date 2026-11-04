import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Venue } from "../entity/venue";

export class VenueController {
    private venueRepository = AppDataSource.getRepository(Venue);

    async all(request: Request, response: Response) {
        const venues = await this.venueRepository.find();
        return response.json(venues);
    }

    async getVenueByVendorId(request: Request, response: Response) {
        const vendorIdRaw = request.params.vendorId ?? request.query.vendorId;
        const vendorId = Number(vendorIdRaw);

        if (vendorIdRaw === undefined || Number.isNaN(vendorId)) {
            return response.status(400).json({ message: "Invalid vendorId parameter" });
        }

        const venues = await this.venueRepository.find({ where: { vendorId } });
        return response.json(venues);
    }

    async allFeatured(request: Request, response: Response) {
        const venues = await this.venueRepository.find({ where: { featured: 1 } });
        return response.json(venues);
    }

    async one(request: Request, response: Response) {
        const id = parseInt(request.params.id as string);
        const venue = await this.venueRepository.findOne({ where: { id } });

        if (venue) {
            return response.json(venue);
        } else {
            return response.status(404).json({ message: "Venue not found" });
        }
    }

    async save(request: Request, response: Response) {
        const { vendorId, venueName, description, location, capacity, suitability, featured } = request.body;

        const venue = Object.assign(new Venue(), {
            vendorId: Number(vendorId),
            venueName,
            description,
            location,
            capacity: Number(capacity),
            suitability,
            featured: Number(featured)
        });

        try {
            const savedVenue = await this.venueRepository.save(venue);
            return response.status(201).json(savedVenue);
        } catch (error) {
            return response.status(400).json({ message: "Error saving venue", error });
        }
    }

    async remove(request: Request, response: Response) {
        const id = parseInt(request.params.id as string);
        try {
            const venueToRemove = await this.venueRepository.findOne({ where: { id } });

            if (!venueToRemove) {
                return response.status(404).json({ message: "Venue not found" });
            }
            await this.venueRepository.remove(venueToRemove);
            return response.json({ message: "Venue removed successfully" });
        } catch (error) {
            return response
                .status(400)
                .json({ message: "Error removing venue", error });
        }
    }

    async update(request: Request, response: Response) {
        const id = parseInt(request.params.id as string);
        const { vendorId, venueName, description, location, capacity, suitability, featured } = request.body;
        let venueToUpdate = await this.venueRepository.findOne({ where: { id } });

        if (!venueToUpdate) {
            return response.status(404).json({ message: "Venue not found" });
        }

        venueToUpdate = Object.assign(venueToUpdate, {
            vendorId: Number(vendorId),
            venueName,
            description,
            location,
            capacity: Number(capacity),
            suitability,
            featured: Number(featured)
        });

        try {
            const updatedVenue = await this.venueRepository.save(venueToUpdate);
            return response.json(updatedVenue);
        } catch (error) {
            return response
                .status(400)
                .json({ message: "Error updating venue", error });
        }
    }

    async removeAll(request: Request, response: Response) {
        try {
            const deleteResult = await this.venueRepository.clear();
            return response.json({ message: "All venues removed successfully", deleteResult });
        } catch (error) {
            return response.status(400).json({ message: "Error removing all venues", error });
        }
    }
}