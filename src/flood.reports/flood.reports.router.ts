import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware";
import { requireAdmin } from "../auth/auth.require.middleware";
import { FloodReportController } from "./flood.reports.controller";
import { uploadFloodReportImages } from "../middleware/upload.middleware";

const router = Router();

const controller =
    new FloodReportController();

// Obtener todos los reportes
router.get("/", authMiddleware, requireAdmin, controller.getAllReports);

router.get("/public", (req, res, next) => {
    console.log("ENTRÓ A LA RUTA PÚBLICA");
    next();
  },
  controller.getApprovedReports
);

// Obtener reportes de un usuario
// IMPORTANTE: tiene que estar antes de /:id
router.get("/user/:userId", authMiddleware, controller.getReportsByUser);

// Obtener un reporte
router.get("/:id", authMiddleware, controller.getReportById);

// Crear reporte
router.post("/", authMiddleware, uploadFloodReportImages, controller.createReport);

// Actualizar reporte
router.put("/:id", authMiddleware, controller.updateReport);

// Actualizar estado del reporte (solo admin)
router.patch(
    "/:id/status",
    authMiddleware,
    requireAdmin,
    controller.updateReportStatus
);

// Confirmar si el problema continúa
router.patch(
    "/:id/confirm",
    authMiddleware,
    controller.confirmReport
);

// Eliminar reporte
router.delete(
    "/:id",
    authMiddleware,
    controller.deleteReport
);

export default router;