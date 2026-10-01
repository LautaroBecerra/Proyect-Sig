import { User } from "./users.interface";

export class UserModel implements User {
    id: number;
    username: string;
    email: string;
    password: string;
    created_at: Date;

    constructor(data: User) {
        this.id = data.id;
        this.username = data.username;
        this.email = data.email;
        this.password = data.password;
        this.created_at = data.created_at;
    }
}