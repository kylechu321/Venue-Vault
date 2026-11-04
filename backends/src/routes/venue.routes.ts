import { Router } from "express";
import { VenueController } from "@/controller/venueController";
import { validateDto } from "@/middlewares/validate";
import { CreateVenueDto, UpdateVenueDto } from "@/dtos/venue.dto";

const router = Router();
const venueController = new VenueController();

router.get("/venues", async (req, res) => {
    await venueController.all(req, res);
});

router.get("/venues/featured", async (req, res) => {
    await venueController.allFeatured(req, res);
});

router.get("/venues/vendor/:vendorId", async (req, res) => {
    await venueController.getVenueByVendorId(req, res);
});

router.get("/venues/:id", async (req, res) => {
    await venueController.one(req, res);
});

router.post("/venues", validateDto(CreateVenueDto), async (req, res) => {
    await venueController.save(req, res);
});

router.delete("/venues/:id", async (req, res) => {
    await venueController.remove(req, res);
});

router.put("/venues/:id", validateDto(UpdateVenueDto), async (req, res) => {
    await venueController.update(req, res);
});

router.delete("/venues", async (req, res) => {
    await venueController.removeAll(req, res);
});

export default router;