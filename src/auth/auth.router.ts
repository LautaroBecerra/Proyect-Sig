import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authMiddleware, AuthRequest } from "./auth.middleware";

const router = Router();

const controller = new AuthController();

router.post("/login", controller.login);

router.post("/login/google", controller.loginGoogle);

router.get(
    "/me",
    authMiddleware,
    (req: AuthRequest, res) => {
        res.json({
            success: true,
            message: "Authenticated user",
            user: req.user
        });
    }
);

export default router;