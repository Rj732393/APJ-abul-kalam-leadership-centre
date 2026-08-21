-- Migration: Add category column to gallery_images table
IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'gallery_images' AND COLUMN_NAME = 'category'
)
BEGIN
    ALTER TABLE gallery_images ADD category NVARCHAR(50) NULL;
END;
