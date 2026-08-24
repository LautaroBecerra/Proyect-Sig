import {FloodReport, CreateFloodReport, UpdateFloodReport} from "./flood.reports.interface";

export class FloodReportModel implements FloodReport {
    id: number;
    user_id: number;
    latitude: number;
    longitude: number;
    description: string | null;
    severity: string | null;
    created_at: Date;

    constructor(data: FloodReport) {
        this.id = data.id;
        this.user_id = data.user_id;
        this.latitude = data.latitude;
        this.longitude = data.longitude;
        this.description = data.description;
        this.severity = data.severity;
        this.created_at = data.created_at;
    }
}