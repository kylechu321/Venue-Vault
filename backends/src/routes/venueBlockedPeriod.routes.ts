import { Router } from "express";
import { VenueBlockedPeriodController } from "@/controller/venueBlockedPeriodController";
import { validateDto } from "@/middlewares/validate";
import {
    CreateVenueBlockedPeriodDto,
    UpdateVenueBlockedPeriodDto } from "@/dtos/venueBlockedPeriod.dto";


const router = Router();
const venueBlockedPeriodController = new VenueBlockedPeriodController();

router.get("/venueBlockedPeriods", async (req, res) => {
    await venueBlockedPeriodController.all(req, res);
});

router.get("/venueBlockedPeriods/:id", async (req, res) => {
    await venueBlockedPeriodController.one(req, res);
});

router.post("/venueBlockedPeriods", validateDto(CreateVenueBlockedPeriodDto),
    async (req, res) => {
    await venueBlockedPeriodController.save(req, res);
});

router.delete("/venueBlockedPeriods/:id", async (req, res) => {
    await venueBlockedPeriodController.remove(req, res);
});

router.put("/venueBlockedPeriods/:id", validateDto(UpdateVenueBlockedPeriodDto),
    async (req, res) => {
    await venueBlockedPeriodController.update(req, res);
});

router.delete("/venueBlockedPeriods", async (req, res) => {
    await venueBlockedPeriodController.removeAll(req, res);
});

export default router;