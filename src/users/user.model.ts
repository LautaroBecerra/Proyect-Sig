import { User } from "./users.interface";

export class UserModel implements User {
    id: number;
    username: string;
    email: string;
    password: string | null;
    google_id: string | null;
    created_at: Date;

    constructor(data: User) {
        this.id = data.id;
        this.username = data.username;
        this.email = data.email;
        this.password = data.password;
        this.google_id = data.google_id;
        this.created_at = data.created_at;
    }
}