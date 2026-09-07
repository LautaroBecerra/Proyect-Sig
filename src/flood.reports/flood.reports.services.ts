import {CreateFloodReport, UpdateFloodReport} from "./flood.reports.interface";

import { FloodReportRepository } from "./flood.reports.repository";

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
            throw new Error("Flood report not found");
        }

        return report;
    }

    // Obtener por usuario
    async getReportsByUser(userId: number) {

        return await this.repository.findByUserId(userId);
    }

    // Crear
    async createReport(
        data: CreateFloodReport
    ) {

        if (!data.user_id) {
            throw new Error("user_id is required");
        }

        if (data.latitude === undefined) {
            throw new Error("latitude is required");
        }

        if (data.longitude === undefined) {
            throw new Error("longitude is required");
        }

        if (
            data.latitude < -90 ||
            data.latitude > 90
        ) {
            throw new Error("Invalid latitude");
        }

        if (
            data.longitude < -180 ||
            data.longitude > 180
        ) {
            throw new Error("Invalid longitude");
        }

        return await this.repository.create(data);
    }

    // Actualizar
    async updateReport(
        id: number,
        data: UpdateFloodReport
    ) {

        const report = await this.repository.update(
            id,
            data
        );

        if (!report) {
            throw new Error("Flood report not found");
        }

        return report;
    }

    // Eliminar
    async deleteReport(id: number) {

        const deleted =
            await this.repository.delete(id);

        if (!deleted) {
            throw new Error("Flood report not found");
        }

        return true;
    }
}