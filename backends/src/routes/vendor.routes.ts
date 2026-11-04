import { Router } from "express";
import { VendorController } from "@/controller/vendorController";
import { validateDto } from "@/middlewares/validate";
import { CreateVendorDto, UpdateVendorDto } from "@/dtos/vendor.dto";

const router = Router();
const vendorController = new VendorController();

router.get("/vendors", async (req, res) => {
    await vendorController.all(req, res);
});

router.get("/vendors/:id", async (req, res) => {
    await vendorController.one(req, res);
});

router.post("/vendors", validateDto(CreateVendorDto), async (req, res) => {
    await vendorController.save(req, res);
});

router.delete("/vendors/:id", async (req, res) => {
    await vendorController.remove(req, res);
});

router.put("/vendors/:id", validateDto(UpdateVendorDto), async (req, res) => {
    await vendorController.update(req, res);
});

router.delete("/vendors", async (req, res) => {
    await vendorController.removeAll(req, res);
});

export default router;