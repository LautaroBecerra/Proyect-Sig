import { Request, Response } from "express";

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
        req: Request,
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
        req: Request,
        res: Response
    ) => {

        try {

            const userId =
                Number(req.params.userId);

            if (isNaN(userId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid user id"
                });
            }

            const reports =
                await this.service.getReportsByUser(
                    userId
                );

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
        req: Request,
        res: Response
    ) => {

        try {

            const data: CreateFloodReport =
                req.body;

            const report =
                await this.service.createReport(data);

            return res.status(201).json({
                success: true,
                message: "Flood report created successfully",
                data: report
            });

        } catch (error: any) {

            console.error(error);

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    };

    // PUT /api/flood-reports/:id
    updateReport = async (
        req: Request,
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

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    };

    // DELETE /api/flood-reports/:id
    deleteReport = async (
        req: Request,
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