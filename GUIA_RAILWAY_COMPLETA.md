# 🚀 GUÍA COMPLETA: DESPLEGAR EN RAILWAY

## 📋 REQUISITOS PREVIOS

Antes de empezar, necesitas:
- [ ] Cuenta de GitHub (gratis): https://github.com/signup
- [ ] Git instalado en tu PC
- [ ] Tu proyecto funcionando localmente

---

## 🔧 PASO 1: INSTALAR GIT (5 minutos)

### **Opción A: Instalador oficial**

1. Ve a: https://git-scm.com/download/win
2. Descarga el instalador (64-bit)
3. Ejecuta el instalador
4. Click "Next" en todo (configuración por defecto está bien)
5. Cuando termine, abre PowerShell nuevo y verifica:

```powershell
git --version
```

Deberías ver algo como: `git version 2.42.0.windows.1`

### **Opción B: Winget (Windows 11)**

```powershell
winget install --id Git.Git -e --source winget
```

### **Opción C: Chocolatey (si lo tienes)**

```powershell
choco install git
```

---

## 👤 PASO 2: CONFIGURAR GIT (2 minutos)

Después de instalar Git, abre PowerShell NUEVO y ejecuta:

```powershell
# Configura tu nombre (se verá en GitHub)
git config --global user.name "Tu Nombre"

# Configura tu email (usa el mismo de GitHub)
git config --global user.email "tu@email.com"

# Verificar configuración
git config --list
```

---

## 📁 PASO 3: CREAR REPOSITORIO EN GITHUB (3 minutos)

1. Ve a: https://github.com/new
2. **Repository name:** `wanted-roleplay-panel`
3. **Description:** `Panel de gestión de staff para Wanted Roleplay`
4. **Visibility:** 
   - ✅ **Private** (recomendado - solo tú lo ves)
   - ⚠️ Public (todos pueden ver el código)
5. **NO marques** "Add a README file"
6. **NO marques** "Add .gitignore"
7. **NO marques** "Choose a license"
8. Click **"Create repository"**

GitHub te mostrará una página con comandos. Copia la URL del repo, algo como:
```
https://github.com/TU_USUARIO/wanted-roleplay-panel.git
```

---

## 💾 PASO 4: SUBIR TU PROYECTO A GITHUB (5 minutos)

Abre PowerShell en la carpeta de tu proyecto:

```powershell
# Navega a tu proyecto
cd C:\Users\Ivan\Desktop\test

# Inicializar repositorio Git
git init

# Agregar todos los archivos
git add .

# Ver qué archivos se van a subir
git status

# Crear primer commit
git commit -m "Initial commit - Wanted Roleplay Staff Panel"

# Cambiar rama a main
git branch -M main

# Conectar con GitHub (usa la URL que copiaste)
git remote add origin https://github.com/TU_USUARIO/wanted-roleplay-panel.git

# Subir código a GitHub
git push -u origin main
```

**Si pide autenticación:**
- Usuario: Tu usuario de GitHub
- Contraseña: **Personal Access Token** (NO tu contraseña normal)

### **Crear Personal Access Token:**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. "Generate new token (classic)"
3. Marca: `repo` (acceso completo)
4. "Generate token"
5. **COPIA EL TOKEN** (solo se muestra una vez)
6. Usa ese token como contraseña

---

## ☁️ PASO 5: CREAR CUENTA EN RAILWAY (2 minutos)

1. Ve a: https://railway.app
2. Click **"Login"**
3. Selecciona **"Login with GitHub"**
4. Autoriza Railway a acceder a tu GitHub
5. ¡Listo! Railway está conectado

---

## 🚂 PASO 6: CREAR PROYECTO EN RAILWAY (10 minutos)

### **6.1 Desplegar desde GitHub**

1. En Railway dashboard, click **"New Project"**
2. Selecciona **"Deploy from GitHub repo"**
3. Si no ves tus repos, click **"Configure GitHub App"**
4. Autoriza acceso a tu repositorio `wanted-roleplay-panel`
5. Selecciona el repo `wanted-roleplay-panel`
6. Railway detectará automáticamente que es Node.js
7. Click **"Deploy Now"**

Verás que empieza a construir (build)...

### **6.2 Agregar MySQL**

1. En tu proyecto, click **"New"** (botón morado)
2. Selecciona **"Database"**
3. Click **"Add MySQL"**
4. Railway creará una base de datos automáticamente
5. Espera ~30 segundos hasta que esté lista

