@echo off
setlocal EnableExtensions
cd /d "%~dp0"

where npm >nul 2>&1
if errorlevel 1 (
  echo [ERROR] npm not found. Install Node.js 20+ and ensure it is on your PATH.
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo Installing npm dependencies...
  call npm install
  if errorlevel 1 (
    echo [ERROR] npm install failed.
    pause
    exit /b 1
  )
)

echo.
echo Starting Vite dev server...
echo If port 5173 is in use, Vite will use the next free port ^(5174, 5175, ...^).
echo Browser will open to the URL shown below when the server is ready.
echo Press Ctrl+C in this window to stop the server.
echo.

REM --open: launch default browser to the actual bound URL (correct port automatically)
REM Default: Vite tries the next free port if 5173 is busy (no --strictPort flag)
call npm run dev -- --open

endlocal
