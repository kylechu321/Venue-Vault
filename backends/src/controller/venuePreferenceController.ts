import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { VenuePreference } from "../entity/venuePreference";

export class VenuePreferenceController {
    private venuePreferenceRepository = AppDataSource.getRepository(VenuePreference);
    
    async all(request: Request, response: Response) {
        try {
            const hirerId = request.query.hirerId ? Number(request.query.hirerId) : null;
            const venuePreferences = hirerId
                ? await this.venuePreferenceRepository.find({ where: { hirerId } })
                : await this.venuePreferenceRepository.find();
            return response.json(venuePreferences);
        } catch (error) {
            console.error("Error fetching venue preferences:", error);
            return response.json([]);
        }
    }

    async one(request: Request, response: Response) {
        const id = parseInt(request.params.id as string);
        const venuePreference = await this.venuePreferenceRepository.findOne({ where: { id } });
        
        if (venuePreference) {
            return response.json(venuePreference);
        }
        else {
            return response.status(404).json({ message: "Venue preference not found" });
        }
    }

    async save(request: Request, response: Response) {
        const { venueId, hirerId, ranking } = request.body;
        const venuePreference = Object.assign(new VenuePreference(), {
            venueId: Number(venueId),
            hirerId: Number(hirerId),
            ranking: Number(ranking)
        });

        try {
            const savedVenuePreference = await this.venuePreferenceRepository.save(venuePreference);
            return response.status(201).json(savedVenuePreference);
        } catch (error) {
            return response.status(400).json({ message: "Error saving venue preference", error });
        }
    }

    async remove(request: Request, response: Response) {
        const id = parseInt(request.params.id as string);
        try {
            const venuePreferenceToRemove = await this.venuePreferenceRepository.findOne({ where: { id } });

            if (!venuePreferenceToRemove) {
                return response.status(404).json({ message: "Venue preference not found" });
            }
            await this.venuePreferenceRepository.remove(venuePreferenceToRemove);
            return response.json({ message: "Venue preference removed successfully" });
        } catch (error) {
            return response
                .status(400)
                .json({ message: "Error removing venue preference", error });
        }
    }

    async update(request: Request, response: Response) {
        const id = parseInt(request.params.id as string);
        const { venueId, hirerId, ranking } = request.body;

        try {
            const venuePreferenceToUpdate = await this.venuePreferenceRepository.findOne({ where: { id } });

            if (!venuePreferenceToUpdate) {
                return response.status(404).json({ message: "Venue preference not found" });
            }

            venuePreferenceToUpdate.venueId = Number(venueId);
            venuePreferenceToUpdate.hirerId = Number(hirerId);
            venuePreferenceToUpdate.ranking = Number(ranking);

            const updatedVenuePreference = await this.venuePreferenceRepository.save(venuePreferenceToUpdate);
            return response.json(updatedVenuePreference);
        } catch (error) {
            return response
                .status(400)
                .json({ message: "Error updating venue preference", error });
        }
    }

    async removeAllUserPreferences(request: Request, response: Response) {
        const hirerId = parseInt(request.params.hirerId as string);
        try {
            const preferencesToRemove = await this.venuePreferenceRepository.find({ where: { hirerId } });

            if (preferencesToRemove.length === 0) {
                return response.status(404).json({ message: "No venue preferences found for this user" });
            }
            await this.venuePreferenceRepository.remove(preferencesToRemove);
        } catch (error) {
            return response
                .status(400)
                .json({ message: "Error removing user's venue preferences", error });
        }
    }
}