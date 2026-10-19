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

    register = async (req: Request, res: Response) => {
        try {
           
            const result = await this.service.register(req.body);

            res.status(201).json({
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

            res.status(status).json({
                success: false,
                message
            });
        }
    };

}