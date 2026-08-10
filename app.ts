import express from "express";
import pool from "./src/config/postgresql";
import dotenv from "dotenv";


const app = express();
dotenv.config();

app.get("/users", async (req, res) => {
  const result = await pool.query("SELECT * FROM users");
  res.json(result.rows);
});

app.listen(3000, () => {
  console.log("Server running");
});
