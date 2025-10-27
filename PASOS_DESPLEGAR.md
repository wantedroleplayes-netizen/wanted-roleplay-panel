# 🚀 PASOS PARA DESPLEGAR - SIGUE ESTO

## ✅ CHECKLIST - Marca cada paso cuando lo completes

---

## PASO 1: INSTALAR GIT (5 minutos)

Se abrió la página de descarga de Git en tu navegador.

### Instrucciones:
1. ✅ Click en "Click here to download" (64-bit Git for Windows Setup)
2. ✅ Ejecuta el instalador descargado
3. ✅ Click "Next" en todas las pantallas (configuración por defecto está bien)
4. ✅ Cuando termine, CIERRA PowerShell y abre uno NUEVO
5. ✅ En el PowerShell nuevo, ejecuta: `git --version`
6. ✅ Deberías ver: `git version 2.x.x`

**IMPORTANTE:** Debes cerrar y abrir PowerShell nuevo para que Git funcione.

---

## PASO 2: CONFIGURAR GIT (1 minuto)

Después de instalar Git, ejecuta estos comandos en PowerShell:

```powershell
# Tu nombre (cambia "Tu Nombre" por tu nombre real)
git config --global user.name "Tu Nombre"

# Tu email (usa el mismo que usarás en GitHub)
git config --global user.email "tu@email.com"

# Verificar
git config --list
```

---

## PASO 3: CREAR CUENTA EN GITHUB (3 minutos)

Si no tienes cuenta:

1. ✅ Ve a: https://github.com/signup
2. ✅ Ingresa tu email
3. ✅ Crea una contraseña
4. ✅ Elige un username (ej: ivan-wanted-rp)
5. ✅ Verifica tu email
6. ✅ ¡Cuenta creada!

---

## PASO 4: CREAR REPOSITORIO EN GITHUB (2 minutos)

1. ✅ Ve a: https://github.com/new
2. ✅ Repository name: `wanted-roleplay-panel`
3. ✅ Description: `Panel de gestión de staff para Wanted Roleplay`
4. ✅ Selecciona: **Private** (recomendado)
5. ✅ NO marques ninguna opción adicional
6. ✅ Click **"Create repository"**
7. ✅ COPIA la URL que aparece, algo como:
   ```
   https://github.com/TU_USUARIO/wanted-roleplay-panel.git
   ```

---

## PASO 5: SUBIR CÓDIGO A GITHUB (3 minutos)

Abre PowerShell en tu carpeta del proyecto y ejecuta:

```powershell
# Asegúrate de estar en la carpeta correcta
cd C:\Users\Ivan\Desktop\test

# Inicializar Git
git init

# Ver qué archivos se van a subir
git status

# Agregar todos los archivos
git add .

# Crear commit
git commit -m "Initial commit - Wanted Roleplay Staff Panel"

# Cambiar rama a main
git branch -M main

# Conectar con GitHub (CAMBIA LA URL por la que copiaste)
git remote add origin https://github.com/TU_USUARIO/wanted-roleplay-panel.git

# Subir a GitHub
git push -u origin main
```

**Si pide usuario/contraseña:**
- Usuario: Tu username de GitHub
- Contraseña: Necesitas crear un Personal Access Token

### Crear Personal Access Token:
1. GitHub → Settings (esquina superior derecha) → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token (classic)
4. Name: "Railway Deploy"
5. Marca: ✅ repo (todos los sub-items)
6. Generate token
7. **COPIA EL TOKEN** (solo se muestra una vez)
8. Usa ese token como contraseña

---

## PASO 6: RAILWAY - CREAR CUENTA (1 minuto)

1. ✅ Ve a: https://railway.app
2. ✅ Click **"Login"**
3. ✅ Click **"Login with GitHub"**
4. ✅ Autoriza Railway
5. ✅ ¡Listo!

---

## PASO 7: RAILWAY - DESPLEGAR PROYECTO (5 minutos)

### 7.1 Crear proyecto
1. ✅ En Railway, click **"New Project"**
2. ✅ Click **"Deploy from GitHub repo"**
3. ✅ Si no ves tu repo, click "Configure GitHub App"
4. ✅ Autoriza acceso al repo `wanted-roleplay-panel`
5. ✅ Selecciona el repo
6. ✅ Railway empezará a construir automáticamente

### 7.2 Agregar MySQL
1. ✅ En tu proyecto, click **"New"** (botón morado arriba)
2. ✅ Click **"Database"**
3. ✅ Click **"Add MySQL"**
4. ✅ Espera ~30 segundos

