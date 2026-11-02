import pool from "../config/postgresql";

import {FloodReport,CreateFloodReport,UpdateFloodReport, ConfirmFloodReport} from "./flood.reports.interface";

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

    // Obtener reportes aprobados para el mapa público
    async findApproved(): Promise<FloodReport[]> {
        const result = await pool.query(
            `
            SELECT
                fr.id,
                fr.user_id,
                u.username,
                fr.latitude,
                fr.longitude,
                fr.description,
                fr.severity,
                fr.incident_type,
                fr.water_depth_range,
                fr.problem_persists,
                fr.evacuation,
                fr.work_affected,
                fr.services_affected,
                fr.assistance_needed,
                fr.status,
                fr.created_at
            FROM flood_reports fr
            LEFT JOIN users u ON u.id = fr.user_id
            WHERE fr.status = 'aprobado'
            AND fr.problem_persists = true
            ORDER BY fr.created_at DESC
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
    async create(userId: number,data: CreateFloodReport): Promise<FloodReport> {

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
                userId,
                data.latitude,
                data.longitude,
                data.description ?? null,
                data.severity ?? null,
                data.incident_type ?? null,
                data.water_depth_range ?? null,
                data.problem_persists ?? true,
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
                evacuation = COALESCE($7, evacuation),
                work_affected = COALESCE($8, work_affected),
                services_affected = COALESCE($9, services_affected),
                assistance_needed = COALESCE($10, assistance_needed)
            WHERE id = $11
            RETURNING *
            `,
            [
                data.latitude ?? null,
                data.longitude ?? null,
                data.description ?? null,
                data.severity ?? null,
                data.incident_type ?? null,
                data.water_depth_range ?? null,
                data.evacuation ?? null,
                data.work_affected ?? null,
                data.services_affected ?? null,
                data.assistance_needed ?? null,
                id
            ]
        );

        return result.rows[0] || null;
    }

    // Actualizar estado del reporte (solo admin)
    async updateStatus(id: number, status: "aprobado" | "rechazado"): Promise<FloodReport | null> {
        const result = await pool.query(
            `
            UPDATE flood_reports
            SET status = $1
                next_confirmation_at = CASE
                 WHEN $1 = 'aprobado' AND problem_persists = true
                    THEN NOW() + INTERVAL '3 days'
                ELSE NULL
                END
            WHERE id = $2
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
            [status, id]
        );

        return result.rows[0] || null;
    }
    
    async confirmReport(reportId: number, userId: number, data: ConfirmFloodReport): Promise<FloodReport | null> {
       const client = await pool.connect();
        try {
            await client.query("BEGIN");

            // Actualizar el estado de continuidad del reporte
            const reportResult = await client.query(`
                UPDATE flood_reports
                SET problem_persists = $1,
                    problem_persists_updated_at = NOW(),
                    next_confirmation_at = CASE
                        WHEN $1 = true
                            THEN NOW() + INTERVAL '3 days'
                        ELSE NULL
                    END
                WHERE id = $2
                AND user_id = $3
                AND status = 'aprobado'
                RETURNING *
            `, [
                data.problem_persists,
                reportId,
                userId
            ]);

            if (reportResult.rowCount === 0) {
                await client.query("ROLLBACK");
                return null;
            }

            // Si la respuesta proviene de una notificación,
            // marcarla como respondida.
            if (data.notification_id !== undefined) {
                const notificationResult = await client.query(`
                    UPDATE notifications
                    SET responded_at = NOW(),
                        is_read = true
                    WHERE id = $1
                    AND flood_report_id = $2
                    AND user_id = $3
                    AND responded_at IS NULL
                `, [
                    data.notification_id,
                    reportId,
                    userId
                ]);

                if (notificationResult.rowCount === 0) {
                    throw new Error("Notification not found or already answered");
                }
            }

            // Guardar el historial de la respuesta
            await client.query(`
                INSERT INTO flood_report_updates (
                    flood_report_id,
                    user_id,
                    notification_id,
                    problem_persists,
                    source
                )
                VALUES ($1, $2, $3, $4, $5)
            `, [
                reportId,
                userId,
                data.notification_id ?? null,
                data.problem_persists,
                data.notification_id !== undefined
                    ? "notification"
                    : "manual"
            ]);

            await client.query("COMMIT");

            return reportResult.rows[0];

        } catch (error) {
            await client.query("ROLLBACK");
            throw error;

        } finally {
            client.release();
        }
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