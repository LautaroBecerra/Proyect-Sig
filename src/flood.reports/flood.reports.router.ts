import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware";
import { requireAdmin } from "../auth/auth.require.middleware";
import { FloodReportController } from "./flood.reports.controller";

const router = Router();

const controller =
    new FloodReportController();

// Obtener todos los reportes
router.get(
    "/",
    authMiddleware,
    requireAdmin,
    controller.getAllReports
);

// Obtener reportes de un usuario
// IMPORTANTE: tiene que estar antes de /:id
router.get(
    "/user/:userId",
    authMiddleware,
    controller.getReportsByUser
);

// Obtener un reporte
router.get(
    "/:id",
    authMiddleware,
    controller.getReportById
);

// Crear reporte
router.post(
    "/",
    authMiddleware,
    controller.createReport
);

// Actualizar reporte
router.put(
    "/:id",
    authMiddleware,
    controller.updateReport
);

// Actualizar estado del reporte (solo admin)
router.patch(
    "/:id/status",
    authMiddleware,
    requireAdmin,
    controller.updateReportStatus
);

// Eliminar reporte
router.delete(
    "/:id",
    authMiddleware,
    controller.deleteReport
);

export default router;