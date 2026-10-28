import { Request, Response } from "express";
import { UserService } from "./users.service";
import { AuthRequest } from "../auth/auth.middleware";

export class UserController {

    private service: UserService;

    constructor() {
        this.service = new UserService();
    }

    getAllUsers = async (req: Request, res: Response) => {
        try {
            const users = await this.service.getAllUsers();

            res.json({
                success: true,
                data: users
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error
                    ? error.message
                    : "Internal server error"
            });
        }
    };

    getUserById = async (req: AuthRequest, res: Response) => {
    try {
        const id = Number(req.params.id);
        
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid user id"
            });
        }

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (req.user.role !== "admin" && req.user.id !== id) {
            return res.status(403).json({
                success: false,
                message: "You can only access your own user"
            });
        }

        const user = await this.service.getUserById(id);

        res.json({
            success: true,
            data: user
        });

    } catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "User not found"
        });
    }
};


    createUser = async (req: Request, res: Response) => {
        try {
            const user = await this.service.createUser(req.body);

            res.status(201).json({
                success: true,
                message: "User created successfully",
                data: user
            });

        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error
                    ? error.message
                    : "Error creating user"
            });
        }
    };

    updateUser = async (req: AuthRequest, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid user id"
            });
        }

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (req.user.role !== "admin" && req.user.id !== id) {
            return res.status(403).json({
                success: false,
                message: "You can only update your own user"
            });
        }

        const user = await this.service.updateUser(
            id,
            req.body
        );

        res.json({
            success: true,
            message: "User updated successfully",
            data: user
        });

    } catch (error) {
        res.status(404).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Error updating user"
        });
    }
};

    
 changePassword = async (req: AuthRequest, res: Response) => {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid user id"
                });
            }

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required"
                });
            }

            if (req.user.id !== id) {
                return res.status(403).json({
                    success: false,
                    message: "You can only change your own password"
                });
            }

            const { currentPassword, newPassword } = req.body;

            if (
                typeof currentPassword !== "string" ||
                typeof newPassword !== "string" ||
                !currentPassword ||
                !newPassword
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Current password and new password are required"
                });
            }

            await this.service.changePassword(
                id,
                currentPassword,
                newPassword
            );

            return res.json({
                success: true,
                message: "Password updated successfully"
            });
        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : "Error changing password";

            const status =
                message === "User not found" ? 404 :
                message === "Current password is incorrect" ? 400 :
                message === "The new password must contain at least 6 characters" ? 400 :
                message === "The new password must be different from the current password" ? 400 :
                message.startsWith("This account does not have a password") ? 400 :
                500;

            return res.status(status).json({
                success: false,
                message
            });
        }
    };

    deleteUser = async (req: Request, res: Response) => {
        try {
            const id = Number(req.params.id);

         if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid user id"
            });
        }

            await this.service.deleteUser(id);

            res.json({
                success: true,
                message: "User deleted successfully"
            });

        } catch (error) {
            res.status(404).json({
                success: false,
                message: error instanceof Error
                    ? error.message
                    : "Error deleting user"
            });
        }
    };
}

