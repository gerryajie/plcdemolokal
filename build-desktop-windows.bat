@echo off
REM MonitorPLC Desktop Build Script for Windows

echo.
echo ========================================
echo   MonitorPLC Desktop Builder (Windows)
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js is installed: 
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed
    pause
    exit /b 1
)

echo [OK] npm is installed:
npm --version
echo.

REM Menu
echo Select build option:
echo 1. Development (electron-dev - run with hot reload)
echo 2. Build Windows NSIS Installer
echo 3. Build Windows Portable Exe
echo 4. Build Both Windows Installers
echo 5. Install Dependencies
echo 6. Exit
echo.

set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" (
    echo.
    echo Starting development mode...
    echo.
    cd FE
    call npm run electron-dev
    goto end
)

if "%choice%"=="2" (
    echo.
    echo Building Windows NSIS Installer...
    echo This will take a few minutes...
    echo.
    cd FE
    if not exist build-runtime mkdir build-runtime
    powershell -NoProfile -Command "$node=(Get-Command node).Source; Copy-Item -LiteralPath $node -Destination build-runtime\node.exe -Force"
    call npm run electron-build:win:nsis
    if errorlevel 1 (
        echo [ERROR] Build failed
        pause
        exit /b 1
    )
    echo.
    echo [SUCCESS] Build completed!
    echo Installer created in: FE\release\
    pause
    goto end
)

if "%choice%"=="3" (
    echo.
    echo Building Windows Portable Exe...
    echo This will take a few minutes...
    echo.
    cd FE
    if not exist build-runtime mkdir build-runtime
    powershell -NoProfile -Command "$node=(Get-Command node).Source; Copy-Item -LiteralPath $node -Destination build-runtime\node.exe -Force"
    call npm run electron-build:win:portable
    if errorlevel 1 (
        echo [ERROR] Build failed
        pause
        exit /b 1
    )
    echo.
    echo [SUCCESS] Build completed!
    echo Portable exe created in: FE\release\
    pause
    goto end
)

if "%choice%"=="4" (
    echo.
    echo Building both Windows installers...
    echo This will take a few minutes...
    echo.
    cd FE
    if not exist build-runtime mkdir build-runtime
    powershell -NoProfile -Command "$node=(Get-Command node).Source; Copy-Item -LiteralPath $node -Destination build-runtime\node.exe -Force"
    call npm run electron-build:win
    if errorlevel 1 (
        echo [ERROR] Build failed
        pause
        exit /b 1
    )
    echo.
    echo [SUCCESS] Build completed!
    echo Installers created in: FE\release\
    pause
    goto end
)

if "%choice%"=="5" (
    echo.
    echo Installing dependencies...
    echo.
    call npm install
    cd BE && call npm install && cd ..
    cd FE && call npm install && cd ..
    echo.
    echo [SUCCESS] Dependencies installed!
    pause
    goto end
)

if "%choice%"=="6" (
    goto end
)

echo Invalid choice. Please try again.
pause
goto end

:end
echo.
echo Exiting...
