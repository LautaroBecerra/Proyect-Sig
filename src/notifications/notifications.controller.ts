import { Request, Response } from "express";
import { NotificationRepository } from "./notifications.repository";
import { AuthRequest } from "../auth/auth.middleware";

export class NotificationController {
    private repository: NotificationRepository;

    constructor() {
        this.repository = new NotificationRepository();
    }

    getNotifications = async (req: AuthRequest, res: Response) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    message: "Authentication required"
                });
            }

            const notifications = await this.repository.findByUserId(
                req.user.id
            );

            return res.status(200).json({
                message: "Notifications retrieved successfully",
                data: notifications
            });
        } catch (error) {
            console.error("Error retrieving notifications:", error);

            return res.status(500).json({
                message: "Error retrieving notifications"
            });
        }
    };

    markAsRead = async (req: AuthRequest, res: Response) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    message: "Authentication required"
                });
            }

            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    message: "Invalid notification ID"
                });
            }

            const updated = await this.repository.markAsRead(
                id,
                req.user.id
            );

            if (!updated) {
                return res.status(404).json({
                    message: "Notification not found"
                });
            }

            return res.status(200).json({
                message: "Notification marked as read"
            });
        } catch (error) {
            console.error("Error marking notification as read:", error);

            return res.status(500).json({
                message: "Error marking notification as read"
            });
        }
    };

    deleteAllNotifications = async (req: AuthRequest, res: Response) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    message: "Authentication required"
                });
            }

            const deletedCount = await this.repository.deleteAllByUserId(
                req.user.id
            );

            return res.status(200).json({
                message: "Notification history deleted successfully",
                data: {
                    deletedCount
                }
            });

        } catch (error) {
            console.error("Error deleting notifications:", error);

            return res.status(500).json({
                message: "Error deleting notification history"
            });
        }
    };
}