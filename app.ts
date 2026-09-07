import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import floodReportsRouter from "./src/flood.reports/flood.reports.router";
import pool from "./src/config/postgresql";

dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:8100"
}));

app.use(express.json());

app.get("/users", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM users"
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error getting users"
        });
    }
});

app.use(
    "/api/flood-reports",
    floodReportsRouter
);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});