import { AppError } from "../utils/AppError";

export const validIncidentTypes = [
    "Calle con agua",
    "Calle cortada",
    "Calle erosionada o socavada",
    "Agua dentro de viviendas",
    "Boca de tormenta obstruida",
    "Canal o zanja desbordada"
];

export const validWaterDepthRanges = [
    "0 a 5 cm",
    "5 a 20 cm",
    "20 a 50 cm",
    "50 cm a 1 m",
    "Más de 1 m"
];

export const validEvacuationOptions = [
    "Sí, nos autoevacuamos.",
    "Sí, fuimos evacuados por bomberos, defensa civil u otro organismo.",
    "No"
];

export const validWorkAffectedOptions = [
    "No pude realizar mi actividad laboral propia.",
    "No pude llegar a mi lugar de trabajo.",
    "Se produjeron pérdidas económicas.",
    "No"
];

export const validServices = [
    "Sin energía eléctrica.",
    "Sin agua potable.",
    "Desborde cloacal."
];

export const validAssistance = [
    "Limpieza y desinfección.",
    "Colchones o ropa de cama.",
    "Alimentos.",
    "Atención médica."
];

export function validateIncidentType(
    incidentType: string | null | undefined
) {
    if (
        incidentType &&
        !validIncidentTypes.includes(incidentType)
    ) {
        throw new AppError(
            "Invalid incident_type",
            400
        );
    }
}

export function validateWaterDepthRange(
    waterDepthRange: string | null | undefined
) {
    if (
        waterDepthRange &&
        !validWaterDepthRanges.includes(waterDepthRange)
    ) {
        throw new AppError(
            "Invalid water_depth_range",
            400
        );
    }
}

export function validateProblemPersists(
    problemPersists: boolean | null | undefined
) {
    if (
        problemPersists !== undefined &&
        problemPersists !== null &&
        typeof problemPersists !== "boolean"
    ) {
        throw new AppError(
            "problem_persists must be a boolean",
            400
        );
    }
}

export function validateEvacuation(
    evacuation: string | null | undefined
) {
    if (
        evacuation &&
        !validEvacuationOptions.includes(evacuation)
    ) {
        throw new AppError(
            "Invalid evacuation option",
            400
        );
    }
}

export function validateWorkAffected(
    workAffected: string | null | undefined
) {
    if (
        workAffected &&
        !validWorkAffectedOptions.includes(workAffected)
    ) {
        throw new AppError(
            "Invalid work_affected option",
            400
        );
    }
}

export function validateServicesAffected(
    servicesAffected: string[] | null | undefined
) {
    if (!servicesAffected) {
        return;
    }

    if (!Array.isArray(servicesAffected)) {
        throw new AppError(
            "services_affected must be an array",
            400
        );
    }

    const invalidService = servicesAffected.find(
        service => !validServices.includes(service)
    );

    if (invalidService) {
        throw new AppError(
            "Invalid services_affected option",
            400
        );
    }
}

export function validateAssistanceNeeded(
    assistanceNeeded: string[] | null | undefined
) {
    if (!assistanceNeeded) {
        return;
    }

    if (!Array.isArray(assistanceNeeded)) {
        throw new AppError(
            "assistance_needed must be an array",
            400
        );
    }

    const invalidAssistance = assistanceNeeded.find(
        assistance => !validAssistance.includes(assistance)
    );

    if (invalidAssistance) {
        throw new AppError(
            "Invalid assistance_needed option",
            400
        );
    }
}

export function validateLatitude(
    latitude: number | null | undefined
) {
    if (
        latitude !== undefined &&
        latitude !== null &&
        typeof latitude !== "number"
    ) {
        throw new AppError(
            "Invalid latitude",
            400
        );
    }

    if (
        latitude !== undefined &&
        latitude !== null &&
        (latitude < -90 || latitude > 90)
    ) {
        throw new AppError(
            "Invalid latitude",
            400
        );
    }
}

export function validateLongitude(
    longitude: number | null | undefined
) {
    if (
        longitude !== undefined &&
        longitude !== null &&
        typeof longitude !== "number"
    ) {
        throw new AppError(
            "Invalid longitude",
            400
        );
    }

    if (
        longitude !== undefined &&
        longitude !== null &&
        (longitude < -180 || longitude > 180)
    ) {
        throw new AppError(
            "Invalid longitude",
            400
        );
    }
}

export function validateDescription(
    description: string | null | undefined
) {
    if (
        description !== undefined &&
        description !== null &&
        typeof description !== "string"
    ) {
        throw new AppError(
            "Description must be a string",
            400
        );
    }
}

export function validateSeverity(
    severity: string | null | undefined
) {
    if (
        severity !== undefined &&
        severity !== null &&
        typeof severity !== "string"
    ) {
        throw new AppError(
            "Severity must be a string",
            400
        );
    }
}
