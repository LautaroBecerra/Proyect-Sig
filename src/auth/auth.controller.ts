import { Request, Response } from "express";
import { AuthService } from "./auth.service";
export class AuthController {

    private service: AuthService;

    constructor() {
        this.service = new AuthService();
    }

    login = async (req: Request, res: Response) => {
        try {
            const result = await this.service.login(req.body);

            return res.json({
                success: true,
                message: "Login successful",
                data: result
            });

        } catch (error) {
            return res.status(401).json({
                success: false,
                message: error instanceof Error
                    ? error.message
                    : "Invalid email or password"
            });
        }
    };

    register = async (req: Request, res: Response) => {
        try {
            const result = await this.service.register(req.body);

            return res.status(201).json({
                success: true,
                message: "Registration successful",
                data: result
            });

        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : "Registration failed";

            const status = message === "Email already registered"
                ? 409
                : 400;

            return res.status(status).json({
                success: false,
                message
            });
        }
    };

    loginGoogle = async (req: Request, res: Response) => {
        try {
            const { credential } = req.body;

            if (
                typeof credential !== "string" ||
                !credential.trim()
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Google credential is required"
                });
            }

            const result = await this.service.loginGoogle(
                credential
            );

            return res.status(200).json({
                success: true,
                message: "Google login successful",
                data: result
            });

        } catch (error) {
            console.error("Google login error:", error);

            return res.status(401).json({
                success: false,
                message: error instanceof Error
                    ? error.message
                    : "Google login failed"
            });
        }
    };
}