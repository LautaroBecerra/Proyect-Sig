import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../users/users.repository";
import { LoginDto } from "./dto/login.dto";
import { UserService } from "../users/users.service";
import { CreateUserDto } from "../users/dto/create.user.dto";
import { OAuth2Client } from "google-auth-library";

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

    
    async loginGoogle(credential: string) {
    if (!credential) {
        throw new Error("Google credential is required");
    }

    const googleClientId = process.env.GOOGLE_CLIENT_ID;

    if (!googleClientId) {
        throw new Error("GOOGLE_CLIENT_ID is not configured");
    }

    const googleClient = new OAuth2Client(googleClientId);

    // 1. Validar la credencial de Google.
    const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: googleClientId
    });

    const payload = ticket.getPayload();

    if (
        !payload ||
        !payload.sub ||
        !payload.email ||
        payload.email_verified !== true
    ) {
        throw new Error("Invalid Google account");
    }

    const googleId = payload.sub;
    const email = payload.email.toLowerCase();

    // 2. Buscar al usuario por su ID de Google.
    let user = await this.userRepository.findByGoogleId(
        googleId
    );

    // 3. Si no existe, comprobar si el email ya está registrado.
    if (!user) {
        const existingUser =
            await this.userRepository.findByEmail(email);

        if (existingUser) {
            throw new Error(
                "This email is already registered. " +
                "Sign in with your password first."
            );
        }

        // 4. Crear el usuario nuevo en PostgreSQL.
        const username =
            payload.name?.trim() || email.split("@")[0];

        user = await this.userRepository.create({
            username,
            email,
            google_id: googleId
        });
    }

    // 5. Generar el JWT de Hidromemoria.
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

    // 6. Devolver los datos del usuario y el token.
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