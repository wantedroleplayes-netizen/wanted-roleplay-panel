# 🎮 Wanted Roleplay - Staff Panel

Panel de gestión de staff para el servidor de roleplay Wanted Roleplay. Sistema completo de administración con integración de Discord, base de datos MySQL y chat en tiempo real.

## 🚀 Características

- ✅ **Autenticación con Discord OAuth**
- ✅ **Sincronización automática de usuarios** basada en roles de Discord
- ✅ **Gestión de Baneos** con registro completo y evidencias
- ✅ **Sistema de Jail** para encarcelamientos temporales
- ✅ **Reportes de Hackers** con seguimiento de resolución
- ✅ **Gestión de Devoluciones** con estados (pendiente, aprobado, rechazado, completado)
- ✅ **Registro de Donaciones** con tracking completo
- ✅ **Chat Interno** en tiempo real para el equipo de staff
- ✅ **Logs de Actividad** para auditoría completa
- ✅ **Webhooks de Discord** para notificaciones automáticas
- ✅ **Diseño elegante** en negro y blanco
- ✅ **Búsqueda y filtrado** de registros
- ✅ **Dashboard con estadísticas** en tiempo real

## 📋 Requisitos Previos

- Node.js v16 o superior
- MySQL v5.7 o superior
- Una aplicación de Discord (Bot + OAuth)
- Un servidor de Discord con el ID del servidor y rol de staff

## 🔧 Instalación

### 1. Clonar el repositorio o copiar los archivos

### 2. Instalar dependencias

```powershell
npm install
```

### 3. Configurar la base de datos

```powershell
# Importar la estructura de base de datos
mysql -u root -p < database.sql
```

O ejecutar manualmente el archivo `database.sql` en tu cliente MySQL.

### 4. Configurar variables de entorno

Copia el archivo `.env.example` a `.env` y edita los valores:

```powershell
copy .env.example .env
```

Edita el archivo `.env` con tus credenciales:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=wanted_roleplay

DISCORD_BOT_TOKEN=tu_token_de_bot
DISCORD_CLIENT_ID=tu_client_id
DISCORD_CLIENT_SECRET=tu_client_secret
DISCORD_CALLBACK_URL=http://localhost:3000/auth/callback

DISCORD_WEBHOOK_URL=tu_webhook_url

SESSION_SECRET=una_clave_secreta_muy_segura

PORT=3000
NODE_ENV=development
```

### 5. Configurar Discord

#### Crear Bot de Discord:

1. Ve a [Discord Developer Portal](https://discord.com/developers/applications)
2. Crea una nueva aplicación
3. Ve a la sección "Bot" y crea un bot
4. Copia el token y ponlo en `DISCORD_BOT_TOKEN`
5. Activa los intents: **Server Members Intent** y **Message Content Intent**
6. Ve a OAuth2 y copia el **Client ID** y **Client Secret**
7. En OAuth2 > Redirects, añade: `http://localhost:3000/auth/callback`
8. Invita el bot a tu servidor con permisos de administrador

#### Obtener IDs:

- **Guild ID**: Ya está configurado en el código (`1125513390161395812`)
- **Role ID**: Ya está configurado en el código (`1127967840654336101`)

Si necesitas cambiarlos, edita `config/discord-bot.js`

#### Crear Webhook:

1. Ve a tu servidor de Discord
2. Settings > Integrations > Webhooks
3. Crea un nuevo webhook
4. Copia la URL y ponla en `DISCORD_WEBHOOK_URL`

### 6. Iniciar el servidor

**Modo desarrollo:**
```powershell
npm run dev
```

**Modo producción:**
```powershell
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 📚 Uso

### Acceso al Panel

1. Abre tu navegador en `http://localhost:3000`
2. Haz clic en "Iniciar sesión con Discord"
3. Autoriza la aplicación
4. Si tienes el rol de staff configurado, accederás al panel

### Funcionalidades Principales

#### Dashboard
- Vista general con estadísticas
- Actividad reciente del equipo
- Accesos rápidos a las secciones

#### Baneos
- Crear nuevo baneo con evidencias
- Búsqueda por jugador
- Filtrar por baneos activos
- Editar o eliminar registros

#### Jail
- Registrar encarcelamientos
- Liberar jugadores
- Historial completo

#### Hackers
- Reportar jugadores sospechosos
- Marcar como resuelto
- Añadir acciones tomadas

#### Devoluciones
- Crear solicitudes de devolución
- Cambiar estados (pendiente/aprobado/rechazado/completado)
- Registro de evidencias

#### Donaciones
- Registrar donaciones recibidas
- Tracking de transacciones
- Estadísticas de ingresos

#### Chat Interno
- Comunicación en tiempo real
- Historial de mensajes
- Indicador de usuario escribiendo

#### Logs de Actividad
- Auditoría completa de acciones
- Filtrar por usuario o tipo de acción
- Registro de IP y timestamps

## 🎨 Personalización

### Cambiar colores

Edita `public/css/style.css` en la sección de variables CSS:

```css
:root {
    --primary-black: #0a0a0a;
    --secondary-black: #1a1a1a;
    /* ... más variables ... */
}
```

### Cambiar nombre del servidor

Edita las vistas en la carpeta `views/` y busca "WANTED RP" o "Wanted Roleplay"

### Añadir campos personalizados

1. Añade los campos en `database.sql`
2. Actualiza los modelos en `models/`
3. Modifica las rutas en `routes/api.js`
4. Actualiza las vistas y formularios

## 🔒 Seguridad

- ✅ Autenticación mediante Discord OAuth
- ✅ Sesiones seguras con MySQL
- ✅ Rate limiting en API
- ✅ Helmet.js para headers de seguridad
- ✅ Validación de entrada con express-validator
- ✅ Solo usuarios con rol específico pueden acceder

## 📝 Scripts Disponibles

```powershell
# Iniciar servidor
npm start

# Modo desarrollo (con nodemon)
npm run dev

# Configurar base de datos (si creas este script)
npm run setup-db
```

## 🐛 Solución de Problemas

### El bot no se conecta

- Verifica que `DISCORD_BOT_TOKEN` sea correcto
- Asegúrate de que los intents estén activados en Discord Developer Portal

### Error de conexión a MySQL

- Verifica las credenciales en `.env`
- Asegúrate de que MySQL esté corriendo
- Verifica que la base de datos `wanted_roleplay` exista

### No puedo iniciar sesión

- Verifica que el `DISCORD_CALLBACK_URL` sea correcto
- Asegúrate de tener el rol configurado en Discord
- Revisa que el `GUILD_ID` y `ROLE_ID` sean correctos

### Los webhooks no se envían

- Verifica que `DISCORD_WEBHOOK_URL` sea válida
- Asegúrate de que el webhook no esté eliminado

## 🤝 Contribuir

Si deseas contribuir al proyecto:

1. Haz un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## 👨‍💻 Autor

Wanted Roleplay Staff Team

## 📞 Soporte

Para soporte, únete a nuestro servidor de Discord o abre un issue en GitHub.

---

**¡Gracias por usar Wanted Roleplay Staff Panel!** 🎮
