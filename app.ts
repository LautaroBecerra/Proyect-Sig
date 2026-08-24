import express from "express";
import dotenv from "dotenv";

import floodReportsRouter from "./src/flood.reports/flood,reports.router";
import pool from "./src/config/postgresql";

dotenv.config();

const app = express();

// Permite recibir JSON en las peticiones
app.use(express.json());

// Endpoint de prueba para usuarios
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

// Rutas de flood reports
app.use(
    "/flood-reports",
    floodReportsRouter
);

app.listen(3000, () => {

    console.log("Server running on port 3000");

});