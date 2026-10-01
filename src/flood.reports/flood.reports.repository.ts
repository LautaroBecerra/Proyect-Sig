import pool from "../config/postgresql";

import {FloodReport,CreateFloodReport,UpdateFloodReport} from "./flood.reports.interface";

export class FloodReportRepository {

    // Obtener todos los reportes
    async findAll(): Promise<FloodReport[]> {

        const result = await pool.query(
            `
            SELECT
                id,
                user_id,
                latitude,
                longitude,
                description,
                severity,
                incident_type,
                water_depth_range,
                problem_persists,
                evacuation,
                work_affected,
                services_affected,
                assistance_needed,
                status,
                created_at
            FROM flood_reports
            ORDER BY created_at DESC
            `
        );

        return result.rows;
    }

    // Obtener un reporte por ID
    async findById(id: number): Promise<FloodReport | null> {

        const result = await pool.query(
            `
            SELECT
                id,
                user_id,
                latitude,
                longitude,
                description,
                severity,
                incident_type,
                water_depth_range,
                problem_persists,
                evacuation,
                work_affected,
                services_affected,
                assistance_needed,
                status,
                created_at
            FROM flood_reports
            WHERE id = $1
            `,
            [id]
        );

        return result.rows[0] || null;
    }

    // Obtener reportes de un usuario
    async findByUserId(userId: number): Promise<FloodReport[]> {

        const result = await pool.query(
            `
            SELECT
                id,
                user_id,
                latitude,
                longitude,
                description,
                severity,
                incident_type,
                water_depth_range,
                problem_persists,
                evacuation,
                work_affected,
                services_affected,
                assistance_needed,
                status,
                created_at
            FROM flood_reports
            WHERE user_id = $1
            ORDER BY created_at DESC
            `,
            [userId]
        );

        return result.rows;
    }

    // Crear reporte
    async create(data: CreateFloodReport): Promise<FloodReport> {

        const result = await pool.query(
            `
            INSERT INTO flood_reports(
                user_id,
                latitude,
                longitude,
                description,
                severity,
                incident_type,
                water_depth_range,
                problem_persists,
                evacuation,
                work_affected,
                services_affected,
                assistance_needed
            )
            VALUES (
                $1, $2, $3, $4, $5,
                $6, $7, $8, $9, $10, $11, $12
            )
            RETURNING
                id,
                user_id,
                latitude,
                longitude,
                description,
                severity,
                incident_type,
                water_depth_range,
                problem_persists,
                evacuation,
                work_affected,
                services_affected,
                assistance_needed,
                status,
                created_at
            `,
            [
                data.user_id,
                data.latitude,
                data.longitude,
                data.description ?? null,
                data.severity ?? null,
                data.incident_type ?? null,
                data.water_depth_range ?? null,
                data.problem_persists ?? null,
                data.evacuation ?? null,
                data.work_affected ?? null,
                data.services_affected ?? null,
                data.assistance_needed ?? null
            ]
        );

        return result.rows[0];
    }

    // Actualizar reporte
    async update(
        id: number,
        data: UpdateFloodReport
    ): Promise<FloodReport | null> {

        const result = await pool.query(
            `
            UPDATE flood_reports
            SET
                latitude = COALESCE($1, latitude),
                longitude = COALESCE($2, longitude),
                description = COALESCE($3, description),
                severity = COALESCE($4, severity),
                incident_type = COALESCE($5, incident_type),
                water_depth_range = COALESCE($6, water_depth_range),
                problem_persists = COALESCE($7, problem_persists),
                evacuation = COALESCE($8, evacuation),
                work_affected = COALESCE($9, work_affected),
                services_affected = COALESCE($10, services_affected),
                assistance_needed = COALESCE($11, assistance_needed)
            WHERE id = $12
            RETURNING
                id,
                user_id,
                latitude,
                longitude,
                description,
                severity,
                incident_type,
                water_depth_range,
                problem_persists,
                evacuation,
                work_affected,
                services_affected,
                assistance_needed,
                status,
                created_at
            `,
            [
                data.latitude ?? null,
                data.longitude ?? null,
                data.description ?? null,
                data.severity ?? null,
                data.incident_type ?? null,
                data.water_depth_range ?? null,
                data.problem_persists ?? null,
                data.evacuation ?? null,
                data.work_affected ?? null,
                data.services_affected ?? null,
                data.assistance_needed ?? null,
                id
            ]
        );

        return result.rows[0] || null;
    }

    // Eliminar reporte
    async delete(id: number): Promise<boolean> {

        const result = await pool.query(
            `
            DELETE FROM flood_reports
            WHERE id = $1
            `,
            [id]
        );

        return (result.rowCount ?? 0) > 0;
    }
}