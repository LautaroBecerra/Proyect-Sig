import { AppError } from "../utils/AppError";
import {CreateFloodReport, UpdateFloodReport, ConfirmFloodReport} from "./flood.reports.interface";
import { FloodReportRepository } from "./flood.reports.repository";
import {validateIncidentType, validateWaterDepthRange, validateProblemPersists, validateEvacuation, validateWorkAffected, validateServicesAffected, validateAssistanceNeeded, validateLatitude, validateLongitude, validateDescription, validateSeverity} from "./flood.reports.validation";
import fs from "fs/promises";
import path from "path";

export class FloodReportService {

    private repository: FloodReportRepository;

    constructor() {
        this.repository = new FloodReportRepository();
    }

    // Obtener todos
    async getAllReports() {
        const reports = await this.repository.findAll();
        return Promise.all(
            reports.map(report => this.attachImages(report))
        );
    }

    // Obtener por ID
   async getReportById(id: number) {
    const report = await this.repository.findById(id);
    if (!report) {
        throw new AppError("Flood report not found", 404);
    }
        return this.attachImages(report);
    }

  async getApprovedReports() {
    const reports = await this.repository.findApproved();
        return Promise.all(
            reports.map(report => this.attachImages(report))
     );
    }
    // Obtener por usuario
    async getReportsByUser(userId: number) {
    const reports = await this.repository.findByUserId(userId);
        return Promise.all(
            reports.map(report => this.attachImages(report))
        );
    }
    // Crear
    async createReport(userId: number, data: CreateFloodReport, files: Express.Multer.File[] = []) {
            if (!userId) {
                throw new AppError("Usuario no autenticado", 401);
            }

            if (data.latitude === undefined) {
                throw new AppError("La latitud es obligatoria", 400);
            }

            if (data.longitude === undefined) {
                throw new AppError("La longitud es obligatoria", 400);
            }

            validateLatitude(data.latitude);
            validateLongitude(data.longitude);
            validateDescription(data.description);
            validateSeverity(data.severity);
            validateIncidentType(data.incident_type);
            validateWaterDepthRange(data.water_depth_range);
            validateProblemPersists(data.problem_persists);
            validateEvacuation(data.evacuation);
            validateWorkAffected(data.work_affected);
            validateServicesAffected(data.services_affected);
            validateAssistanceNeeded(data.assistance_needed);

            const images = files.map(file => ({
                file_name: file.filename,
                storage_path: `uploads/flood-reports/${file.filename}`,
                mime_type: file.mimetype,
                size_bytes: file.size
            }));
           const report = await this.repository.createWithImages(
                userId,
                data,
                images
            );
            return await this.attachImages(report);
        }
    // Actualizar
    async updateReport(id: number, data: UpdateFloodReport) {
        if (data.latitude !== undefined) {
            validateLatitude(data.latitude);
        }

        if (data.longitude !== undefined) {
            validateLongitude(data.longitude);
        }

        if (data.description !== undefined) {
            validateDescription(data.description);
        }

        if (data.severity !== undefined) {
            validateSeverity(data.severity);
        }

        if (data.incident_type !== undefined) {
            validateIncidentType(data.incident_type);
        }

        if (data.water_depth_range !== undefined) {
            validateWaterDepthRange(data.water_depth_range);
        }

        if (data.evacuation !== undefined) {
            validateEvacuation(data.evacuation);
        }

        if (data.work_affected !== undefined) {
            validateWorkAffected(data.work_affected);
        }

        if (data.services_affected !== undefined) {
            validateServicesAffected(data.services_affected);
        }

        if (data.assistance_needed !== undefined) {
            validateAssistanceNeeded(data.assistance_needed);
        }

        const report = await this.repository.update(
            id,
            data
        );

        if (!report) {
            throw new AppError("Flood report not found", 404);
        }

        return report;
    }

    // Actualizar estado del reporte (solo admin)
    async updateReportStatus(
        id: number,
        status: "aprobado" | "rechazado"
    ) {

        const report = await this.repository.updateStatus(
            id,
            status
        );

        if (!report) {
            throw new AppError("Flood report not found", 404);
        }

        return report;
    }

    async confirmReport(
        reportId: number,
        userId: number,
        data: ConfirmFloodReport
    ) {
        if (!userId) {
            throw new AppError("Authentication required", 401);
        }

        if (typeof data.problem_persists !== "boolean") {
            throw new AppError("problem_persists must be a boolean", 400);
        }

        const report = await this.repository.confirmReport(
            reportId,
            userId,
            data
        );

        if (!report) {
            throw new AppError(
                "Report not found, not approved or does not belong to user",
                404
            );
        }

        return report;
    }
    async getImagesByReportId(reportId: number) {
         return await this.repository.findImagesByReportId(reportId);
    }
    private async attachImages(report: any) {
        const images = await this.repository.findImagesByReportId(report.id);
        return {
            ...report,
            images
        };
    }
    // Eliminar
    async deleteReport(id: number) {
        // 1. Recuperar las imágenes antes de eliminar el reporte.
        const images = await this.repository.findImagesByReportId(id);
        // 2. Eliminar el reporte de PostgreSQL.
        const deleted = await this.repository.delete(id);
        if (!deleted) {
            throw new AppError("Flood report not found", 404);
        }
        // 3. Eliminar todos los archivos físicos.
        for (const image of images) {
            const imagePath = path.resolve(
                process.cwd(),
                image.storage_path
            );
            try {
                console.log("DIRECTORIO ACTUAL:", process.cwd());
                console.log("RUTA DE IMAGEN:", imagePath);

                await fs.unlink(imagePath);
                console.log("IMAGEN ELIMINADA:", image.file_name);
            } catch (error: any) {
             console.error(
                    "ERROR AL ELIMINAR IMAGEN:",
                    image.file_name,
                    imagePath,
                    error
                );
            }
     }
    // 4. Devolver resultado después de procesar todas las imágenes.
     return true;
    }
}