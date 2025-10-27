# 🚀 GUÍA DE DESPLIEGUE - Wanted Roleplay Staff Panel

## 📋 OPCIONES PARA ALOJAR TU PANEL

Tienes **4 opciones principales** para que tus amigos accedan:

---

## 🏠 **OPCIÓN 1: TU PROPIA PC (Gratis pero limitado)**

### ✅ **Ventajas:**
- Completamente gratis
- Control total
- Fácil de configurar

### ❌ **Desventajas:**
- Tu PC debe estar encendida 24/7
- Tu IP pública queda expuesta
- Velocidad de internet de tu casa limitada
- No recomendado para producción

### 📝 **Pasos:**

#### **1. Configurar puerto forwarding en tu router**
```
1. Accede a tu router (generalmente 192.168.1.1 o 192.168.0.1)
2. Busca "Port Forwarding" o "Redirección de puertos"
3. Crea una regla:
   - Puerto externo: 3000
   - Puerto interno: 3000
   - IP interna: Tu IP local (cmd → ipconfig)
   - Protocolo: TCP
```

#### **2. Obtener tu IP pública**
```powershell
# En PowerShell:
Invoke-RestMethod -Uri "https://api.ipify.org"
```

#### **3. Compartir con tus amigos**
```
http://TU_IP_PUBLICA:3000
```

#### **4. (Opcional) Usar un nombre de dominio gratis**
Servicios como **DuckDNS** o **No-IP**:
- Registrate en https://www.duckdns.org
- Crea un dominio: `tuservidor.duckdns.org`
- Instala su cliente para actualizar tu IP automáticamente
- Comparte: `http://tuservidor.duckdns.org:3000`

---

## ☁️ **OPCIÓN 2: RAILWAY.APP (Recomendado - Gratis con limitaciones)**

### ✅ **Ventajas:**
- $5 USD gratis al mes
- Muy fácil de usar
- Dominio automático incluido
- SSL/HTTPS gratis
- Logs y monitoreo incluidos

### ❌ **Desventajas:**
- Solo gratis por 500 horas/mes ($5 crédito)
- Necesitas cuenta GitHub

### 📝 **Pasos detallados:**

#### **1. Preparar tu proyecto**

Crea un archivo `.env` con tus configuraciones:
```bash
# .env
DB_HOST=tu-base-datos.railway.app
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=wanted_roleplay
DISCORD_BOT_TOKEN=tu_token
SESSION_SECRET=una_clave_secreta_aleatoria
PORT=3000
```

Asegúrate de que tu `package.json` tenga:
```json
{
  "scripts": {
    "start": "node app.js"
  },
  "engines": {
    "node": "18.x"
  }
}
```

#### **2. Subir a GitHub**
```powershell
# Si no tienes git configurado:
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/wanted-roleplay.git
git push -u origin main
```

#### **3. Desplegar en Railway**
1. Ve a https://railway.app
2. Registrate con GitHub
3. Click "New Project"
4. Selecciona "Deploy from GitHub repo"
5. Autoriza Railway a acceder a tus repos
6. Selecciona tu repositorio
7. Railway detectará automáticamente que es Node.js

#### **4. Configurar MySQL en Railway**
1. En tu proyecto, click "New" → "Database" → "Add MySQL"
2. Railway creará una base de datos automáticamente
3. Ve a la pestaña "Variables" de MySQL
4. Copia: `MYSQL_URL`, `MYSQLHOST`, `MYSQLUSER`, etc.

#### **5. Configurar variables de entorno**
En tu servicio de Node.js:
1. Click en "Variables"
2. Agrega cada variable:
   ```
   DB_HOST = valor de MYSQLHOST
   DB_USER = valor de MYSQLUSER
   DB_PASSWORD = valor de MYSQLPASSWORD
   DB_NAME = valor de MYSQLDATABASE
   DISCORD_BOT_TOKEN = tu_token
   SESSION_SECRET = clave_aleatoria
   PORT = 3000
   ```

#### **6. Importar tu base de datos**
```powershell
# Exporta tu base de datos local
mysqldump -u root -p wanted_roleplay > backup.sql

# Importa a Railway (usando los datos de conexión de Railway)
mysql -h RAILWAY_HOST -P RAILWAY_PORT -u RAILWAY_USER -p RAILWAY_DB < backup.sql
```

#### **7. Obtener tu URL**
- Railway te dará una URL como: `https://wanted-roleplay-production.up.railway.app`
- También puedes configurar un dominio personalizado

---

## 🌊 **OPCIÓN 3: RENDER.COM (Gratis para siempre pero lento)**

### ✅ **Ventajas:**
- Completamente gratis (tier gratuito permanente)
- SSL/HTTPS incluido
- Fácil de usar
- No necesita tarjeta de crédito

### ❌ **Desventajas:**
- Se "duerme" después de 15 minutos sin uso
- Tarda ~1 minuto en despertar
- 750 horas gratis al mes

