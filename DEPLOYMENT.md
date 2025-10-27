# 🚀 DESPLIEGUE EN PRODUCCIÓN

## Opciones de Hosting

### 1. VPS (Recomendado para control total)
- DigitalOcean Droplet
- AWS EC2
- Google Cloud Compute Engine
- Linode
- Vultr

### 2. PaaS (Más fácil)
- Heroku
- Railway.app
- Render.com
- Fly.io

### 3. Hosting Compartido
- Hostinger (con Node.js)
- A2 Hosting
- DreamHost

---

## 📋 Preparación para Producción

### 1. Configurar Variables de Entorno

Crear archivo `.env` en producción:

```env
NODE_ENV=production
PORT=3000

# Base de datos (usar servicio en la nube)
DB_HOST=tu-servidor-mysql.com
DB_USER=usuario_produccion
DB_PASSWORD=contraseña_segura
DB_NAME=wanted_roleplay

# Discord
DISCORD_BOT_TOKEN=tu_token_de_produccion
DISCORD_CLIENT_ID=tu_client_id
DISCORD_CLIENT_SECRET=tu_client_secret
DISCORD_CALLBACK_URL=https://tudominio.com/auth/callback

# Webhook
DISCORD_WEBHOOK_URL=tu_webhook_url

# Sesión (generar clave segura)
SESSION_SECRET=clave_muy_segura_y_larga_aleatoria
```

### 2. Actualizar Callback URL en Discord

En Discord Developer Portal:
1. OAuth2 > General > Redirects
2. Añadir: `https://tudominio.com/auth/callback`
3. Actualizar en `.env` de producción

### 3. Configurar Base de Datos

#### Opciones de MySQL en la nube:
- **PlanetScale** (Gratis hasta 5GB)
- **AWS RDS**
- **Google Cloud SQL**
- **DigitalOcean Managed Database**
- **Railway** (incluye MySQL)

### 4. Modificar package.json

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "setup-db": "node scripts/setup-database.js"
  },
  "engines": {
    "node": ">=16.0.0",
    "npm": ">=8.0.0"
  }
}
```

---

## 🔧 Despliegue en VPS (Ubuntu/Debian)

### 1. Conectar al servidor

```bash
ssh root@tu-servidor.com
```

### 2. Instalar dependencias

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar MySQL
sudo apt install -y mysql-server

# Instalar PM2 (gestor de procesos)
sudo npm install -g pm2

# Instalar Git
sudo apt install -y git
```

### 3. Configurar MySQL

```bash
sudo mysql_secure_installation

# Crear base de datos
sudo mysql -u root -p
```

En MySQL:
```sql
CREATE DATABASE wanted_roleplay;
CREATE USER 'wanted_user'@'localhost' IDENTIFIED BY 'contraseña_segura';
GRANT ALL PRIVILEGES ON wanted_roleplay.* TO 'wanted_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 4. Clonar proyecto

```bash
cd /var/www
git clone tu-repositorio.git staff-panel
cd staff-panel
```

### 5. Configurar proyecto

```bash
# Instalar dependencias
npm install --production

# Crear .env
nano .env
# Pegar configuración de producción

# Importar base de datos
mysql -u wanted_user -p wanted_roleplay < database.sql
```

### 6. Iniciar con PM2

```bash
# Iniciar aplicación
pm2 start server.js --name "staff-panel"

# Configurar inicio automático
pm2 startup
pm2 save

# Ver logs
pm2 logs staff-panel

# Monitorear
pm2 monit
```

### 7. Configurar Nginx (Reverse Proxy)

```bash
sudo apt install -y nginx

# Crear configuración
sudo nano /etc/nginx/sites-available/staff-panel
```

Contenido:
```nginx
server {
    listen 80;
    server_name tudominio.com www.tudominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Activar:
```bash
sudo ln -s /etc/nginx/sites-available/staff-panel /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 8. Configurar SSL con Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d tudominio.com -d www.tudominio.com
```

---

## 🌐 Despliegue en Railway.app (Fácil)

### 1. Preparar repositorio Git

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin tu-repositorio.git
git push -u origin main
```

### 2. En Railway.app

1. Crear cuenta en https://railway.app
2. New Project > Deploy from GitHub
3. Seleccionar repositorio
4. Railway detectará automáticamente Node.js

### 3. Configurar Variables de Entorno

En Railway Dashboard:
- Variables > Add Variable
- Añadir todas las variables del `.env`

### 4. Añadir MySQL

1. New > Database > Add MySQL
2. Copiar credenciales generadas
3. Actualizar variables de entorno

### 5. Importar base de datos

```bash
# Desde tu máquina local
railway login
railway link
railway run mysql -h HOST -u USER -p DATABASE < database.sql
```

---

## 🔒 Seguridad en Producción

### 1. Firewall

```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### 2. Actualizar server.js

```javascript
// En server.js, configurar para producción
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "cdn.socket.io"],
            styleSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "cdn.discordapp.com"],
            connectSrc: ["'self'", "wss:", "https:"],
        },
    },
}));

// Configurar cookie segura
app.use(session({
    // ...
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: true,  // Solo HTTPS
        httpOnly: true,
        sameSite: 'strict'
    }
}));
```

### 3. Configurar rate limiting más estricto

```javascript
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50  // Reducir en producción
});
```

---

## 📊 Monitoreo

### PM2 Monit

```bash
pm2 monit
```

### Logs

```bash
pm2 logs staff-panel
pm2 logs staff-panel --lines 100
```

### Restart

```bash
pm2 restart staff-panel
pm2 reload staff-panel  # Sin downtime
```

---

## 🔄 Actualizaciones

### Actualizar código

```bash
cd /var/www/staff-panel
git pull origin main
npm install --production
pm2 reload staff-panel
```

### Backup de base de datos

```bash
# Backup
mysqldump -u wanted_user -p wanted_roleplay > backup_$(date +%Y%m%d).sql

# Restaurar
mysql -u wanted_user -p wanted_roleplay < backup_20231026.sql
```

---

## ✅ Checklist de Producción

- [ ] Variables de entorno configuradas
- [ ] Base de datos en la nube o VPS
- [ ] SSL/HTTPS configurado
- [ ] Callback URL actualizado en Discord
- [ ] NODE_ENV=production
- [ ] PM2 configurado y guardado
- [ ] Nginx configurado
- [ ] Firewall activado
- [ ] Backup automático configurado
- [ ] Monitoreo configurado
- [ ] Logs rotados
- [ ] Pruebas de login realizadas
- [ ] Bot de Discord funcionando
- [ ] Webhooks funcionando

---

## 🆘 Solución de Problemas en Producción

### El servidor no inicia
```bash
pm2 logs staff-panel --err
```

### Error de conexión a MySQL
```bash
# Verificar MySQL
sudo systemctl status mysql

# Ver logs
sudo tail -f /var/log/mysql/error.log
```

### 502 Bad Gateway
```bash
# Verificar que la app esté corriendo
pm2 status

# Verificar nginx
sudo nginx -t
sudo systemctl status nginx
```

### Bot no se conecta
- Verificar que el token sea de producción
- Revisar los logs: `pm2 logs staff-panel`

---

## 📈 Rendimiento

### Optimizaciones

1. **Usar compresión**:
```javascript
const compression = require('compression');
app.use(compression());
```

2. **Cachear archivos estáticos**:
```javascript
app.use(express.static('public', {
    maxAge: '1d',
    etag: true
}));
```

3. **Configurar PM2 en cluster mode**:
```bash
pm2 start server.js -i max --name "staff-panel"
```

---

¡Tu panel de staff está listo para producción! 🎉
