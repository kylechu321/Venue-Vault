import { Request, response, Response } from "express";
import { AppDataSource } from "../data-source";
import { Vendor } from "../entity/vendor";


export class VendorController {
    private vendorRepository = AppDataSource.getRepository(Vendor);

    async all(request: Request, response: Response) {
        const vendors = await this.vendorRepository.find();
        return response.json(vendors);
    }

    async one(request: Request, response: Response) {
        const id = parseInt(request.params.id as string);
        const vendor = await this.vendorRepository.findOne({ where: { id } });

        if (vendor) {
            return response.json(vendor);
        } else {
            return response.status(404).json({ message: "Vendor not found" });
        }
    }


    async save(request: Request, response: Response) {
        const { userID } = request.body;

        const vendor = Object.assign(new Vendor(), {
            userID: Number(userID)
        });

        try {
            const savedVendor = await this.vendorRepository.save(vendor);
            return response.status(201).json(savedVendor);
        } catch (error) {
            return response.status(400).json({ message: "Error saving vendor", error });
        }
    }

    async remove(request: Request, response: Response) {
        const id = parseInt(request.params.id as string);
        try {
            const vendorToRemove = await this.vendorRepository.findOne({ where: { id } });

            if (!vendorToRemove) {
                return response.status(404).json({ message: "Vendor not found" });
            }
            await this.vendorRepository.remove(vendorToRemove);
            return response.json({ message: "Vendor removed successfully" });
        } catch (error) {
            return response
            .status(400)
            .json({ message: "Error removing vendor", error });
        }
    }

    async update(request: Request, response: Response) {
        const id = parseInt(request.params.id as string);
        const { userID } = request.body;
        let vendorToUpdate = await this.vendorRepository.findOne({ where: { id } });
        
        if (!vendorToUpdate) {
            return response.status(404).json({ message: "Vendor not found" });
        }

        vendorToUpdate = Object.assign(vendorToUpdate, {
            userID: Number(userID)
        });

        try {
            const updatedVendor = await this.vendorRepository.save(vendorToUpdate);
            return response.json(updatedVendor);
        } catch (error) {
            return response
            .status(400)
            .json({ message: "Error updating vendor", error });
        }
    }

    async removeAll(request: Request, response: Response) {
        try {
            const deleteResult = await this.vendorRepository.clear();
            return response.json({ message: "All vendors removed successfully", deleteResult });
        } catch (error) {
            return response.status(400).json({ message: "Error removing all vendors", error });
        }
    }
}