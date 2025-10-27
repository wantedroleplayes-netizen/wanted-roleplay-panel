# 🐙 HOSTEAR DESDE GITHUB - Opciones y Limitaciones

## ⚠️ LIMITACIÓN IMPORTANTE

**GitHub Pages NO funciona para tu proyecto** porque:
- ❌ GitHub Pages solo sirve para sitios **estáticos** (HTML, CSS, JS)
- ❌ **NO ejecuta** código Node.js en el servidor
- ❌ **NO ejecuta** base de datos MySQL
- ❌ **NO ejecuta** tu bot de Discord

Tu proyecto necesita:
- ✅ Node.js corriendo en un servidor
- ✅ Base de datos MySQL activa
- ✅ Bot de Discord conectado
- ✅ Sesiones de usuario (Express Session)

---

## ✅ SOLUCIONES CON GITHUB

### **OPCIÓN 1: GitHub + Vercel** ⭐ (RECOMENDADO)

**Vercel** lee tu código de GitHub y lo despliega automáticamente.

#### Ventajas:
- ✅ **100% GRATIS** para proyectos personales
- ✅ Deploys automáticos cuando haces `git push`
- ✅ HTTPS gratis
- ✅ Dominio gratis (.vercel.app)
- ✅ Muy rápido

#### Limitaciones:
- ⚠️ Necesitas adaptar para usar base de datos externa (no MySQL local)
- ⚠️ Funciones serverless (diferente a servidor tradicional)

#### Pasos:

**1. Subir a GitHub**
```powershell
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/wanted-panel.git
git push -u origin main
```

**2. Conectar con Vercel**
1. Ve a https://vercel.com
2. Sign up con tu cuenta de GitHub
3. "Import Project"
4. Selecciona tu repositorio
5. Vercel detectará que es Node.js
6. Click "Deploy"

**3. Configurar variables de entorno**
En Vercel → Settings → Environment Variables:
```
DB_HOST=tu_base_datos_externa
DB_USER=usuario
DB_PASSWORD=password
DB_NAME=wanted_roleplay
DISCORD_BOT_TOKEN=tu_token
SESSION_SECRET=clave_secreta
```

**4. Base de datos**
Necesitas MySQL externo (gratis):
- **PlanetScale** (MySQL gratis): https://planetscale.com
- **Railway MySQL** (gratis $5/mes): https://railway.app
- **Clever Cloud** (512MB gratis): https://www.clever-cloud.com

---

### **OPCIÓN 2: GitHub + Railway** ⭐⭐ (MÁS RECOMENDADO)

**Railway** es PERFECTO para tu proyecto porque:
- ✅ Soporta Node.js completamente
- ✅ MySQL incluido (gratis $5/mes de crédito)
- ✅ Deploy automático desde GitHub
- ✅ HTTPS gratis
- ✅ No necesitas adaptar NADA de tu código

#### Pasos detallados:

**1. Preparar tu proyecto**

Crea archivo `.gitignore`:
```
node_modules/
.env
*.log
sessions/
```

Crea archivo `.env.example` (sin valores sensibles):
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=wanted_roleplay
DISCORD_BOT_TOKEN=
SESSION_SECRET=
PORT=3000
```

Verifica tu `package.json`:
```json
{
  "name": "wanted-roleplay-panel",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js"
  },
  "engines": {
    "node": "18.x"
  }
}
```

**2. Subir a GitHub**
```powershell
# Si no tienes git configurado:
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"

# Crear repositorio
git init
git add .
git commit -m "Wanted Roleplay Staff Panel"
git branch -M main

