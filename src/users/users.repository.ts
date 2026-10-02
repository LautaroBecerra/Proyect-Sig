import pool from "../config/postgresql";
import { User } from "./users.interface";
import { CreateUserDto } from "./dto/create.user.dto";
import { UpdateUserDto } from "./dto/update.user.dto";

export class UserRepository {

    async findAll(): Promise<User[]> {
        const result = await pool.query(
            `
            SELECT
                id,
                username,
                email,
                password,
                google_id,
                created_at
            FROM users
            ORDER BY id ASC
            `
        );

        return result.rows;
    }

    async findById(id: number): Promise<User | null> {
        const result = await pool.query(
            `
            SELECT
                id,
                username,
                email,
                password,
                google_id,
                created_at
            FROM users
            WHERE id = $1
            `,
            [id]
        );

        return result.rows[0] || null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const result = await pool.query(
            `
            SELECT
                id,
                username,
                email,
                password,
                google_id,
                created_at
            FROM users
            WHERE email = $1
            `,
            [email]
        );

        return result.rows[0] || null;
    }

    async findByGoogleId(google_id: string): Promise<User | null> {
        const result = await pool.query(
            `
            SELECT
                id,
                username,
                email,
                password,
                google_id,
                created_at
            FROM users
            WHERE google_id = $1
            `,
            [google_id]
        );

        return result.rows[0] || null;
    }

    async create(data: CreateUserDto): Promise<User> {
        const result = await pool.query(
            `
            INSERT INTO users (
                username,
                email,
                password,
                google_id
            )
            VALUES ($1, $2, $3, $4)
            RETURNING
                id,
                username,
                email,
                password,
                google_id,
                created_at
            `,
            [
                data.username,
                data.email,
                data.password ?? null,
                data.google_id ?? null
            ]
        );

        return result.rows[0];
    }

    async update(
        id: number,
        data: UpdateUserDto
    ): Promise<User | null> {

        const result = await pool.query(
            `
            UPDATE users
            SET
                username = COALESCE($1, username),
                email = COALESCE($2, email),
                password = COALESCE($3, password),
                google_id = COALESCE($4, google_id)
            WHERE id = $5
            RETURNING
                id,
                username,
                email,
                password,
                google_id,
                created_at
            `,
            [
                data.username ?? null,
                data.email ?? null,
                data.password ?? null,
                data.google_id ?? null,
                id
            ]
        );

        return result.rows[0] || null;
    }

    async delete(id: number): Promise<boolean> {
        const result = await pool.query(
            `
            DELETE FROM users
            WHERE id = $1
            `,
            [id]
        );

        return (result.rowCount ?? 0) > 0;
    }
}