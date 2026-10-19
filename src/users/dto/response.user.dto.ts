export interface UserResponseDto {
    id: number;
    username: string;
    email: string;
    google_id: string | null;
    role: 'user' | 'admin';
    created_at: Date;
}