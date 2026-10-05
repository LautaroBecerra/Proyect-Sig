import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: "user" | "admin";
    };
}

export const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Token required"
            });
        }

        const [type, token] = authHeader.split(" ");

        if (type !== "Bearer" || !token) {
            return res.status(401).json({
                success: false,
                message: "Invalid authorization format"
            });
        }

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            return res.status(500).json({
                success: false,
                message: "JWT_SECRET is not configured"
            });
        }

        const decoded = jwt.verify(token, secret) as jwt.JwtPayload;

        if (typeof decoded.id !== "number" || typeof decoded.email !== "string" ||(decoded.role !== "user" && decoded.role !== "admin")) {
            return res.status(401).json({
                success: false,
                message: "Invalid token payload"
            });
        }

        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        };

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};