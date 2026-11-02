import "dotenv/config";
import express from "express";
import cors from "cors";
import floodReportsRouter from "./src/flood.reports/flood.reports.router";
import userRouter from "./src/users/user.router";
import authRouter from "./src/auth/auth.router";
import { startNotificationScheduler } from "./src/notifications/notifications.scheduler";
import notificationsRouter from "./src/notifications/notifications.router";

const app = express();

app.use(cors({
    origin: "http://localhost:8100"
}));

app.use(express.json());

app.use("/api/flood-reports", floodReportsRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/notifications", notificationsRouter);

app.listen(3000, () => {
    console.log("Server running on port 3000");
    startNotificationScheduler();
});