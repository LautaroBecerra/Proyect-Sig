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
        const user = await this.repository.update(
            id,
            data
        );

        if (!user) {
            throw new Error("User not found");
        }

        return this.toResponse(user);
    }

    async changePassword(
     id: number,
     currentPassword: string,
     newPassword: string
    ): Promise<void> {
     const user = await this.repository.findById(id);

    if (!user) {
        throw new Error("User not found");
    }

    if (!user.password) {
        throw new Error(
            "This account does not have a password. It may use Google login."
        );
    }

    const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
    );

    if (!isPasswordValid) {
        throw new Error("Current password is incorrect");
    }

    if (newPassword.length < 6) {
        throw new Error(
            "The new password must contain at least 6 characters"
        );
    }

    if (currentPassword === newPassword) {
        throw new Error(
            "The new password must be different from the current password"
        );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updated = await this.repository.updatePassword(
        id,
        hashedPassword
    );

    if (!updated) {
        throw new Error("Could not update password");
    }
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
            role: user.role,
            created_at: user.created_at
        };
    }
}