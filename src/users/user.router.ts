import { Router } from "express";
import { UserController } from "./users.controller";
import { authMiddleware } from "../auth/auth.middleware";
import { requireAdmin } from "../auth/auth.require.middleware";

const router = Router();

const controller = new UserController();

router.get("/",authMiddleware, requireAdmin, controller.getAllUsers);

router.get("/:id", authMiddleware, controller.getUserById);

router.post("/", controller.createUser);

router.put("/:id", authMiddleware, controller.updateUser);

router.put("/:id/password", authMiddleware, controller.changePassword);

router.delete("/:id", authMiddleware, requireAdmin, controller.deleteUser);

export default router;