### 📝 **Pasos:**

#### **1. Preparar proyecto (igual que Railway)**
- Archivo `.env` con variables
- `package.json` con script start

#### **2. Subir a GitHub**
```powershell
git init
git add .
git commit -m "Deploy to Render"
git push
```

#### **3. Desplegar en Render**
1. Ve a https://render.com
2. Registrate (gratis, sin tarjeta)
3. Click "New +" → "Web Service"
4. Conecta tu repositorio de GitHub
5. Configura:
   ```
   Name: wanted-roleplay
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   ```

#### **4. Agregar base de datos**
1. "New +" → "PostgreSQL" (gratis) o usa MySQL externo
2. Copia las credenciales
3. Agrega variables de entorno en tu Web Service

#### **5. Tu URL será:**
```
https://wanted-roleplay.onrender.com
```

---

## 🐳 **OPCIÓN 4: VPS (DigitalOcean, AWS, etc.) - Más profesional**

### ✅ **Ventajas:**
- Control total
- Siempre activo 24/7
- Buen rendimiento
- IP dedicada

### ❌ **Desventajas:**
- **Cuesta dinero** ($4-10 USD/mes)
- Requiere conocimientos de Linux
- Debes configurar todo manualmente

### 💰 **Proveedores recomendados:**
- **Contabo**: €4.50/mes (4GB RAM) - https://contabo.com
- **DigitalOcean**: $6/mes (1GB RAM) - https://digitalocean.com
- **Vultr**: $6/mes - https://vultr.com
- **Hetzner**: €4.51/mes - https://hetzner.com

### 📝 **Pasos (Ubuntu 22.04):**

#### **1. Crear VPS**
- Elige Ubuntu 22.04 LTS
- Mínimo: 1GB RAM, 1 CPU
- Anota tu IP pública

#### **2. Conectar por SSH**
```powershell
# Desde PowerShell:
ssh root@TU_IP_VPS
```

#### **3. Instalar dependencias**
```bash
# Actualizar sistema
apt update && apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Instalar MySQL
apt install -y mysql-server

# Instalar PM2 (para mantener app corriendo)
npm install -g pm2

# Instalar Nginx (proxy reverso)
apt install -y nginx
```

#### **4. Configurar MySQL**
```bash
# Segurizar MySQL
mysql_secure_installation

# Crear base de datos
mysql -u root -p
```

