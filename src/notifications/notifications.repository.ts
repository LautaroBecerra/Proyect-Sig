import pool from "../config/postgresql";

export class NotificationRepository {

    async createPendingConfirmations(): Promise<number> {
        const dbInfo = await pool.query(`
    SELECT
        current_database() AS database,
        current_schema() AS schema,
        current_user AS user,
        inet_server_addr() AS server,
        inet_server_port() AS port,
        to_regclass('public.notifications') AS notifications_table
`);

console.log("DATABASE INFO:", dbInfo.rows[0]);

        const result = await pool.query(`
            INSERT INTO notifications (
                user_id,
                flood_report_id,
                type,
                title,
                message
            )
            SELECT
                fr.user_id,
                fr.id,
                'flood_confirmation',
                '¿La inundación continúa?',
                'Queremos saber si el problema informado sigue presente. Actualizá el estado de tu reporte.'
            FROM flood_reports fr
            WHERE fr.status = 'aprobado'
              AND fr.problem_persists = true
              AND fr.next_confirmation_at <= NOW()
            ON CONFLICT (flood_report_id, type)
            WHERE responded_at IS NULL
            DO NOTHING
            RETURNING id
        `);

        return result.rowCount ?? 0;
    }


    async findByUserId(userId: number) {
        const result = await pool.query(`
            SELECT
                n.id,
                n.user_id,
                n.flood_report_id,
                n.type,
                n.title,
                n.message,
                n.is_read,
                n.created_at,
                n.responded_at,

                fr.description AS report_description,
                fr.latitude AS report_latitude,
                fr.longitude AS report_longitude,
                fr.incident_type AS report_incident_type

            FROM notifications n
            INNER JOIN flood_reports fr
                ON fr.id = n.flood_report_id

            WHERE n.user_id = $1
              AND n.deleted_at IS NULL
            ORDER BY n.created_at DESC
            LIMIT 50
        `, [userId]);

        return result.rows;
    }

    async markAsRead(id: number, userId: number): Promise<boolean> {
        const result = await pool.query(`
            UPDATE notifications
            SET is_read = true
            WHERE id = $1
            AND user_id = $2
             RETURNING id
         `, [id, userId]);

        return (result.rowCount ?? 0) > 0;
    }

   async deleteAllByUserId(userId: number): Promise<number> {
        const result = await pool.query(`
            UPDATE notifications
            SET deleted_at = NOW()
            WHERE user_id = $1
            AND deleted_at IS NULL
            RETURNING id
        `, [userId]);

        return result.rowCount ?? 0;
    }
}