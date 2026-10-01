export interface FloodReport {
    id: number;
    user_id: number;
    latitude: number;
    longitude: number;

    description: string | null;
    severity: string | null;

    incident_type: string | null;
    water_depth_range: string | null;
    problem_persists: boolean | null;

    evacuation: string | null;
    work_affected: string | null;
    services_affected: string[] | null;
    assistance_needed: string[] | null;

    status: 'pendiente' | 'aprobado' | 'rechazado';

    created_at: Date;
}

export interface CreateFloodReport {
    user_id: number;
    latitude: number;
    longitude: number;
    description?: string | null;
    severity?: string | null;

    incident_type?: string | null;
    water_depth_range?: string | null;
    problem_persists?: boolean | null;

    evacuation?: string | null;
    work_affected?: string | null;
    services_affected?: string[] | null;
    assistance_needed?: string[] | null;
}

export interface UpdateFloodReport {
    latitude?: number;
    longitude?: number;
    description?: string | null;
    severity?: string | null;

    incident_type?: string | null;
    water_depth_range?: string | null;
    problem_persists?: boolean | null;

    evacuation?: string | null;
    work_affected?: string | null;
    services_affected?: string[] | null;
    assistance_needed?: string[] | null;

    status?: 'pendiente' | 'aprobado' | 'rechazado';
}