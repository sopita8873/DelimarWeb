@echo off
cd /d "c:\Users\david\Documents\Javi\DelimarWeb\backend"
echo ========================================
echo     INICIANDO SERVIDOR DELIMARWEB
echo ========================================
echo Directorio actual: %CD%
echo.
echo Verificando archivos...
if exist "simple-server.js" (
    echo ✅ Archivo simple-server.js encontrado
) else (
    echo ❌ Error: simple-server.js no encontrado
    pause
    exit /b 1
)
echo.
echo Verificando Node.js...
node --version
if %errorlevel% neq 0 (
    echo ❌ Error: Node.js no instalado
    pause
    exit /b 1
)
echo.
echo Iniciando servidor...
echo ========================================
node simple-server.js
