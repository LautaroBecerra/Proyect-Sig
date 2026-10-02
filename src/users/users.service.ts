import bcrypt from "bcrypt";
import { UserRepository } from "./users.repository";
import { CreateUserDto } from "./dto/create.user.dto";
import { UpdateUserDto } from "./dto/update.user.dto";
import { UserResponseDto } from "./dto/response.user.dto";
import { User } from "./users.interface";

export class UserService {

    private repository: UserRepository;

    constructor() {
        this.repository = new UserRepository();
    }

    async getAllUsers() {
        const users = await this.repository.findAll();

        return users.map(user => this.toResponse(user));
    }

    async getUserById(id: number) {
        const user = await this.repository.findById(id);

        if (!user) {
            throw new Error("User not found");
        }

        return this.toResponse(user);
    }

    async createUser(data: CreateUserDto) {

        if (!data.username) {
            throw new Error("username is required");
        }

        if (!data.email) {
            throw new Error("email is required");
        }

        if (!data.password && !data.google_id) {
            throw new Error(
                "password or google_id is required"
            );
        }

        const existingUser = await this.repository.findByEmail(
            data.email
        );

        if (existingUser) {
            throw new Error("Email already registered");
        }

        let hashedPassword: string | null = null;

        if (data.password) {
            hashedPassword = await bcrypt.hash(
                data.password,
                10
            );
        }

        const userData: CreateUserDto = {
            ...data,
            password: hashedPassword
        };

        const user = await this.repository.create(userData);

        return this.toResponse(user);
    }

    async updateUser(
        id: number,
        data: UpdateUserDto
    ) {
        let userData = data;

        if (data.password) {
            const hashedPassword = await bcrypt.hash(
                data.password,
                10
            );

            userData = {
                ...data,
                password: hashedPassword
            };
        }

        const user = await this.repository.update(
            id,
            userData
        );

        if (!user) {
            throw new Error("User not found");
        }

        return this.toResponse(user);
    }

    async deleteUser(id: number) {
        const deleted = await this.repository.delete(id);

        if (!deleted) {
            throw new Error("User not found");
        }

        return true;
    }

    private toResponse(user: User): UserResponseDto {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            google_id: user.google_id,
            created_at: user.created_at
        };
    }
}