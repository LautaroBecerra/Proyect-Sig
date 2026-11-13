CREATE TABLE IF NOT EXISTS flood_report_images (
    id SERIAL PRIMARY KEY,

    flood_report_id INTEGER NOT NULL
        REFERENCES flood_reports(id) ON DELETE CASCADE,

    file_name VARCHAR(255) NOT NULL,
    storage_path TEXT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size_bytes INTEGER NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_flood_report_images_report_id
ON flood_report_images(flood_report_id);