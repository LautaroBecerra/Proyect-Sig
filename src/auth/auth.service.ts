import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../users/users.repository";
import { LoginDto } from "./dto/login.dto";
import { UserService } from "../users/users.service";
import { CreateUserDto } from "../users/dto/create.user.dto";

export class AuthService {

    private userRepository: UserRepository;
    private userService: UserService;

    constructor() {
        this.userRepository = new UserRepository();
        this.userService = new UserService();
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

    async register(data: CreateUserDto) {
    if (!data.username?.trim()) {
        throw new Error("Username is required");
    }

    if (!data.email?.trim()) {
        throw new Error("Email is required");
    }

    if (!data.password || data.password.length < 8) {
        throw new Error("Password must be at least 8 characters");
    }

    const user = await this.userService.createUser({
        username: data.username.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password
    });

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