import pool from "../config/postgresql";

import {FloodReport, CreateFloodReport, UpdateFloodReport} from "./flood.reports.interface";

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
                severity
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING
                id,
                user_id,
                latitude,
                longitude,
                description,
                severity,
                created_at
            `,
            [
                data.user_id,
                data.latitude,
                data.longitude,
                data.description ?? null,
                data.severity ?? null
            ]
        );

        return result.rows[0];
    }

    // Actualizar reporte
    async update(id: number, data: UpdateFloodReport): Promise<FloodReport | null> {

        const result = await pool.query(
            `
            UPDATE flood_reports
            SET
                latitude = COALESCE($1, latitude),
                longitude = COALESCE($2, longitude),
                description = COALESCE($3, description),
                severity = COALESCE($4, severity)
            WHERE id = $5
            RETURNING
                id,
                user_id,
                latitude,
                longitude,
                description,
                severity,
                created_at
            `,
            [
                data.latitude ?? null,
                data.longitude ?? null,
                data.description ?? null,
                data.severity ?? null,
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