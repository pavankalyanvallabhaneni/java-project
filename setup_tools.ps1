# ========================================================
# BharatHire - Project Environment Setup & Run Script
# ========================================================

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host " BharatHire - India's Premier Job & Recruitment Portal " -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan

# 1. Environment Verification
$JavaPath = "C:\Users\pawan kalyan\.tools\jdk-21\bin"
$MavenPath = "C:\Users\pawan kalyan\.tools\apache-maven\bin"

if (Test-Path "$JavaPath\java.exe") {
    $env:JAVA_HOME = "C:\Users\pawan kalyan\.tools\jdk-21"
    $env:PATH = "$JavaPath;$MavenPath;$env:PATH"
    Write-Host "[OK] Configured Java 21 and Apache Maven in PATH" -ForegroundColor Green
} else {
    Write-Host "[INFO] Using system installed Java and Maven" -ForegroundColor Yellow
}

# 2. Check Prerequisites
Write-Host "`nChecking environment dependencies..." -ForegroundColor Cyan
try {
    $javaVer = & java -version 2>&1 | Select-Object -First 1
    Write-Host "[OK] $javaVer" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Java is not installed or not in PATH." -ForegroundColor Red
}

try {
    $nodeVer = & node -v
    Write-Host "[OK] Node.js version: $nodeVer" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Node.js is not found." -ForegroundColor Red
}

Write-Host "`nAvailable Actions:" -ForegroundColor Yellow
Write-Host "  1. Start Spring Boot Backend Server (port 8080)" -ForegroundColor White
Write-Host "  2. Start React + Vite Frontend Dev Server (port 5173)" -ForegroundColor White
Write-Host "  3. Build Complete Project (Backend tests + Frontend bundle)" -ForegroundColor White
Write-Host "  4. Exit" -ForegroundColor White

Write-Host "`nTo run the servers in parallel:" -ForegroundColor Cyan
Write-Host "  Backend:  cd backend; mvn spring-boot:run" -ForegroundColor Gray
Write-Host "  Frontend: cd frontend; npm run dev" -ForegroundColor Gray
Write-Host "========================================================`n" -ForegroundColor Cyan