# Ir a GitHub.com → New Repository → "wanted-roleplay-panel"
# Copiar la URL que te dan y ejecutar:
git remote add origin https://github.com/TU_USUARIO/wanted-roleplay-panel.git
git push -u origin main
```

**3. Conectar con Railway**
1. Ve a https://railway.app
2. "Login" con GitHub
3. "New Project"
4. "Deploy from GitHub repo"
5. Autoriza Railway
6. Selecciona tu repositorio "wanted-roleplay-panel"
7. Railway detectará Node.js automáticamente

**4. Agregar MySQL**
En tu proyecto de Railway:
1. Click "New" → "Database" → "Add MySQL"
2. Railway creará una base de datos
3. Ve a la pestaña "Variables" de MySQL
4. Copia estos valores:
   - MYSQLHOST
   - MYSQLPORT
   - MYSQLUSER
   - MYSQLPASSWORD
   - MYSQLDATABASE

**5. Configurar variables en el servicio Node.js**
En tu servicio de Node.js → "Variables":
```
DB_HOST = (pega MYSQLHOST)
DB_USER = (pega MYSQLUSER)
DB_PASSWORD = (pega MYSQLPASSWORD)
DB_NAME = (pega MYSQLDATABASE)
DB_PORT = (pega MYSQLPORT)
DISCORD_BOT_TOKEN = tu_token_de_discord
SESSION_SECRET = una_clave_aleatoria_segura
PORT = 3000
```

**6. Importar tu base de datos**
```powershell
# Exportar tu base de datos local
mysqldump -u root -p wanted_roleplay > backup.sql

# Obtener credenciales de Railway (pestaña Connect)
# Importar a Railway:
mysql -h RAILWAY_HOST -P RAILWAY_PORT -u RAILWAY_USER -p RAILWAY_DB < backup.sql
```

**7. Deploy automático**
Railway desplegará automáticamente. En unos minutos tendrás:
```
https://wanted-roleplay-production.up.railway.app
```

**8. Actualizaciones automáticas**
Cada vez que hagas:
```powershell
git add .
git commit -m "Actualización"
git push
```
Railway detectará el cambio y desplegará automáticamente.

---

### **OPCIÓN 3: GitHub + Render** (Gratis para siempre)

**Render** es 100% gratis pero más lento.

#### Ventajas:
- ✅ **GRATIS para siempre**
- ✅ Deploy automático desde GitHub
- ✅ HTTPS gratis
- ✅ No necesita tarjeta de crédito

#### Desventajas:
- ⚠️ Se "duerme" después de 15 min sin uso
- ⚠️ Tarda ~1 minuto en "despertar"
- ⚠️ Más lento que Railway/Vercel

#### Pasos:

**1. Subir a GitHub** (igual que Railway)

**2. Conectar con Render**
1. Ve a https://render.com
2. Sign up con GitHub
3. "New +" → "Web Service"
4. Conecta tu repositorio
5. Configuración:
   ```
   Name: wanted-roleplay
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

**3. Agregar variables**
En "Environment" → "Add Environment Variable":
```
DB_HOST=tu_bd_externa
DB_USER=usuario
DB_PASSWORD=password
DB_NAME=wanted_roleplay
DISCORD_BOT_TOKEN=tu_token
SESSION_SECRET=clave_secreta
```

**4. Base de datos**
- Usa PostgreSQL gratuito de Render, O
- Usa MySQL externo (PlanetScale, Railway)

---

### **OPCIÓN 4: GitHub + GitHub Actions + VPS**

Si tienes un VPS (tu PC configurada como servidor o VPS de pago):

**1. GitHub Actions auto-deploy**

Crea `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Server

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Deploy to VPS
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.SERVER_IP }}
        username: ${{ secrets.SERVER_USER }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /var/www/wanted-roleplay
          git pull origin main
          npm install
          pm2 restart wanted-panel
```

**2. Configurar secrets en GitHub**
Repo → Settings → Secrets → Actions:
- `SERVER_IP`: Tu IP del servidor
- `SERVER_USER`: Usuario SSH
- `SSH_KEY`: Tu clave privada SSH

**3. Cada push actualiza automáticamente**

---

## 📊 COMPARACIÓN

