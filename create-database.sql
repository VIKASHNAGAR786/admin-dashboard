-- ========================================
-- Admin Dashboard Database Setup
-- ========================================
-- Run this in MySQL Workbench Query tab
-- ========================================

-- Create the database
CREATE DATABASE IF NOT EXISTS admin_dashboard_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Verify it was created
SHOW DATABASES LIKE 'admin_dashboard_db';

-- Display success message
SELECT 'Database created successfully! You can now start the backend.' AS Status;
