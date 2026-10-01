import "dotenv/config";
import express from "express";
import pool from "./src/config/postgresql";
import dotenv from "dotenv";
import cors from "cors";
import floodReportsRouter from "./src/flood.reports/flood.reports.router";
import userRouter from "./src/users/user.router";


const app = express();
dotenv.config();


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

app.use("/api/flood-reports", floodReportsRouter);
app.use("/api/users", userRouter);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});