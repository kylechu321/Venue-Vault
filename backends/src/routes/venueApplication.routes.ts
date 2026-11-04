import { Router } from "express";
import { VenueApplicationController } from "@/controller/venueApplicationController";
import { validateDto } from "@/middlewares/validate";
import {
    CreateVenueApplicationDto,
    UpdateVenueApplicationDto,
    UpdateVenueApplicationPendingDto } from "@/dtos/venueApplication.dto";

const router = Router();
const venueApplicationController = new VenueApplicationController();

router.get("/venueApplications", async (req, res) => {
    const venueId = req.query.venueId;

    if (venueId !== undefined) {
        await venueApplicationController.getByVenueId(req, res);
        return;
    }

    await venueApplicationController.all(req, res);
});

router.get("/venueApplications/:id",
    async (req, res) => {
    await venueApplicationController.one(req, res);
});

router.post("/venueApplications", validateDto(CreateVenueApplicationDto),
    async (req, res) => {
    await venueApplicationController.save(req, res);
});

router.delete("/venueApplications/:id",
    async (req, res) => {
    await venueApplicationController.remove(req, res);
});

router.put("/venueApplications/:id", validateDto(UpdateVenueApplicationDto),
    async (req, res) => {
    await venueApplicationController.update(req, res);
});

router.put("/venueApplications/:id/pending", validateDto(UpdateVenueApplicationPendingDto),
    async (req, res) => {
    await venueApplicationController.updatePendingStatus(req, res);
});

router.delete("/venueApplications",
    async (req, res) => {
    await venueApplicationController.removeAll(req, res);
});

export default router;