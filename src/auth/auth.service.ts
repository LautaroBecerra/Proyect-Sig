import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../users/users.repository";
import { LoginDto } from "./dto/login.dto";

export class AuthService {

    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async login(data: LoginDto) {

        const user = await this.userRepository.findByEmail(
            data.email
        );

        if (!user) {
            throw new Error("Invalid email or password");
        }

        if (!user.password) {
            throw new Error("Invalid email or password");
        }

        const passwordMatch = await bcrypt.compare(
            data.password,
            user.password
        );

        if (!passwordMatch) {
            throw new Error("Invalid email or password");
        }

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error("JWT_SECRET is not configured");
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            secret,
            {
                expiresIn: "7d"
            }
        );

        return {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token
        };
    }
}