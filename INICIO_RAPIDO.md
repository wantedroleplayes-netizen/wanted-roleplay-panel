# ✅ RESUMEN RÁPIDO - Configurar acceso desde internet

## 🎯 TU SITUACIÓN ACTUAL

✅ Servidor corriendo en puerto 3000
✅ Funciona en tu PC: http://localhost:3000
✅ Tu IP Local: 192.168.1.138
✅ Tu IP Pública: 170.253.40.234

---

## 📝 LO QUE NECESITAS HACER AHORA

### **1. CONFIGURAR FIREWALL DE WINDOWS** (2 minutos)

#### Opción A: Interfaz gráfica (más fácil)
1. Presiona `Win + R`
2. Escribe: `wf.msc` y presiona Enter
3. Click en "Reglas de entrada" (lado izquierdo)
4. Click en "Nueva regla..." (lado derecho)
5. Selecciona "Puerto" → Siguiente
6. Selecciona "TCP" y escribe "3000" → Siguiente
7. Selecciona "Permitir la conexión" → Siguiente
8. Marca todas las opciones (Dominio, Privado, Público) → Siguiente
9. Nombre: "Wanted Roleplay Panel" → Finalizar

**Repite lo mismo para "Reglas de salida"**

#### Opción B: PowerShell como Administrador
```powershell
# Click derecho en PowerShell → Ejecutar como administrador
# Luego copia y pega estos comandos:

New-NetFirewallRule -DisplayName "Wanted Panel IN" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow

New-NetFirewallRule -DisplayName "Wanted Panel OUT" -Direction Outbound -LocalPort 3000 -Protocol TCP -Action Allow
```

---

### **2. CONFIGURAR PORT FORWARDING EN TU ROUTER** (5 minutos)

#### Paso 1: Acceder al router
Abre tu navegador y ve a:
- http://192.168.1.1 (más común)
- http://192.168.0.1 (alternativo)

**Usuario/contraseña común:**
- admin / admin
- admin / password
- O mira la etiqueta en tu router

#### Paso 2: Buscar la opción
Busca alguna de estas secciones:
- "Port Forwarding"
- "NAT"
- "Virtual Server"
- "Aplicaciones y Juegos"

#### Paso 3: Crear regla
```
┌──────────────────────────────┐
│ Nombre:      Wanted Panel    │
│ Protocolo:   TCP             │
│ Puerto Ext:  3000            │
│ Puerto Int:  3000            │
│ IP Interna:  192.168.1.138   │
│ Estado:      Habilitado      │
└──────────────────────────────┘
```

#### Paso 4: Guardar
- Click en "Guardar" o "Aplicar"
- Algunos routers se reinician automáticamente
- Espera 1-2 minutos

---

### **3. VERIFICAR QUE FUNCIONA** (3 minutos)

#### Test 1: Desde tu PC
```
http://localhost:3000
```
✅ Ya funciona (confirmado)

#### Test 2: Desde tu móvil (usando WiFi de casa)
```
http://192.168.1.138:3000
```
- Desconecta datos móviles
- Conecta a tu WiFi
- Abre el navegador
- Ingresa la URL

#### Test 3: Desde internet (datos móviles)
```
http://170.253.40.234:3000
```
- Desconecta del WiFi
- Usa SOLO datos móviles
- Abre el navegador
- Ingresa la URL

#### Test 4: Verificador online
Ve a: https://www.yougetsignal.com/tools/open-ports/
- IP Address: `170.253.40.234`
- Port Number: `3000`
- Click "Check"
- Debe decir: "Port 3000 is open"

---

### **4. COMPARTIR CON TUS AMIGOS**

Copia y pégales esto:

```
🎮 WANTED ROLEPLAY - STAFF PANEL

🌐 Link: http://170.253.40.234:3000

📱 Instrucciones:
1. Abre el link en tu navegador
2. Click en "Iniciar Sesión con Discord"
3. Autoriza la aplicación
4. Espera a que staff te apruebe

⚠️ Si no carga:
- Avísame, mi PC puede estar apagada
- Intenta de nuevo en unos minutos

🔒 IMPORTANTE:
- NO compartas este link en público
- Es solo para staff del servidor
```

---

## ⚠️ IMPORTANTE - RECORDATORIOS

### Tu PC debe estar:
- ✅ **ENCENDIDA** 24/7
- ✅ **CONECTADA** a internet
- ✅ **SERVIDOR CORRIENDO** (node server.js)

### Si reinicias tu PC:
```powershell
cd C:\Users\Ivan\Desktop\test
node server.js
```

### Si tu IP pública cambia:
- Tu IP puede cambiar si reinicias el router
- Verifica tu nueva IP: `Invoke-RestMethod -Uri "https://api.ipify.org"`
- Actualiza el link que compartes

---

## 🌐 DOMINIO GRATIS (OPCIONAL)

Para no depender de tu IP:

### Opción recomendada: DuckDNS

1. Ve a: https://www.duckdns.org
2. Login con Google/GitHub
3. Crea dominio: `wanted-roleplay` (será: wanted-roleplay.duckdns.org)
4. Copia tu token
5. Descarga el cliente Windows
6. Configúralo para actualizar cada 5 minutos

**Ventaja:** Aunque tu IP cambie, el dominio siempre funcionará
**Comparte:** `http://wanted-roleplay.duckdns.org:3000`

---

## 🆘 PROBLEMAS COMUNES

### "No puedo acceder desde internet"
**Soluciones:**
1. ✓ Verifica firewall de Windows está configurado
2. ✓ Verifica port forwarding en router
3. ✓ Prueba con datos móviles (no WiFi)
4. ✓ Verifica que el servidor esté corriendo
5. ✓ Espera 2-3 minutos después de configurar router

### "Funciona en casa pero no desde afuera"
**Causas:**
- Port forwarding no configurado correctamente
- IP interna incorrecta (debe ser 192.168.1.138)
- ISP bloquea el puerto 3000 (prueba puerto 8080)

### "Mi IP pública cambia todo el tiempo"
**Solución:**
- Usa DuckDNS (ver arriba)
- Configura IP estática en router (avanzado)

---

## 📊 CHECKLIST FINAL

Antes de compartir:

- [ ] Firewall de Windows configurado
- [ ] Port Forwarding en router configurado
- [ ] Probado desde móvil con datos
- [ ] Puerto 3000 abierto (verificado en yougetsignal.com)
- [ ] Servidor corriendo (node server.js)
- [ ] Base de datos funcionando
- [ ] Discord bot activo
- [ ] Link copiado para compartir

---

## 🎯 SIGUIENTE PASO

**AHORA MISMO:**

1. Configura el firewall (ver paso 1 arriba)
2. Configura port forwarding (ver paso 2 arriba)
3. Prueba desde tu móvil con datos
4. Si funciona, comparte con amigos

**Tiempo estimado total: 10-15 minutos**

---

¿Necesitas ayuda? Lee el archivo completo: `CONFIGURACION_TU_PC.md`
