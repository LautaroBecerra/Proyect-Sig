export interface UserResponseDto {
    id: number;
    username: string;
    email: string;
    google_id: string | null;
    created_at: Date;
}