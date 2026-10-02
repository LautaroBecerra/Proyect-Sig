export interface UpdateUserDto {
    username?: string;
    email?: string;
    password?: string | null;
    google_id?: string | null;
}