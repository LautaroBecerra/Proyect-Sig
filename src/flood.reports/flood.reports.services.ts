import { AppError } from "../utils/AppError";
import {CreateFloodReport, UpdateFloodReport} from "./flood.reports.interface";
import { FloodReportRepository } from "./flood.reports.repository";
import {validateIncidentType, validateWaterDepthRange, validateProblemPersists, validateEvacuation, validateWorkAffected, validateServicesAffected, validateAssistanceNeeded, validateLatitude, validateLongitude, validateDescription, validateSeverity} from "./flood.reports.validation";


export class FloodReportService {

    private repository: FloodReportRepository;

    constructor() {
        this.repository = new FloodReportRepository();
    }

    // Obtener todos
    async getAllReports() {

        return await this.repository.findAll();
    }

    // Obtener por ID
    async getReportById(id: number) {

        const report = await this.repository.findById(id);

        if (!report) {
            throw new AppError("Flood report not found", 404);
        }

        return report;
    }

    async getApprovedReports() {
         return await this.repository.findApproved();
    }

    // Obtener por usuario
    async getReportsByUser(userId: number) {

        return await this.repository.findByUserId(userId);
    }

    // Crear
    async createReport(
        userId: number,
        data: CreateFloodReport
    ) {

        if (!userId) {
            throw new AppError("User authentication required", 401);
        }

        if (data.latitude === undefined) {
            throw new AppError("latitude is required", 400);
        }

        if (data.longitude === undefined) {
            throw new AppError("longitude is required", 400);
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

        return await this.repository.create(userId, data);
    }
    // Actualizar
async updateReport(
    id: number,
    data: UpdateFloodReport
) {
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

    if (data.problem_persists !== undefined) {
        validateProblemPersists(data.problem_persists);
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

    // Eliminar
    async deleteReport(id: number) {

        const deleted =
            await this.repository.delete(id);

        if (!deleted) {
            throw new AppError("Flood report not found", 404);
        }

        return true;
    }
}