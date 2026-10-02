export interface User {
    id: number;
    username: string;
    email: string;
    password: string | null;
    google_id: string | null;
    created_at: Date;
}