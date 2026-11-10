import { Router } from "express";
import { NotificationController } from "./notifications.controller";
import { authMiddleware } from "../auth/auth.middleware";

const router = Router();
const controller = new NotificationController();

router.get("/", authMiddleware, controller.getNotifications);
router.patch("/:id/read", authMiddleware, controller.markAsRead);
router.delete("/", authMiddleware, controller.deleteAllNotifications);

export default router;