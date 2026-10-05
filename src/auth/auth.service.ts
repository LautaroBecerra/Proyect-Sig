import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../users/users.repository";
import { LoginDto } from "./dto/login.dto";
import { OAuth2Client } from "google-auth-library";
import { GoogleLoginDto } from "./dto/login.google.dto";
import { User } from "../users/users.interface";

export class AuthService {

    private userRepository: UserRepository;
    private googleClient: OAuth2Client;

    constructor() {
        this.userRepository = new UserRepository();
        this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
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

                return this.generateToken(user);
    }

    async loginGoogle(data: GoogleLoginDto) {

        const ticket = await this.googleClient.verifyIdToken({
            idToken: data.credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        if (!payload) {
            throw new Error("Invalid Google credential");
        }

        const googleId = payload.sub;
        const email = payload.email;
        const username = payload.name;

        if (!googleId || !email) {
            throw new Error("Google account information is incomplete");
        }

        // 1. Buscar por Google ID
        let user = await this.userRepository.findByGoogleId(
            googleId
        );

        // 2. Si no existe, buscar por email
        if (!user) {

            user = await this.userRepository.findByEmail(
                email
            );

            // 3. Si existe por email, vincular Google
            if (user) {

                user = await this.userRepository.update(
                    user.id,
                    {
                        google_id: googleId
                    }
                );

                if (!user) {
                    throw new Error("Could not link Google account");
                }

            } else {

                // 4. Si no existe, crear usuario
                user = await this.userRepository.create({
                    username: username || email.split("@")[0],
                    email,
                    password: null,
                    google_id: googleId
                });
            }
        }

        return this.generateToken(user);
    }

    private generateToken(user: User) {

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