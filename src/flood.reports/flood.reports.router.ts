import { Router } from "express";

import { FloodReportController } from "./flood.reports.controller";

const router = Router();

const controller =
    new FloodReportController();

// Obtener todos los reportes
router.get(
    "/",
    controller.getAllReports
);

// Obtener reportes de un usuario
// IMPORTANTE: tiene que estar antes de /:id
router.get(
    "/user/:userId",
    controller.getReportsByUser
);

// Obtener un reporte
router.get(
    "/:id",
    controller.getReportById
);

// Crear reporte
router.post(
    "/",
    controller.createReport
);

// Actualizar reporte
router.put(
    "/:id",
    controller.updateReport
);

// Eliminar reporte
router.delete(
    "/:id",
    controller.deleteReport
);

export default router;