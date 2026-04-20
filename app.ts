import express from "express";
import pool from "./src/db";
import "dotenv/config";

const app = express();

app.get("/test", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json(result.rows);
});

app.listen(3000, () => {
  console.log("Server running");
});