### **6.3 Copiar credenciales de MySQL**

1. Click en el servicio **"MySQL"**
2. Ve a la pestaña **"Variables"**
3. Verás estas variables, cópialas:
   ```
   MYSQLHOST
   MYSQLPORT
   MYSQLUSER
   MYSQLPASSWORD
   MYSQLDATABASE
   ```

También puedes ir a **"Connect"** y copiar la cadena de conexión completa.

---

## ⚙️ PASO 7: CONFIGURAR VARIABLES DE ENTORNO (5 minutos)

1. Click en tu servicio de **Node.js** (el que dice "wanted-roleplay-panel")
2. Ve a la pestaña **"Variables"**
3. Click **"New Variable"**
4. Agrega una por una:

```env
DB_HOST = (pega el valor de MYSQLHOST)
DB_USER = (pega el valor de MYSQLUSER)
DB_PASSWORD = (pega el valor de MYSQLPASSWORD)
DB_NAME = (pega el valor de MYSQLDATABASE)
DB_PORT = (pega el valor de MYSQLPORT)

DISCORD_BOT_TOKEN = tu_token_real_del_bot
DISCORD_CLIENT_ID = tu_client_id_de_discord
DISCORD_CLIENT_SECRET = tu_client_secret_de_discord

SESSION_SECRET = genera_una_clave_aleatoria_segura

PORT = 3000
NODE_ENV = production
```

### **Generar SESSION_SECRET seguro:**

En PowerShell local:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copia el resultado y úsalo como `SESSION_SECRET`.

### **DISCORD_CALLBACK_URL:**

Después de desplegar, Railway te dará una URL como:
```
https://wanted-roleplay-production.up.railway.app
```

Entonces agrega:
```
DISCORD_CALLBACK_URL = https://TU-URL-DE-RAILWAY.up.railway.app/auth/discord/callback
```

**IMPORTANTE:** También debes actualizar esta URL en tu Discord Developer Portal:
1. Ve a https://discord.com/developers/applications
2. Selecciona tu aplicación
3. OAuth2 → Redirects
4. Agrega: `https://TU-URL-DE-RAILWAY.up.railway.app/auth/discord/callback`

---

## 📊 PASO 8: IMPORTAR BASE DE DATOS (5 minutos)

Ahora necesitas copiar tu base de datos local a Railway:

### **8.1 Exportar base de datos local**

En PowerShell local:
```powershell
# Navega a tu carpeta
cd C:\Users\Ivan\Desktop\test

# Exportar base de datos
mysqldump -u root -p wanted_roleplay > backup.sql
```

Te pedirá la contraseña de MySQL local (si tienes).

### **8.2 Importar a Railway**

Usa las credenciales que copiaste de Railway:

```powershell
# Formato:
mysql -h RAILWAY_HOST -P RAILWAY_PORT -u RAILWAY_USER -p RAILWAY_DATABASE < backup.sql

# Ejemplo real:
mysql -h containers-us-west-123.railway.app -P 7856 -u root -p railway < backup.sql
```

Te pedirá la contraseña (usa `MYSQLPASSWORD` de Railway).

**Si no tienes MySQL en tu PC local:**
Puedes usar Railway CLI o conectarte desde MySQL Workbench.

---

## 🌐 PASO 9: OBTENER TU URL (1 minuto)

1. En tu servicio Node.js en Railway
2. Ve a la pestaña **"Settings"**
3. Sección **"Networking"**
4. Click **"Generate Domain"**
5. Railway generará algo como:
   ```
   https://wanted-roleplay-production.up.railway.app
   ```

**¡Esa es tu URL pública!** 🎉

---

## ✅ PASO 10: VERIFICAR QUE FUNCIONA (2 minutos)

1. Abre tu URL de Railway en el navegador
2. Deberías ver tu panel de Wanted Roleplay
3. Intenta iniciar sesión con Discord
4. Verifica que las estadísticas cargan
5. Prueba el verificador de Discord

### **Ver logs en tiempo real:**

En Railway → Tu servicio Node.js → Pestaña **"Logs"**

Aquí verás todos los console.log() de tu aplicación.

---

## 🔄 PASO 11: ACTUALIZAR TU PROYECTO (futuro)

Cada vez que hagas cambios:

