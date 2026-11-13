-- 1. Columnas para el seguimiento de inundaciones
ALTER TABLE flood_reports
ADD COLUMN IF NOT EXISTS problem_persists_updated_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS next_confirmation_at TIMESTAMPTZ;

-- 2. Tabla de notificaciones
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    flood_report_id INTEGER NOT NULL REFERENCES flood_reports(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    responded_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);
-- 3. Evitar notificaciones pendientes duplicadas
CREATE UNIQUE INDEX IF NOT EXISTS idx_notifications_pending_unique
ON notifications (flood_report_id, type)
WHERE responded_at IS NULL;

-- 4. Historial de actualizaciones de reportes
CREATE TABLE IF NOT EXISTS flood_report_updates (
    id SERIAL PRIMARY KEY,
    flood_report_id INTEGER NOT NULL REFERENCES flood_reports(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notification_id INTEGER REFERENCES notifications(id) ON DELETE SET NULL,
    problem_persists BOOLEAN NOT NULL,
    source VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);