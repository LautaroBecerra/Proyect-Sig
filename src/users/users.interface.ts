export interface User {
    id: number;
    username: string;
    email: string;
    password: string | null;
    google_id: string | null;
    role: 'user' | 'admin';
    created_at: Date;
}