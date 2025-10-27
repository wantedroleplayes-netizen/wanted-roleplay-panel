# 🌐 CONFIGURACIÓN DE PORT FORWARDING - Tu PC

## 📋 INFORMACIÓN DE TU RED

**Tu IP Pública:** `170.253.40.234`
**Tu IP Local:** `192.168.1.138`
**Puerto de la aplicación:** `3000`

---

## 🔧 PASOS PARA CONFIGURAR TU ROUTER

### **1. Acceder a tu router**

Abre un navegador y ve a una de estas direcciones:
- http://192.168.1.1
- http://192.168.0.1
- http://192.168.1.254

**Credenciales comunes:**
- Usuario: `admin` / Contraseña: `admin`
- Usuario: `admin` / Contraseña: `password`
- Usuario: `admin` / Contraseña: (en blanco)
- O mira la pegatina en la parte de atrás de tu router

---

### **2. Buscar la sección de Port Forwarding**

Dependiendo de tu router, busca alguna de estas opciones:
- "Port Forwarding"
- "Redirección de puertos"
- "NAT"
- "Virtual Server"
- "Aplicaciones y juegos"
- "DMZ / Port Forwarding"

---

### **3. Crear una nueva regla**

Configura con estos valores:

```
Nombre/Descripción: Wanted Roleplay Panel
Protocolo: TCP (o TCP/UDP)
Puerto Externo: 3000
Puerto Interno: 3000
IP Interna: 192.168.1.138
Estado: Habilitado/Enabled
```

**Ejemplo visual:**
```
┌─────────────────────────────────────────┐
│ Nombre:      Wanted Panel               │
│ Protocolo:   TCP                        │
│ Puerto Ext:  3000                       │
│ Puerto Int:  3000                       │
│ IP Interna:  192.168.1.138              │
│ Estado:      ✓ Habilitado               │
└─────────────────────────────────────────┘
```

---

### **4. Guardar y aplicar cambios**

- Click en "Guardar" o "Aplicar"
- Algunos routers necesitan reiniciarse
- Espera 1-2 minutos

---

### **5. Configurar el Firewall de Windows**

Abre PowerShell como **Administrador** y ejecuta:

```powershell
# Permitir puerto 3000 entrante
New-NetFirewallRule -DisplayName "Wanted Roleplay Panel" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow

# Permitir puerto 3000 saliente
New-NetFirewallRule -DisplayName "Wanted Roleplay Panel OUT" -Direction Outbound -LocalPort 3000 -Protocol TCP -Action Allow
```

---

## ✅ VERIFICAR QUE FUNCIONA

### **Opción 1: Desde tu PC**
```
http://localhost:3000
```

### **Opción 2: Desde otro dispositivo en tu casa (WiFi)**
```
http://192.168.1.138:3000
```

### **Opción 3: Desde internet (usa tu móvil con datos)**
```
http://170.253.40.234:3000
```

---

## 📱 COMPARTIR CON TUS AMIGOS

Diles que abran en su navegador:
```
http://170.253.40.234:3000
```

⚠️ **IMPORTANTE:**
- Tu PC debe estar **ENCENDIDA** 24/7
- La aplicación debe estar **CORRIENDO** (node server.js)
- Si reinicias tu router, tu IP pública puede cambiar

---

## 🌐 USAR UN DOMINIO GRATIS (OPCIONAL)

### **Opción A: DuckDNS (Recomendado)**

1. Ve a https://www.duckdns.org
2. Login con tu cuenta (Google, GitHub, etc.)
3. Crea un dominio: `wanted-roleplay.duckdns.org`
4. Copia tu token
5. Descarga el cliente para Windows: https://www.duckdns.org/install.jsp

**Configuración rápida:**
```powershell
# Crear archivo update.ps1
$token = "TU_TOKEN_AQUI"
$domain = "wanted-roleplay"
Invoke-WebRequest -Uri "https://www.duckdns.org/update?domains=$domain&token=$token"
```

