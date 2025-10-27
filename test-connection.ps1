# ========================================
# SCRIPT DE VERIFICACIÓN DE CONEXIÓN
# Ejecutar DESPUÉS de configurar todo
# ========================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  WANTED ROLEPLAY - TEST DE CONEXIÓN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Obtener IPs
Write-Host "📡 Obteniendo información de red..." -ForegroundColor Yellow
Write-Host ""

# IP Local
$ipLocal = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -like "192.168.*"}).IPAddress
Write-Host "🏠 IP Local: $ipLocal" -ForegroundColor Green

# IP Pública
try {
    $ipPublica = Invoke-RestMethod -Uri "https://api.ipify.org"
    Write-Host "🌐 IP Pública: $ipPublica" -ForegroundColor Green
} catch {
    Write-Host "❌ No se pudo obtener IP pública" -ForegroundColor Red
    $ipPublica = "No disponible"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si el servidor está corriendo
Write-Host "🔍 Verificando si el servidor está corriendo..." -ForegroundColor Yellow

$serverRunning = Get-Process -Name "node" -ErrorAction SilentlyContinue

if ($serverRunning) {
    Write-Host "✅ Servidor Node.js está corriendo" -ForegroundColor Green
    Write-Host "   PIDs: $($serverRunning.Id -join ', ')" -ForegroundColor White
} else {
    Write-Host "❌ Servidor Node.js NO está corriendo" -ForegroundColor Red
    Write-Host "   Ejecuta: node server.js" -ForegroundColor Yellow
}

Write-Host ""

# Verificar puerto 3000
Write-Host "🔍 Verificando puerto 3000..." -ForegroundColor Yellow

try {
    $puerto = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
    if ($puerto) {
        Write-Host "✅ Puerto 3000 está en uso (servidor escuchando)" -ForegroundColor Green
        Write-Host "   Estado: $($puerto.State)" -ForegroundColor White
    } else {
        Write-Host "⚠️  Puerto 3000 no está en uso" -ForegroundColor Yellow
        Write-Host "   El servidor debe estar corriendo" -ForegroundColor White
    }
} catch {
    Write-Host "⚠️  No se pudo verificar el puerto" -ForegroundColor Yellow
}

Write-Host ""

# Verificar reglas de firewall
Write-Host "🔍 Verificando reglas de firewall..." -ForegroundColor Yellow

$firewallRules = Get-NetFirewallRule -DisplayName "Wanted Roleplay Panel*" -ErrorAction SilentlyContinue

if ($firewallRules) {
    Write-Host "✅ Reglas de firewall configuradas" -ForegroundColor Green
    foreach ($rule in $firewallRules) {
        $enabled = if ($rule.Enabled -eq "True") { "✓" } else { "✗" }
        Write-Host "   $enabled $($rule.DisplayName) - $($rule.Direction)" -ForegroundColor White
    }
} else {
    Write-Host "❌ No hay reglas de firewall configuradas" -ForegroundColor Red
    Write-Host "   Ejecuta: .\setup-firewall.ps1 como ADMINISTRADOR" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test de conexión local
Write-Host "🧪 Probando conexión LOCAL..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Conexión LOCAL exitosa (localhost:3000)" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ No se pudo conectar localmente" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor White
}

Write-Host ""

# Test de conexión por IP local
Write-Host "🧪 Probando conexión por IP LOCAL..." -ForegroundColor Yellow

try {
    $response = Invoke-WebRequest -Uri "http://${ipLocal}:3000" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Conexión por IP LOCAL exitosa ($ipLocal:3000)" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ No se pudo conectar por IP local" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RESUMEN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# URLs para probar
Write-Host "📋 URLs para probar:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1️⃣  Desde TU PC:" -ForegroundColor Cyan
Write-Host "   http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "2️⃣  Desde otros dispositivos en TU CASA (WiFi):" -ForegroundColor Cyan
Write-Host "   http://${ipLocal}:3000" -ForegroundColor White
Write-Host ""
Write-Host "3️⃣  Desde INTERNET (tus amigos):" -ForegroundColor Cyan
Write-Host "   http://${ipPublica}:3000" -ForegroundColor White
Write-Host ""

Write-Host "⚠️  IMPORTANTE - Para que opción 3 funcione:" -ForegroundColor Yellow
Write-Host "   ✓ Debes configurar Port Forwarding en tu router" -ForegroundColor White
Write-Host "   ✓ Puerto: 3000 → 3000" -ForegroundColor White
Write-Host "   ✓ IP interna: $ipLocal" -ForegroundColor White
Write-Host "   ✓ Protocolo: TCP" -ForegroundColor White
Write-Host ""

Write-Host "📖 Lee el archivo CONFIGURACION_TU_PC.md para más detalles" -ForegroundColor Green
Write-Host ""

Write-Host "🔗 Verificar puerto desde internet:" -ForegroundColor Yellow
Write-Host "   https://www.yougetsignal.com/tools/open-ports/" -ForegroundColor Cyan
Write-Host "   IP: $ipPublica" -ForegroundColor White
Write-Host "   Puerto: 3000" -ForegroundColor White
Write-Host ""

Read-Host "Presiona Enter para salir"
