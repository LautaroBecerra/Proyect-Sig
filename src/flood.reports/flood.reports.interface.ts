export interface FloodReport {
    id: number;
    user_id: number;
    latitude: number;
    longitude: number;
    description: string | null;
    severity: string | null;
    created_at: Date;
}

export interface CreateFloodReport {
    user_id: number;
    latitude: number;
    longitude: number;
    description?: string;
    severity?: string;
}

export interface UpdateFloodReport {
    latitude?: number;
    longitude?: number;
    description?: string;
    severity?: string;
}