import "dotenv/config";
import express from "express";
import cors from "cors";
import floodReportsRouter from "./src/flood.reports/flood.reports.router";
import userRouter from "./src/users/user.router";
import authRouter from "./src/auth/auth.router";
import { startNotificationScheduler } from "./src/notifications/notifications.scheduler";
import notificationsRouter from "./src/notifications/notifications.router";
import path from "path";
import multer from "multer";

const app = express();

app.use(cors({
    origin: "http://localhost:8100"
}));

app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/flood-reports", floodReportsRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/notifications", notificationsRouter);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(413).json({
                success: false,
                message: "La imagen supera el límite de 5 MB"
            });
        }

        if (err.code === "LIMIT_FILE_COUNT") {
            return res.status(400).json({
                success: false,
                message: "Se permite un máximo de 5 imágenes por reporte"
            });
        }

        return res.status(400).json({
            success: false,
            message: "Error al cargar las imágenes"
        });
    }

    if (err) {
        return res.status(400).json({
            success: false,
            message: err.message || "Error al procesar la solicitud"
        });
    }

    next();
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
    startNotificationScheduler();
});