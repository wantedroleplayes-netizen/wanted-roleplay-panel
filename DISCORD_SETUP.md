# 🔐 CONFIGURACIÓN DE DISCORD - Guía Detallada

## 1️⃣ Crear Aplicación en Discord

### Paso 1: Ir al Portal de Desarrolladores
🔗 https://discord.com/developers/applications

### Paso 2: Crear Nueva Aplicación
1. Click en **"New Application"**
2. Nombre: `Wanted Roleplay Staff Panel`
3. Aceptar términos y crear

---

## 2️⃣ Configurar el Bot

### Paso 1: Crear Bot
1. En el menú lateral, click en **"Bot"**
2. Click en **"Add Bot"**
3. Confirmar con **"Yes, do it!"**

### Paso 2: Configurar Token
1. En la sección **"TOKEN"**, click en **"Reset Token"**
2. **Copiar el token** (¡solo se muestra una vez!)
3. Guardar en `.env` como `DISCORD_BOT_TOKEN`

```env
DISCORD_BOT_TOKEN=MTEyNT...tu_token_aqui
```

### Paso 3: Configurar Intents
Scroll hasta **"Privileged Gateway Intents"** y activar:

- ✅ **PRESENCE INTENT**
- ✅ **SERVER MEMBERS INTENT** ⚠️ IMPORTANTE
- ✅ **MESSAGE CONTENT INTENT**

⚠️ **IMPORTANTE**: Sin estos intents el bot no funcionará

### Paso 4: Configurar Permisos
Scroll hasta **"Bot Permissions"** y seleccionar:
- ✅ Administrator (recomendado)
  
O permisos específicos:
- ✅ View Channels
- ✅ Read Messages
- ✅ Send Messages

---

## 3️⃣ Configurar OAuth2

### Paso 1: Client ID y Secret
1. En el menú lateral, click en **"OAuth2"** > **"General"**
2. Copiar **Client ID**
3. Click en **"Reset Secret"** y copiar el **Client Secret**
4. Guardar en `.env`:

```env
DISCORD_CLIENT_ID=1234567890
DISCORD_CLIENT_SECRET=abc123...tu_secret
```

### Paso 2: Redirect URLs
En la sección **"Redirects"**, añadir:

**Para desarrollo:**
```
http://localhost:3000/auth/callback
```

**Para producción (cuando tengas dominio):**
```
https://tudominio.com/auth/callback
```

Guardar en `.env`:
```env
DISCORD_CALLBACK_URL=http://localhost:3000/auth/callback
```

---

## 4️⃣ Invitar el Bot al Servidor

### Método 1: URL Generator
1. Ve a **"OAuth2"** > **"URL Generator"**
2. En **"SCOPES"** seleccionar:
   - ✅ `bot`
   - ✅ `applications.commands`
3. En **"BOT PERMISSIONS"** seleccionar:
   - ✅ `Administrator`
4. Copiar la URL generada
5. Pegarla en el navegador
6. Seleccionar tu servidor
7. Autorizar

### Método 2: Manual
Usa esta URL (reemplaza CLIENT_ID):
```
https://discord.com/api/oauth2/authorize?client_id=TU_CLIENT_ID&permissions=8&scope=bot%20applications.commands
```

---

## 5️⃣ Obtener IDs de Discord

### Guild ID (ID del Servidor)
1. En Discord, ve a **Ajustes de Usuario** > **Avanzado**
2. Activar **"Modo Desarrollador"**
3. Click derecho en tu servidor > **"Copiar ID"**
4. Pegar en `config/discord-bot.js`:

```javascript
const GUILD_ID = '1125513390161395812'; // Tu ID aquí
```

### Role ID (ID del Rol de Staff)
1. En tu servidor, ve a **Configuración del Servidor** > **Roles**
2. Click derecho en el rol de staff > **"Copiar ID"**
3. Pegar en `config/discord-bot.js`:

```javascript
const ROLE_ID = '1127967840654336101'; // Tu ID aquí
```

---

## 6️⃣ Crear Webhook para Notificaciones

### Paso 1: Crear Webhook
1. En tu servidor Discord, ve al canal donde quieres notificaciones
2. Click en la rueda de configuración del canal
3. Ve a **"Integraciones"** > **"Webhooks"**
4. Click en **"Nuevo Webhook"**

### Paso 2: Configurar Webhook
1. Nombre: `Staff Panel Notifications`
2. Seleccionar el canal
3. (Opcional) Cambiar avatar
4. Click en **"Copiar URL del Webhook"**

### Paso 3: Guardar en .env
```env
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/123.../abc...
```

---

## 7️⃣ Verificar Configuración

### Checklist Final

- [ ] Token del bot copiado en `.env`
- [ ] Client ID copiado en `.env`
- [ ] Client Secret copiado en `.env`
- [ ] Callback URL configurado en Discord y `.env`
- [ ] Webhook URL copiado en `.env`
- [ ] Intents activados en Discord
- [ ] Bot invitado al servidor
- [ ] Guild ID actualizado en `config/discord-bot.js`
- [ ] Role ID actualizado en `config/discord-bot.js`
- [ ] Rol de staff asignado a al menos un usuario

---

## 8️⃣ Probar la Configuración

### Iniciar el servidor
```powershell
npm start
```

### Verificar en la consola
Deberías ver:
```
✅ Servidor iniciado en http://localhost:3000
✅ Conexión a MySQL exitosa
✅ Bot de Discord conectado como NombreDelBot#1234
🔄 Sincronizando usuarios del servidor...
👥 X miembros con rol de staff encontrados
✅ Sincronización completada
```

### Probar login
1. Abre http://localhost:3000
2. Click en **"Iniciar sesión con Discord"**
3. Autoriza la aplicación
4. Deberías ser redirigido al dashboard

---

## ⚠️ Problemas Comunes

### Error: "Invalid OAuth2 redirect_uri"
**Solución**: Verifica que la URL en `.env` coincida exactamente con la configurada en Discord

### Error: "Missing Access"
**Solución**: Verifica que el bot tenga permisos en el servidor

### Error: "Invalid Bot Token"
**Solución**: Regenera el token en Discord y actualiza `.env`

### El bot no sincroniza usuarios
**Solución**: 
- Verifica que los intents estén activados
- Verifica que el Guild ID y Role ID sean correctos
- Reinicia el servidor

### No puedo hacer login
**Solución**:
- Asegúrate de tener el rol correcto en Discord
- Verifica que el bot esté en el servidor
- Revisa la consola para errores

---

## 🎯 IDs Actuales (Cambiar si es necesario)

```javascript
// En config/discord-bot.js

const GUILD_ID = '1125513390161395812';  // ⚠️ CAMBIAR
const ROLE_ID = '1127967840654336101';   // ⚠️ CAMBIAR
```

---

## 📚 Recursos Útiles

- 📖 Discord Developer Docs: https://discord.com/developers/docs
- 🤖 Discord.js Guide: https://discordjs.guide/
- 🔐 OAuth2 Flow: https://discord.com/developers/docs/topics/oauth2

---

## ✅ Configuración Completa

Si todo está correcto:
1. El bot aparecerá online en tu servidor
2. Los usuarios con el rol se sincronizarán automáticamente
3. Podrás hacer login con Discord
4. Las notificaciones se enviarán al webhook

¡Ya puedes usar tu panel de staff! 🎉
