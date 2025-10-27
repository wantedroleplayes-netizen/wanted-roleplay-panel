# ========================================
# SCRIPT DE CONFIGURACIÓN DE FIREWALL
# Ejecutar como ADMINISTRADOR
# ========================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  WANTED ROLEPLAY - FIREWALL SETUP" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si se ejecuta como administrador
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ ERROR: Este script debe ejecutarse como ADMINISTRADOR" -ForegroundColor Red
    Write-Host ""
    Write-Host "Cómo ejecutar como administrador:" -ForegroundColor Yellow
    Write-Host "1. Click derecho en PowerShell" -ForegroundColor White
    Write-Host "2. Selecciona 'Ejecutar como administrador'" -ForegroundColor White
    Write-Host "3. Navega a esta carpeta: cd 'C:\Users\Ivan\Desktop\test'" -ForegroundColor White
    Write-Host "4. Ejecuta: .\setup-firewall.ps1" -ForegroundColor White
    Write-Host ""
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host "✅ Ejecutando como Administrador" -ForegroundColor Green
Write-Host ""

# Verificar si las reglas ya existen
$existingRuleIn = Get-NetFirewallRule -DisplayName "Wanted Roleplay Panel IN" -ErrorAction SilentlyContinue
$existingRuleOut = Get-NetFirewallRule -DisplayName "Wanted Roleplay Panel OUT" -ErrorAction SilentlyContinue

# Regla de entrada (Inbound)
Write-Host "🔧 Configurando regla de entrada (Inbound)..." -ForegroundColor Yellow

if ($existingRuleIn) {
    Write-Host "⚠️  La regla de entrada ya existe. Eliminando..." -ForegroundColor Yellow
    Remove-NetFirewallRule -DisplayName "Wanted Roleplay Panel IN"
}

try {
    New-NetFirewallRule -DisplayName "Wanted Roleplay Panel IN" `
                        -Direction Inbound `
                        -LocalPort 3000 `
                        -Protocol TCP `
                        -Action Allow `
                        -Profile Any `
                        -Description "Permite conexiones entrantes al panel de Wanted Roleplay"
    Write-Host "✅ Regla de entrada creada exitosamente" -ForegroundColor Green
} catch {
    Write-Host "❌ Error al crear regla de entrada: $_" -ForegroundColor Red
}

Write-Host ""

# Regla de salida (Outbound)
Write-Host "🔧 Configurando regla de salida (Outbound)..." -ForegroundColor Yellow

if ($existingRuleOut) {
    Write-Host "⚠️  La regla de salida ya existe. Eliminando..." -ForegroundColor Yellow
    Remove-NetFirewallRule -DisplayName "Wanted Roleplay Panel OUT"
}

try {
    New-NetFirewallRule -DisplayName "Wanted Roleplay Panel OUT" `
                        -Direction Outbound `
                        -LocalPort 3000 `
                        -Protocol TCP `
                        -Action Allow `
                        -Profile Any `
                        -Description "Permite conexiones salientes del panel de Wanted Roleplay"
    Write-Host "✅ Regla de salida creada exitosamente" -ForegroundColor Green
} catch {
    Write-Host "❌ Error al crear regla de salida: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CONFIGURACIÓN COMPLETADA" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Mostrar reglas creadas
Write-Host "📋 Reglas de firewall creadas:" -ForegroundColor Cyan
Get-NetFirewallRule -DisplayName "Wanted Roleplay Panel*" | Select-Object DisplayName, Direction, Action, Enabled | Format-Table

Write-Host ""
Write-Host "🌐 INFORMACIÓN DE CONEXIÓN:" -ForegroundColor Green
Write-Host "----------------------------" -ForegroundColor Green
Write-Host "Puerto abierto: 3000" -ForegroundColor White
Write-Host "Tu IP Local: 192.168.1.138" -ForegroundColor White
Write-Host "Tu IP Pública: 170.253.40.234" -ForegroundColor White
Write-Host ""
Write-Host "📱 Comparte con tus amigos:" -ForegroundColor Yellow
Write-Host "http://170.253.40.234:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  RECUERDA:" -ForegroundColor Yellow
Write-Host "1. Debes configurar Port Forwarding en tu router" -ForegroundColor White
Write-Host "2. Tu PC debe estar encendida 24/7" -ForegroundColor White
Write-Host "3. El servidor debe estar corriendo (node server.js)" -ForegroundColor White
Write-Host ""

Read-Host "Presiona Enter para salir"