| Característica | Vercel | Railway | Render | GitHub Pages |
|---------------|--------|---------|--------|--------------|
| **Precio** | Gratis | $5/mes gratis | Gratis | Gratis |
| **Node.js** | ✅ Serverless | ✅ Full | ✅ Full | ❌ No |
| **MySQL** | ❌ Externo | ✅ Incluido | ⚠️ PostgreSQL | ❌ No |
| **Deploy Auto** | ✅ | ✅ | ✅ | ✅ |
| **HTTPS** | ✅ | ✅ | ✅ | ✅ |
| **Velocidad** | ⚡⚡⚡ | ⚡⚡ | ⚡ | ⚡⚡⚡ |
| **Sleep** | ❌ No | ❌ No | ✅ Sí (15 min) | N/A |
| **Ideal para** | APIs | Full apps | Hobby | Sitios estáticos |

---

## 🎯 MI RECOMENDACIÓN FINAL

### **Para tu proyecto específico:**

**1️⃣ RAILWAY** ⭐⭐⭐⭐⭐ (MEJOR OPCIÓN)
```
✅ MySQL incluido (no necesitas externo)
✅ $5 gratis/mes (suficiente 24/7)
✅ Deploy automático desde GitHub
✅ No adaptar código
✅ HTTPS automático
✅ Logs y monitoreo
```

**2️⃣ Render + PlanetScale MySQL** ⭐⭐⭐⭐
```
✅ 100% gratis para siempre
✅ Deploy automático
⚠️ Se duerme sin uso (1 min despertar)
⚠️ MySQL externo necesario
```

**3️⃣ Tu PC + Port Forwarding** ⭐⭐
```
✅ Gratis
⚠️ PC encendida 24/7
⚠️ IP expuesta
⚠️ Configurar router
```

---

## 🚀 GUÍA RÁPIDA: RAILWAY + GITHUB (15 minutos)

### **Paso 1: Preparar proyecto (3 min)**

Verifica `package.json`:
```json
{
  "scripts": {
    "start": "node server.js"
  },
  "engines": {
    "node": "18.x"
  }
}
```

Crea `.gitignore`:
```
node_modules/
.env
*.log
```

### **Paso 2: Subir a GitHub (4 min)**
```powershell
git init
git add .
git commit -m "Deploy to Railway"
git branch -M main

# Crea repo en GitHub.com primero, luego:
git remote add origin https://github.com/TU_USUARIO/wanted-panel.git
git push -u origin main
```

### **Paso 3: Railway (5 min)**
1. https://railway.app → Login con GitHub
2. "New Project" → "Deploy from GitHub"
3. Selecciona tu repo
4. "New" → "Database" → "MySQL"
5. Espera que se cree

### **Paso 4: Variables (2 min)**
En servicio Node.js → Variables:
```
DB_HOST = (copia de MySQL)
DB_USER = (copia de MySQL)
DB_PASSWORD = (copia de MySQL)
DB_NAME = (copia de MySQL)
DISCORD_BOT_TOKEN = tu_token
SESSION_SECRET = clave_aleatoria
```

### **Paso 5: Importar BD (1 min)**
```powershell
mysqldump -u root -p wanted_roleplay > backup.sql
mysql -h RAILWAY_HOST -P PORT -u USER -p DATABASE < backup.sql
```

### **¡LISTO!** 🎉
URL: `https://wanted-roleplay-production.up.railway.app`

---

## ❓ PREGUNTAS FRECUENTES

### **¿GitHub Pages sirve para mi proyecto?**
❌ No, solo para sitios estáticos (HTML/CSS/JS sin servidor)

### **¿Necesito pagar?**
No con Render (gratis siempre) o Railway ($5 gratis/mes)

### **¿Puedo usar mi dominio?**
✅ Sí, Railway y Render permiten dominios personalizados

### **¿Se actualiza automáticamente?**
✅ Sí, cada `git push` despliega automáticamente

### **¿Qué pasa con el bot de Discord?**
✅ Se ejecuta en Railway/Render igual que local

---

## 🎊 CONCLUSIÓN

**GitHub solo** no puede hostear tu proyecto porque necesitas:
- Servidor Node.js
- Base de datos MySQL
- Bot de Discord corriendo

**GitHub + Railway/Render/Vercel** SÍ puede hospearlo:
- GitHub guarda tu código
- Railway/Render ejecuta el servidor
- Deploy automático con cada push

**¿Quieres que te ayude a configurar Railway ahora?** 🚀