```sql
CREATE DATABASE wanted_roleplay;
CREATE USER 'wanted_user'@'localhost' IDENTIFIED BY 'password_seguro';
GRANT ALL PRIVILEGES ON wanted_roleplay.* TO 'wanted_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### **5. Subir tu proyecto**
```bash
# En el VPS:
cd /var/www
git clone https://github.com/TU_USUARIO/wanted-roleplay.git
cd wanted-roleplay
npm install
```

#### **6. Configurar variables de entorno**
```bash
nano .env
```

Agrega:
```
DB_HOST=localhost
DB_USER=wanted_user
DB_PASSWORD=password_seguro
DB_NAME=wanted_roleplay
DISCORD_BOT_TOKEN=tu_token
SESSION_SECRET=clave_secreta
PORT=3000
```

#### **7. Importar base de datos**
```bash
mysql -u wanted_user -p wanted_roleplay < database.sql
```

#### **8. Iniciar con PM2**
```bash
pm2 start app.js --name wanted-panel
pm2 save
pm2 startup
```

#### **9. Configurar Nginx**
```bash
nano /etc/nginx/sites-available/wanted
```

Contenido:
```nginx
server {
    listen 80;
    server_name TU_IP_O_DOMINIO;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Activar:
```bash
ln -s /etc/nginx/sites-available/wanted /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### **10. (Opcional) Agregar SSL con Let's Encrypt**
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d tu-dominio.com
```

---

## 🔒 **SEGURIDAD IMPORTANTE**

### **Antes de hacer público tu panel:**

#### **1. Archivo `.gitignore`**
Crea este archivo para NO subir información sensible a GitHub:

```
# .gitignore
node_modules/
.env
*.log
.DS_Store
*.sql
sessions/
```

#### **2. Cambiar credenciales por defecto**
```javascript
// En database.js NO pongas credenciales reales:
module.exports = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'wanted_roleplay'
};
```

#### **3. SESSION_SECRET seguro**
```powershell
# Generar clave aleatoria:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Usa ese valor en `.env`:
```
SESSION_SECRET=a1b2c3d4e5f6...tu_clave_generada
```

#### **4. Variables de entorno en producción**
**NUNCA** subas `.env` a GitHub. Configúralas en:
- Railway: Variables tab
- Render: Environment tab
- VPS: archivo `.env` directo en servidor

#### **5. Firewall básico (VPS)**
```bash
# Solo permitir puertos necesarios
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw enable
```

---

## 📊 **COMPARACIÓN DE OPCIONES**

| Característica | Tu PC | Railway | Render | VPS |
|---------------|-------|---------|--------|-----|
| **Precio** | Gratis | $5/mes gratis | Gratis | $4-10/mes |
| **Configuración** | Media | Fácil | Fácil | Difícil |
| **Velocidad** | Depende | Rápido | Lento inicio | Muy rápido |
| **Uptime** | Inestable | 99.9% | 99% | 99.9% |
| **SSL/HTTPS** | No | ✅ Gratis | ✅ Gratis | Necesitas configurar |
| **Dominio** | IP pública | Incluido | Incluido | Debes comprar |
| **Ideal para** | Pruebas | Producción pequeña | Hobby | Producción seria |

---

## 🎯 **MI RECOMENDACIÓN**

### **Para empezar y probar con amigos:**
👉 **Railway.app** (Opción 2)

**Por qué:**
- Muy fácil de configurar (15 minutos)
- $5 USD gratis al mes (suficiente para 24/7)
- HTTPS automático
- Base de datos MySQL incluida
- URL bonita y compartible
- Escalable si crece

### **Si quieres gratis para siempre (con limitaciones):**
👉 **Render.com** (Opción 3)

**Por qué:**
- 100% gratis sin límite de tiempo
- Acepta que se "duerma" cuando no se usa
- Bueno para paneles de staff que no se usan 24/7

### **Si ya tienes experiencia y quieres lo mejor:**
👉 **VPS** (Opción 4)

**Por qué:**
- Control total
- Rendimiento máximo
- Puedes alojar múltiples proyectos
- Aprenderás mucho sobre servidores

---

## 🚀 **GUÍA RÁPIDA: DESPLEGAR EN RAILWAY (15 MINUTOS)**

### **Paso 1: Preparar archivos (2 min)**

Crea `.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=wanted_roleplay
DISCORD_BOT_TOKEN=tu_token_aqui
SESSION_SECRET=clave_super_secreta_aleatoria
PORT=3000
```

Crea `.gitignore`:
```
node_modules/
.env
*.log
```

### **Paso 2: Subir a GitHub (3 min)**
```powershell
git init
git add .
git commit -m "Deploy Wanted Roleplay Panel"
git branch -M main
# Crea el repo en GitHub primero
git remote add origin https://github.com/TU_USUARIO/wanted-panel.git
git push -u origin main
```

### **Paso 3: Railway (5 min)**
1. Ve a https://railway.app
2. Login con GitHub
3. "New Project" → "Deploy from GitHub"
4. Selecciona tu repo
5. "New" → "Database" → "MySQL"

### **Paso 4: Variables (3 min)**
En el servicio Node.js, pestaña Variables:
```
DB_HOST = (copia de MySQL MYSQLHOST)
DB_USER = (copia de MySQL MYSQLUSER)
DB_PASSWORD = (copia de MySQL MYSQLPASSWORD)
DB_NAME = (copia de MySQL MYSQLDATABASE)
DISCORD_BOT_TOKEN = tu_token
SESSION_SECRET = clave_aleatoria
PORT = 3000
```

### **Paso 5: Importar BD (2 min)**
```powershell
# Exporta local
mysqldump -u root wanted_roleplay > backup.sql

# Importa a Railway (usa datos de conexión de Railway)
mysql -h roundhouse.proxy.rlwy.net -P PUERTO -u root -p railway < backup.sql
```

### **Paso 6: Compartir URL (1 min)**
Railway genera: `https://tu-proyecto-production.up.railway.app`

**¡Listo! Comparte con tus amigos** 🎉

---

## ❓ **PREGUNTAS FRECUENTES**

### **P: ¿Puedo usar un dominio personalizado?**
**R:** Sí:
- **Railway/Render**: Configuración de dominio en settings
- **VPS**: Apunta tu dominio a la IP del VPS (DNS A record)

### **P: ¿Qué pasa con el bot de Discord?**
**R:** El bot debe estar corriendo. Opciones:
- Mismo servidor que el panel
- Servidor separado (recomendado para VPS)

### **P: ¿Cómo actualizo el código después de cambios?**
**R:**
- **Railway/Render**: Push a GitHub → Auto-deploy
- **VPS**: `git pull && pm2 restart wanted-panel`

### **P: ¿Puedo usar solo localhost y VPN para amigos?**
**R:** Sí, puedes usar **Tailscale** o **ZeroTier** para crear una VPN:
- Instalas en tu PC y la de tus amigos
- Acceden a tu IP privada de VPN
- Más seguro que exponer puerto al internet

---

## 📞 **SOPORTE**

Si tienes problemas:
1. **Logs en Railway/Render**: Pestaña "Logs"
2. **Logs en VPS**: `pm2 logs wanted-panel`
3. **Errores comunes**: Revisa variables de entorno primero

---

**¡Buena suerte con el despliegue!** 🚀

Si necesitas ayuda con alguna opción específica, avísame.
