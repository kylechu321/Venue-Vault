import {Router} from "express";
import {HirerController} from "@/controller/hirerController";
import { validateDto } from "@/middlewares/validate";
import { CreateHirerDto, UpdateHirerDto } from "@/dtos/hirer.dto";

const router = Router();
const hirerController = new HirerController();

router.get("/hirers", async (req, res) => {
    if (req.query.userID) {
        await hirerController.findByUserID(req, res);
    } else {
        await hirerController.all(req, res);
    }
});

router.get("/hirers/:id", async (req, res) => {
    await hirerController.one(req, res)
});

router.post("/hirers", validateDto(CreateHirerDto), async (req, res) => {
    await hirerController.save(req, res);
});

router.delete("/hirers/:id", async (req, res) => {
    await hirerController.remove(req, res)
});

router.put("/hirers/:id", validateDto(UpdateHirerDto), async (req, res) => {
    await hirerController.update(req, res);
});

router.delete("/hirers", async (req, res) => {
    await hirerController.removeAll(req, res)
});

router.put("/hirers/:id/compliance-docs", async (req, res) => {
    await hirerController.updateComplianceDocs(req, res);
});

router.get("/hirers/:id/compliance-docs", async (req, res) => {
    await hirerController.getComplianceDocs(req, res);
});

export default router;