### 7.3 Copiar credenciales MySQL
1. ✅ Click en el cuadro **"MySQL"**
2. ✅ Click en pestaña **"Variables"**
3. ✅ COPIA estos valores (los necesitarás):
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`

---

## PASO 8: CONFIGURAR VARIABLES DE ENTORNO (5 minutos)

1. ✅ Click en tu servicio **Node.js** (wanted-roleplay-panel)
2. ✅ Click en pestaña **"Variables"**
3. ✅ Click **"New Variable"** y agrega cada una:

```
DB_HOST = (pega MYSQLHOST)
DB_USER = (pega MYSQLUSER)
DB_PASSWORD = (pega MYSQLPASSWORD)
DB_NAME = (pega MYSQLDATABASE)
DB_PORT = (pega MYSQLPORT)

DISCORD_BOT_TOKEN = (tu token del bot de Discord)
DISCORD_CLIENT_ID = (tu client ID de Discord)
DISCORD_CLIENT_SECRET = (tu client secret de Discord)

SESSION_SECRET = (genera una clave aleatoria - ver abajo)

PORT = 3000
NODE_ENV = production
```

### Generar SESSION_SECRET:
En PowerShell local:
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copia el resultado y úsalo como SESSION_SECRET.

---

## PASO 9: ACTUALIZAR DISCORD CALLBACK (2 minutos)

1. ✅ En Railway, en tu servicio Node.js, ve a **"Settings"**
2. ✅ Sección **"Networking"** → Click **"Generate Domain"**
3. ✅ Copia la URL generada (ej: `https://wanted-roleplay-production.up.railway.app`)
4. ✅ Agrega variable en Railway:
   ```
   DISCORD_CALLBACK_URL = https://TU-URL.up.railway.app/auth/discord/callback
   ```

5. ✅ Ve a: https://discord.com/developers/applications
6. ✅ Selecciona tu aplicación
7. ✅ OAuth2 → Redirects
8. ✅ Click "Add Redirect"
9. ✅ Pega: `https://TU-URL.up.railway.app/auth/discord/callback`
10. ✅ Click "Save Changes"

---

## PASO 10: EXPORTAR BASE DE DATOS LOCAL (3 minutos)

En PowerShell:

```powershell
# Navega a tu carpeta
cd C:\Users\Ivan\Desktop\test

# Exportar base de datos (cambia 'root' si tu usuario es diferente)
mysqldump -u root -p wanted_roleplay > backup.sql
```

Te pedirá la contraseña de MySQL (si tienes).

---

## PASO 11: IMPORTAR A RAILWAY (2 minutos)

Usa las credenciales de Railway que copiaste:

```powershell
# Formato:
mysql -h TU_MYSQLHOST -P TU_MYSQLPORT -u TU_MYSQLUSER -p TU_MYSQLDATABASE < backup.sql

# Cuando te pida password, ingresa TU_MYSQLPASSWORD
```

**Ejemplo real:**
```powershell
mysql -h containers-us-west-123.railway.app -P 7856 -u root -p railway < backup.sql
```

---

## PASO 12: VERIFICAR QUE FUNCIONA (2 minutos)

1. ✅ En Railway, ve a la pestaña **"Deployments"**
2. ✅ Espera a que diga **"SUCCESS"** (puede tardar 2-3 minutos)
3. ✅ Ve a la pestaña **"Logs"** para ver si hay errores
4. ✅ Abre tu URL de Railway en el navegador
5. ✅ ¡Deberías ver tu panel funcionando!

---

## 🎉 ¡LISTO!

Si llegaste hasta aquí, tu panel ya está en línea 24/7.

### Compartir con amigos:
```
https://TU-URL.up.railway.app
```

### Para actualizar en el futuro:
```powershell
git add .
git commit -m "Descripción del cambio"
git push
```

Railway desplegará automáticamente.

---

## 🆘 SI ALGO FALLA

### Error en el deploy:
- ✅ Revisa los **Logs** en Railway
- ✅ Verifica que todas las variables estén configuradas
- ✅ Verifica que `package.json` tenga `"start": "node server.js"`

### No se conecta a la base de datos:
- ✅ Verifica variables DB_* estén correctas
- ✅ Verifica que MySQL esté running en Railway
- ✅ Intenta reimportar la base de datos

### Discord login no funciona:
- ✅ Verifica DISCORD_CALLBACK_URL
- ✅ Verifica que la URL esté agregada en Discord Developer Portal
- ✅ Verifica tokens de Discord

---

**¿Dónde estás ahora?** Dime en qué paso estás y te ayudo. 😊
