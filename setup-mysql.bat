@echo off
echo ========================================
echo MySQL Database Setup for Admin Dashboard
echo ========================================
echo.
echo This will create the 'admin_dashboard_db' database
echo.
pause

echo.
echo Running setup...
mysql -u root -padmin -e "CREATE DATABASE IF NOT EXISTS admin_dashboard_db;" 2>nul

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ Database created successfully!
    echo ✓ Database name: admin_dashboard_db
    echo.
    echo Now you can start the backend with:
    echo   cd admin-dashboard-api
    echo   npm run start:dev
    echo.
) else (
    echo.
    echo ✗ Error: Could not connect to MySQL
    echo.
    echo Please check:
    echo 1. MySQL service is running
    echo 2. Root password is set to 'admin'
    echo.
    echo If password is different, run this manually:
    echo   mysql -u root -p
    echo Then type: CREATE DATABASE admin_dashboard_db;
    echo.
)

pause