6. Crea una tarea programada en Windows para ejecutar cada 5 minutos
7. Comparte con amigos: `http://wanted-roleplay.duckdns.org:3000`

### **Opción B: No-IP**

1. Ve a https://www.noip.com
2. Registrate gratis
3. Crea un hostname: `wanted.ddns.net`
4. Descarga su cliente DUC (Dynamic Update Client)
5. Configura con tus credenciales
6. Comparte: `http://wanted.ddns.net:3000`

---

## 🔒 SEGURIDAD

### ⚠️ **RIESGOS DE EXPONER TU PC:**

1. **Tu IP pública es visible** - Cualquiera que acceda sabrá tu IP
2. **Puerto abierto al internet** - Posible objetivo de ataques
3. **Consumo de internet** - Usa tu ancho de banda

### ✅ **RECOMENDACIONES:**

1. **Firewall activo:**
   - Solo abre el puerto 3000
   - No abras más puertos innecesarios

2. **Autenticación fuerte:**
   - Usa contraseñas seguras en el panel
   - Cambia las credenciales por defecto

3. **Monitoreo:**
   - Revisa los logs regularmente
   - Vigila conexiones sospechosas

4. **Backups:**
   - Haz backup de tu base de datos regularmente
   - Guarda en un lugar seguro

5. **Mejor opción:**
   - Si va a ser permanente, considera Railway o VPS
   - Tu PC es solo para PRUEBAS

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### **Problema: No puedo acceder desde internet**

**Posibles causas:**
1. Port forwarding mal configurado → Revisa la configuración
2. Firewall bloqueando → Desactiva temporalmente para probar
3. ISP bloquea puerto 3000 → Prueba otro puerto (8080, 8000)
4. IP dinámica cambió → Usa DuckDNS
5. Router tiene doble NAT → Contacta a tu ISP

**Cómo probar:**
```powershell
# Desde internet, revisa si el puerto está abierto:
# Usa: https://www.yougetsignal.com/tools/open-ports/
# Ingresa: 170.253.40.234 puerto 3000
```

### **Problema: Funciona en casa pero no desde internet**

1. Verifica que el firewall de Windows permite conexiones externas
2. Revisa que el router no tenga reglas de firewall bloqueando
3. Asegúrate que tu ISP no bloquea puertos

### **Problema: Mi IP pública cambia cada día**

**Solución:** Usa DuckDNS (ver arriba) para tener un dominio que siempre apunte a tu IP actual

---

## 📊 MONITOREO

### **Ver quién está conectado:**

Agrega esto a tu `server.js`:

```javascript
io.on('connection', (socket) => {
    console.log(`Nueva conexión: ${socket.handshake.address}`);
    
    socket.on('disconnect', () => {
        console.log(`Desconexión: ${socket.handshake.address}`);
    });
});
```

### **Ver logs de acceso:**

Los verás en la consola donde ejecutas `node server.js`

---

## 🎯 CHECKLIST FINAL

Antes de compartir con amigos:

- [ ] Port forwarding configurado en router
- [ ] Firewall de Windows configurado
- [ ] Aplicación corriendo: `node server.js`
- [ ] Probado desde dispositivo externo (datos móviles)
- [ ] Base de datos funcionando correctamente
- [ ] Discord bot activo
- [ ] Credenciales seguras configuradas
- [ ] Backups de la base de datos realizados

---

## 📞 INFORMACIÓN PARA COMPARTIR

Copia y pega esto a tus amigos:

```
🎮 WANTED ROLEPLAY - STAFF PANEL

🌐 URL: http://170.253.40.234:3000

📋 Instrucciones:
1. Abre el link en tu navegador
2. Inicia sesión con Discord
3. Espera aprobación de staff

⚠️ IMPORTANTE:
- Guarda el link en favoritos
- Si no carga, avísame (mi PC puede estar apagada)
- No compartas este link públicamente

💬 Contacto: [Tu Discord/WhatsApp]
```

---

**¡Listo para compartir!** 🚀

Recuerda: Esta es una solución temporal. Para producción seria, usa Railway o un VPS.
