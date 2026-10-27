@echo off
title BharatHire - Full Stack Application Runner
echo ========================================================
echo  BharatHire - Recruitment Management System & Job Portal
echo ========================================================
echo.

set "JAVA_HOME=C:\Users\pawan kalyan\.tools\jdk-21"
set "PATH=%JAVA_HOME%\bin;C:\Users\pawan kalyan\.tools\apache-maven\bin;%PATH%"

echo Starting Spring Boot Backend (Port 8080)...
start "BharatHire Backend (Spring Boot 8080)" cmd /k "cd backend && mvn spring-boot:run"

timeout /t 5 /nobreak >nul

echo Starting React Frontend (Port 5173)...
start "BharatHire Frontend (Vite 5173)" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo Both Backend and Frontend services launched!
echo - Frontend URL: http://localhost:5173
echo - Backend API:  http://localhost:8080/api
echo - Swagger Docs: http://localhost:8080/swagger-ui.html
echo ========================================================
echo.
pause
