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
        throw new Error("Invalid incident_type");
    }
}

export function validateWaterDepthRange(
    waterDepthRange: string | null | undefined
) {
    if (
        waterDepthRange &&
        !validWaterDepthRanges.includes(waterDepthRange)
    ) {
        throw new Error("Invalid water_depth_range");
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
        throw new Error("problem_persists must be a boolean");
    }
}

export function validateEvacuation(
    evacuation: string | null | undefined
) {
    if (
        evacuation &&
        !validEvacuationOptions.includes(evacuation)
    ) {
        throw new Error("Invalid evacuation option");
    }
}

export function validateWorkAffected(
    workAffected: string | null | undefined
) {
    if (
        workAffected &&
        !validWorkAffectedOptions.includes(workAffected)
    ) {
        throw new Error("Invalid work_affected option");
    }
}

export function validateServicesAffected(
    servicesAffected: string[] | null | undefined
) {
    if (!servicesAffected) {
        return;
    }

    const invalidService = servicesAffected.find(
        service => !validServices.includes(service)
    );

    if (invalidService) {
        throw new Error("Invalid services_affected option");
    }
}

export function validateAssistanceNeeded(
    assistanceNeeded: string[] | null | undefined
) {
    if (!assistanceNeeded) {
        return;
    }

    const invalidAssistance = assistanceNeeded.find(
        assistance => !validAssistance.includes(assistance)
    );

    if (invalidAssistance) {
        throw new Error("Invalid assistance_needed option");
    }
}