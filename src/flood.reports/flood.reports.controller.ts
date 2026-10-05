import { Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { AuthRequest } from "../auth/auth.middleware";
import {CreateFloodReport, UpdateFloodReport} from "./flood.reports.interface";
import { FloodReportService } from "./flood.reports.services";

export class FloodReportController {

    private service: FloodReportService;

    constructor() {
        this.service = new FloodReportService();
    }

    // GET /api/flood-reports
    getAllReports = async (
        req: Request,
        res: Response
    ) => {

        try {

            const reports =
                await this.service.getAllReports();

            return res.status(200).json({
                success: true,
                data: reports
            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                success: false,
                message: "Error getting flood reports"
            });
        }
    };

    // GET /api/flood-reports/:id
    getReportById = async (
        req: AuthRequest,
        res: Response
    ) => {

        try {

            const id = Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid report id"
                });
            }

            const report =
                await this.service.getReportById(id);


            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }

            if (
                req.user.role !== "admin" &&
                report.user_id !== req.user.id
            ) {
                return res.status(403).json({
                    success: false,
                    message: "You can only access your own reports"
                });
            }



            return res.status(200).json({
                success: true,
                data: report
            });

        } catch (error: any) {

            if (
                error.message ===
                "Flood report not found"
            ) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            console.error(error);

            return res.status(500).json({
                success: false,
                message: "Error getting flood report"
            });
        }
    };

    // GET /api/flood-reports/user/:userId
    getReportsByUser = async (
        req: AuthRequest,
        res: Response
    ) => {

        try {

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }

            const userId = Number(req.params.userId);
            console.log("USER ID FROM PARAM:", userId);

            if (isNaN(userId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid user id"
                });
            }

            if (req.user.role !== "admin" && req.user.id !== userId) {
                return res.status(403).json({
                    success: false,
                    message: "You can only access your own reports"
                });
            }

            const reports =
                await this.service.getReportsByUser(userId);

            console.log("REPORTS FOUND:", reports);

            return res.status(200).json({
                success: true,
                data: reports
            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                success: false,
                message: "Error getting user reports"
            });
        }
    };

    // POST /api/flood-reports
    createReport = async (
        req: AuthRequest,
        res: Response
    ) => {

        try {

            if(!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }

            const data: CreateFloodReport =
                req.body;

            const report =
                await this.service.createReport(req.user.id, data);

            return res.status(201).json({
                success: true,
                message: "Flood report created successfully",
                data: report
            });

        } catch (error: any) {

        console.error(error);

        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
    };

    // PUT /api/flood-reports/:id
    updateReport = async (
        req: AuthRequest,
        res: Response
    ) => {

        try {

            const id = Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid report id"
                });
            }

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }

            const existingReport = await this.service.getReportById(id);

            if (req.user.role !== "admin" && existingReport.user_id !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: "You can only modify your own reports"
                });
            }

            const data: UpdateFloodReport =
                req.body;

            const report =
                await this.service.updateReport(
                    id,
                    data
                );

            return res.status(200).json({
                success: true,
                message: "Flood report updated successfully",
                data: report
            });

        } catch (error: any) {

            if (
                error.message ===
                "Flood report not found"
            ) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            console.error(error);

           if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
}
    };

    // PATCH /api/flood-reports/:id/status
    updateReportStatus = async (
        req: AuthRequest,
        res: Response
    ) => {

        try {

            const id = Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid report id"
                });
            }

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }

            const { status } = req.body;

            if (
                status !== "aprobado" &&
                status !== "rechazado"
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid status. Use 'aprobado' or 'rechazado'"
                });
            }

            const report =
                await this.service.updateReportStatus(
                    id,
                    status
                );

            return res.status(200).json({
                success: true,
                message: "Flood report status updated successfully",
                data: report
            });

        } catch (error: any) {

            if (
                error.message ===
                "Flood report not found"
            ) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            console.error(error);

            return res.status(500).json({
                success: false,
                message: "Error updating flood report status"
            });
        }
    };
    
    
    // DELETE /api/flood-reports/:id
    deleteReport = async (
        req: AuthRequest,
        res: Response
    ) => {

        try {

            const id = Number(req.params.id);

            if (isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid report id"
                });
            }

             if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

            const existingReport =
                await this.service.getReportById(id);

                if (req.user.role !== "admin" && existingReport.user_id !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: "You can only delete your own reports"
                });
            }

            await this.service.deleteReport(id);

            return res.status(200).json({
                success: true,
                message: "Flood report deleted successfully"
            });

        } catch (error: any) {

            if (
                error.message ===
                "Flood report not found"
            ) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            console.error(error);

            return res.status(500).json({
                success: false,
                message: "Error deleting flood report"
            });
        }
    };
}