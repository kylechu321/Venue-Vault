import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Hirer } from "../entity/hirer";

export class HirerController {
    private hirerRepository = AppDataSource.getRepository(Hirer);

    private serializeHirer(hirer: Hirer) {
        return {
            ...hirer,
            driverLicenseDoc: hirer.driverLicenseDoc ?? "",
            insuranceDoc: hirer.insuranceDoc ?? "",
            registrationDoc: hirer.registrationDoc ?? "",
        };
    }

    async all(request: Request, response: Response) {
        const hirers = await this.hirerRepository.find();
        return response.json(hirers.map((hirer) => this.serializeHirer(hirer)));
    }

    async one(request: Request, response: Response) {
        const id = parseInt(request.params.id as string);
        const hirer = await this.hirerRepository.findOne({ where: { id } });
        if (hirer) {
            return response.json(this.serializeHirer(hirer));
        } else {
            return response.status(404).json({ message: "Hirer user not found" });
        }
    }

    async save(request: Request, response: Response) {
        const { userID, driverLicenseDoc, insuranceDoc, registrationDoc } = request.body;
        const hirer = Object.assign(new Hirer(), {
            userID,
            driverLicenseDoc: (driverLicenseDoc as string) ?? "",
            insuranceDoc: (insuranceDoc as string) ?? "",
            registrationDoc: (registrationDoc as string) ?? "",
        });
        try {
            const savedHirer = await this.hirerRepository.save(hirer);
            return response.status(201).json(this.serializeHirer(savedHirer));
        } catch (error) {
            return response
                .status(400)
                .json({ message: "Error saving hirer user", error });
        }

    }

    async remove(request: Request, response: Response) {
        const id = parseInt(request.params.id as string);
        try {
            const hirerToRemove = await this.hirerRepository.findOne({ where: { id } });

            if (!hirerToRemove) {
                return response.status(404).json({ message: "Hirer user not found" });
            }
            await this.hirerRepository.remove(hirerToRemove);
            return response.json({ message: "Hirer user removed successfully" });
        } catch (error) {
            return response
                .status(400)
                .json({ message: "Error removing hirer user", error });
        }
    }

    async update(request: Request, response: Response) {
        const id = parseInt(request.params.id as string);
        const { userID, driverLicenseDoc, insuranceDoc, registrationDoc } = request.body;
        let hirerToUpdate = await this.hirerRepository.findOne({ where: { id } });

        if (!hirerToUpdate) {
            return response.status(404).json({ message: "Hirer user not found" });
        }

        hirerToUpdate = Object.assign(hirerToUpdate, {
            userID,
            driverLicenseDoc: (driverLicenseDoc as string) ?? "",
            insuranceDoc: (insuranceDoc as string) ?? "",
            registrationDoc: (registrationDoc as string) ?? "",
        });

        try {
            const updatedHirer = await this.hirerRepository.save(hirerToUpdate);
            return response.json(this.serializeHirer(updatedHirer));
        } catch (error) {
            return response
                .status(400)
                .json({ message: "Error updating hirer user", error });
        }
    }

    async removeAll(request: Request, response: Response) {
        try {
            const deleteResult = await this.hirerRepository.clear();
            return response.json({ message: "All hirer users removed successfully", deleteResult });
        } catch (error) {
            return response
                .status(400)
                .json({ message: "Error removing all hirer users", error });
        }
    }

    async findByUserID(request: Request, response: Response) {
        const userID = parseInt(request.query.userID as string);
        if (!userID) {
            return response.status(400).json({ message: "Missing userID query parameter" });
        }

        const hirer = await this.hirerRepository
            .createQueryBuilder("hirer")
            .where("hirer.userID LIKE :userID", { userID: `%${userID}%` })
            .getOne();

        return response.json(hirer ? this.serializeHirer(hirer) : null);
    }

    async updateComplianceDocs(request: Request, response: Response) {
        const id = parseInt(request.params.id as string);
        const { driverLicenseDoc, insuranceDoc, registrationDoc } = request.body;

        let hirerToUpdate = await this.hirerRepository.findOne({ where: { id } });

        if (!hirerToUpdate) {
            return response.status(404).json({ message: "Hirer user not found" });
        }

        hirerToUpdate = Object.assign(hirerToUpdate, {
            driverLicenseDoc: (driverLicenseDoc as string) ?? "",
            insuranceDoc: (insuranceDoc as string) ?? "",
            registrationDoc: (registrationDoc as string) ?? "",
        });

        try {
            const updatedHirer = await this.hirerRepository.save(hirerToUpdate);
            return response.json(this.serializeHirer(updatedHirer));
        } catch (error) {
            return response
                .status(400)
                .json({ message: "Error updating compliance documents for hirer user", error });
        }
    }

    async getComplianceDocs(request: Request, response: Response) {
        const id = parseInt(request.params.id as string);
        const hirer = await this.hirerRepository.findOne({ where: { id } });

        if (!hirer) {
            return response.status(404).json({ message: "Hirer user not found" });
        }

        return response.json({
            driverLicenseDoc: hirer.driverLicenseDoc ?? "",
            insuranceDoc: hirer.insuranceDoc ?? "",
            registrationDoc: hirer.registrationDoc ?? "",
        });
    }


}
