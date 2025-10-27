# 🚀 Guía de Instalación Rápida - Wanted Roleplay Staff Panel

## Paso 1: Instalar Dependencias

```powershell
npm install
```

## Paso 2: Configurar MySQL

1. Asegúrate de tener MySQL instalado y corriendo
2. Crea la base de datos:

```powershell
mysql -u root -p
```

Luego en MySQL:
```sql
CREATE DATABASE wanted_roleplay;
exit;
```

3. Importa la estructura:

```powershell
mysql -u root -p wanted_roleplay < database.sql
```

## Paso 3: Configurar Discord

### A. Crear Aplicación de Discord

1. Ve a https://discord.com/developers/applications
2. Click en "New Application"
3. Dale un nombre (ej: "Wanted RP Staff Panel")

### B. Configurar Bot

1. Ve a la sección "Bot"
2. Click en "Add Bot"
3. Copia el **Token** del bot
4. Activa estos intents:
   - ✅ Presence Intent
   - ✅ Server Members Intent
   - ✅ Message Content Intent

### C. Configurar OAuth2

1. Ve a "OAuth2" > "General"
2. Copia el **Client ID** y **Client Secret**
3. En "Redirects", añade:
   ```
   http://localhost:3000/auth/callback
   ```

### D. Invitar Bot al Servidor

1. Ve a "OAuth2" > "URL Generator"
2. Selecciona scopes:
   - ✅ bot
   - ✅ applications.commands
3. Selecciona permisos:
   - ✅ Administrator (o los permisos que necesites)
4. Copia la URL generada y ábrela en tu navegador
5. Selecciona tu servidor y autoriza

### E. Crear Webhook

1. Ve a tu servidor de Discord
2. Settings > Integrations > Webhooks
3. "New Webhook"
4. Dale un nombre y selecciona el canal
5. Copia la Webhook URL

## Paso 4: Configurar Variables de Entorno

El archivo `.env` ya está creado. Ábrelo y completa:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=TU_PASSWORD_DE_MYSQL
DB_NAME=wanted_roleplay

DISCORD_BOT_TOKEN=TU_TOKEN_DE_BOT
DISCORD_CLIENT_ID=TU_CLIENT_ID
DISCORD_CLIENT_SECRET=TU_CLIENT_SECRET
DISCORD_CALLBACK_URL=http://localhost:3000/auth/callback

DISCORD_WEBHOOK_URL=TU_WEBHOOK_URL

SESSION_SECRET=genera_una_clave_aleatoria_aqui

PORT=3000
NODE_ENV=development
```

## Paso 5: Iniciar el Servidor

```powershell
npm start
```

O en modo desarrollo:

```powershell
npm run dev
```

## Paso 6: Acceder al Panel

1. Abre tu navegador en: http://localhost:3000
2. Click en "Iniciar sesión con Discord"
3. Autoriza la aplicación

## ⚠️ Importante

- El usuario DEBE tener el rol con ID `1127967840654336101` en el servidor con ID `1125513390161395812`
- Si necesitas cambiar estos IDs, edita `config/discord-bot.js`

## 🔧 Verificar Instalación

```powershell
npm run setup-db
```

Este comando verifica la conexión a la base de datos.

## 📝 Primeros Pasos

Una vez dentro del panel:

1. Ve al Dashboard para ver las estadísticas
2. Registra tu primer baneo en la sección "Baneos"
3. Prueba el chat interno
4. Revisa los logs de actividad

## 🆘 Problemas Comunes

### Error: "Cannot connect to MySQL"
- Verifica que MySQL esté corriendo
- Verifica usuario y contraseña en `.env`

### Error: "Discord login failed"
- Verifica que el Client ID y Secret sean correctos
- Verifica que la Callback URL esté en Discord OAuth

### No puedo acceder después de login
- Verifica que tengas el rol correcto en Discord
- Revisa los IDs en `config/discord-bot.js`

### El bot no se conecta
- Verifica el token del bot
- Asegúrate de que los intents estén activados

## 🎉 ¡Listo!

Tu panel de staff está funcionando. Ahora puedes gestionar tu servidor de roleplay de manera profesional.

---

Para más ayuda, consulta el README.md completo.