```powershell
# Navega a tu proyecto
cd C:\Users\Ivan\Desktop\test

# Ver cambios
git status

# Agregar cambios
git add .

# Commit con mensaje descriptivo
git commit -m "Descripción de los cambios"

# Subir a GitHub
git push
```

**Railway detectará el push automáticamente y desplegará la nueva versión en ~2 minutos.**

---

## 📊 MONITOREO Y MANTENIMIENTO

### **Ver uso de recursos:**
Railway → Tu proyecto → Pestaña **"Metrics"**
- CPU
- RAM
- Ancho de banda
- Créditos usados

### **Ver logs:**
Railway → Servicio → Pestaña **"Logs"**

### **Reiniciar servicio:**
Railway → Servicio → ⋯ (tres puntos) → "Restart"

### **Créditos:**
- $5 USD gratis al mes
- Suficiente para ~500 horas/mes
- 500 horas = 20+ días 24/7
- Renueva cada mes

---

## 🔒 SEGURIDAD

### **✅ Buenas prácticas:**

1. **Variables sensibles:**
   - ✅ Nunca subas `.env` a GitHub
   - ✅ Usa variables de entorno en Railway
   - ✅ Cambia `SESSION_SECRET` regularmente

2. **Credenciales:**
   - ✅ Usa tokens de Discord regenerables
   - ✅ No compartas credenciales de BD
   - ✅ Habilita 2FA en GitHub y Discord

3. **Backups:**
   - ✅ Exporta BD regularmente
   - ✅ Guarda backups en lugar seguro
   - ✅ Documenta cambios importantes

---

## ❓ SOLUCIÓN DE PROBLEMAS

### **Error: "Build failed"**
- Revisa logs en Railway
- Verifica que `package.json` tenga `"start": "node server.js"`
- Verifica que todas las dependencias estén en `package.json`

### **Error: "Cannot connect to database"**
- Verifica variables de entorno (DB_HOST, DB_USER, etc.)
- Verifica que MySQL esté corriendo en Railway
- Revisa logs para ver error específico

### **Error: "Discord bot not starting"**
- Verifica `DISCORD_BOT_TOKEN` es correcto
- Ve a Discord Developer Portal → Bot → Reset Token si es necesario
- Revisa que el bot esté invitado a tu servidor

### **Error: "Session not working"**
- Verifica tabla `sessions` existe en BD
- Verifica `SESSION_SECRET` está configurado
- Verifica `DISCORD_CALLBACK_URL` es correcto

### **La app se reinicia constantemente:**
- Revisa logs para ver el error
- Puede ser error de conexión a BD
- Puede ser puerto incorrecto (debe usar `process.env.PORT`)

---

## 📱 COMPARTIR CON TUS AMIGOS

Una vez todo funcione:

```
🎮 WANTED ROLEPLAY - STAFF PANEL

🌐 Link: https://wanted-roleplay-production.up.railway.app

📱 Instrucciones:
1. Abre el link
2. Click en "Iniciar Sesión con Discord"
3. Autoriza la aplicación
4. Espera aprobación de administrador

⚡ Está alojado en Railway (24/7 disponible)
🔒 Conexión segura con HTTPS
```

---

## 🎯 RESUMEN CHECKLIST

Antes de marcar como terminado:

- [ ] Git instalado y configurado
- [ ] Repositorio creado en GitHub
- [ ] Código subido a GitHub (`git push`)
- [ ] Cuenta Railway creada y conectada
- [ ] Proyecto desplegado en Railway
- [ ] MySQL agregado en Railway
- [ ] Variables de entorno configuradas
- [ ] Base de datos importada
- [ ] URL generada y funcionando
- [ ] Discord OAuth callback actualizado
- [ ] Probado inicio de sesión
- [ ] Probado funcionalidades principales
- [ ] Compartido con equipo de staff

---

## 🎊 ¡FELICIDADES!

Tu panel ya está en línea 24/7 y accesible desde internet con HTTPS.

**Ventajas de Railway:**
- ✅ Deploy automático con `git push`
- ✅ HTTPS incluido
- ✅ MySQL administrado
- ✅ Logs en tiempo real
- ✅ Escalable si crece tu servidor
- ✅ $5 gratis/mes renovables

**Próximos pasos opcionales:**
- Configurar dominio personalizado
- Configurar alertas de monitoreo
- Configurar backups automáticos
- Agregar más funcionalidades

---

¿Necesitas ayuda en algún paso? ¡Pregunta! 🚀
