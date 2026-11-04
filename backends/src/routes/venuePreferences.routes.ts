import { Router } from "express";
import { VenuePreferenceController } from "@/controller/venuePreferenceController";
import { validateDto } from "@/middlewares/validate";
import {
    CreateVenuePreferenceDto,
    UpdateVenuePreferenceDto } from "@/dtos/venuePreference.dto";

const router = Router();
const venuePreferenceController = new VenuePreferenceController();

router.get("/venuePreferences", async (req, res) => {
    await venuePreferenceController.all(req, res);
});

router.get("/venuePreferences/:id", async (req, res) => {
    await venuePreferenceController.one(req, res);
});

router.post("/venuePreferences", validateDto(CreateVenuePreferenceDto),
    async (req, res) => {
    await venuePreferenceController.save(req, res);
});

router.delete("/venuePreferences/:id", async (req, res) => {
    await venuePreferenceController.remove(req, res);
});

router.put("/venuePreferences/:id", validateDto(UpdateVenuePreferenceDto),
    async (req, res) => {
    await venuePreferenceController.update(req, res);
});

export default router;