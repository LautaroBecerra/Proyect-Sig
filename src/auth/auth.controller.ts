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

            res.json({
                success: true,
                message: "Login successful",
                data: result
            });

        } catch (error) {

            res.status(401).json({
                success: false,
                message: error instanceof Error
                    ? error.message
                    : "Invalid email or password"
            });

        }
    };

        loginGoogle = async (req: Request, res: Response) => {
        try {

            const result = await this.service.loginGoogle(req.body);

            res.json({
                success: true,
                message: "Google login successful",
                data: result
            });

        } catch (error) {

            res.status(401).json({
                success: false,
                message: error instanceof Error
                    ? error.message
                    : "Invalid Google credential"
            });

        }
    };
}