import dotenv from "dotenv";
import { Pool } from "pg";
import fs from "fs";
import path from "path";

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT || 5432),
});

const migrationsDir = path.join(__dirname, "migrations");

const migrate = async (): Promise<void> => {
    const client = await pool.connect();

    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS schema_migrations (
                id SERIAL PRIMARY KEY,
                filename VARCHAR(255) NOT NULL UNIQUE,
                executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
        `);

        const files = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith(".sql"))
            .sort();

        for (const file of files) {
            const result = await client.query(
                `SELECT 1 FROM schema_migrations WHERE filename = $1`,
                [file]
            );

            if (result.rowCount && result.rowCount > 0) {
                console.log(`Already executed: ${file}`);
                continue;
            }

            console.log(`Executing: ${file}`);

            const sql = fs.readFileSync(
                path.join(migrationsDir, file),
                "utf8"
            );

            await client.query("BEGIN");

            try {
                await client.query(sql);

                await client.query(
                    `INSERT INTO schema_migrations (filename) VALUES ($1)`,
                    [file]
                );

                await client.query("COMMIT");

                console.log(`Completed: ${file}`);
            } catch (error) {
                await client.query("ROLLBACK");
                throw error;
            }
        }

        console.log("Migrations completed.");
    } finally {
        client.release();
    }
};

migrate()
    .catch(error => {
        console.error("Migration error:", error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await pool.end();
    });
