-- Admin Dashboard Database Setup
-- Run this after installing MySQL

-- Create database
CREATE DATABASE IF NOT EXISTS admin_dashboard_db;

-- Use the database
USE admin_dashboard_db;

-- Verify database is created
SHOW DATABASES LIKE 'admin_dashboard_db';

-- Show success message
SELECT 'Database setup complete! You can now start the backend.' AS Status;
