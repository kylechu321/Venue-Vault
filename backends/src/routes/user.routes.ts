import { Router } from "express";
import { UserController } from "@/controller/userController";
import { validateDto } from "@/middlewares/validate";
import { CreateUserDto, UpdateUserDto } from "@/dtos/user.dto";

const router = Router();
const userController = new UserController();

router.post("/users/login", async (req, res) => {
    await userController.login(req, res); });

router.get("/users", async (req, res) => {
    await userController.all(req, res);
});

router.get("/users/:id", async (req, res) => {
    await userController.one(req, res);
});

router.post("/users", validateDto(CreateUserDto), async (req, res) => {
    await userController.save(req, res);
});

router.put("/users/:id", validateDto(UpdateUserDto), async (req, res) => {
    await userController.update(req, res);
});

router.delete("/users/:id", async (req, res) => {
    await userController.remove(req, res);
});

export default router;