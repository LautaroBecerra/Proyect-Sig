import { FloodReport } from "./flood.reports.interface";

export class FloodReportModel implements FloodReport {
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

    constructor(data: FloodReport) {
        this.id = data.id;
        this.user_id = data.user_id;
        this.latitude = data.latitude;
        this.longitude = data.longitude;

        this.description = data.description;
        this.severity = data.severity;

        this.incident_type = data.incident_type;
        this.water_depth_range = data.water_depth_range;
        this.problem_persists = data.problem_persists;

        this.evacuation = data.evacuation;
        this.work_affected = data.work_affected;
        this.services_affected = data.services_affected;
        this.assistance_needed = data.assistance_needed;

        this.status = data.status;

        this.created_at = data.created_at;
    }
}