# 🚀 GUÍA RÁPIDA DE USO - VERIFICADOR DE DISCORD

## 📋 ¿Qué hace esta nueva funcionalidad?

El **Verificador de Discord** te permite analizar cualquier usuario de Discord para verificar si es confiable o sospechoso. ¡Perfecto para administrar tu servidor de roleplay!

---

## 🎯 CÓMO USARLO

### Paso 1: Acceder al verificador
1. Inicia sesión en el panel de staff
2. Ve al **Dashboard**
3. Busca el botón **"Verificar Usuario"** con el icono de Discord (color morado)
4. Haz click en él

### Paso 2: Obtener el ID de Discord
Para verificar un usuario, necesitas su ID de Discord:

1. **En Discord**, ve a `Ajustes de Usuario` → `Avanzado`
2. Activa el **"Modo Desarrollador"**
3. Haz **click derecho** en el usuario que quieres verificar
4. Selecciona **"Copiar ID"**
5. El ID se copiará a tu portapapeles (es un número largo como `123456789012345678`)

### Paso 3: Verificar el usuario
1. Pega el ID en el campo de texto
2. Haz click en **"Verificar"**
3. Espera unos segundos mientras se busca la información
4. ¡Listo! Verás toda la información del usuario

---

## 📊 ¿QUÉ INFORMACIÓN OBTIENES?

### 👤 Información del Perfil
- **Avatar y banner** del usuario
- **Nombre de usuario** y nombre para mostrar
- **ID de Discord** (puedes copiarlo con un botón)
- **Fecha de creación** de la cuenta
- **Antigüedad** (cuántos días/años tiene la cuenta)

### 🏆 Insignias
Si el usuario tiene insignias especiales, las verás:
- 👑 Staff de Discord
- 🤝 Discord Partner
- ✅ Bot Verificado
- 🐛 Bug Hunter
- ⭐ Early Supporter
- ⚙️ Verified Developer
- Y más...

### 🔍 Análisis de Seguridad
El sistema evalúa automáticamente el nivel de riesgo:

#### 🟢 BAJO RIESGO (Verde)
- Cuenta antigua (más de 90 días)
- Está en servidores en común
- Tiene buena reputación
- **Acción**: Confiable ✅

#### 🟡 RIESGO MEDIO (Amarillo)
- Cuenta nueva (30-90 días)
- No está en servidores en común
- Bot sin verificar
- **Acción**: Precaución ⚠️

#### 🔴 ALTO RIESGO (Rojo)
- Cuenta muy nueva (menos de 30 días)
- Bot no verificado
- Actividad sospechosa
- **Acción**: ¡Cuidado! ❌

### ⚠️ Advertencias
El sistema te mostrará advertencias automáticas si detecta:
- Cuenta muy nueva
- Sin servidores en común
- Bot no verificado
- Otros comportamientos sospechosos

---

## 🛡️ DETECCIÓN DE SERVIDORES DE HACKS

El verificador también puede detectar si un usuario está en servidores conocidos de hacks de FiveM.

### ¿Cómo funciona?
El bot busca automáticamente si el usuario está en servidores con nombres como:
- "hack"
- "cheat"
- "exploit"
- Servidores en la lista negra

### ¿Qué hago si detecta algo?
Si el usuario está en servidores de hacks:
- ❌ **Rechaza** su solicitud de entrada
- 🔍 **Investiga más** antes de aceptarlo
- 📝 **Documenta** la razón del rechazo
- ⚠️ **Comparte** con otros admins

---

## 💡 CASOS DE USO

### 1. Proceso de Whitelist
- Usuario solicita entrar al servidor
- Verificas su Discord antes de aprobar
- Si es cuenta nueva (menos de 30 días) → Rechazar o pedir más información
- Si está en servidores de hacks → Rechazar automáticamente

### 2. Investigación de reportes
- Un jugador reporta a otro por hack
- Verificas el Discord del reportado
- Si está en servidores de hacks → Evidencia adicional
- Documentas todo en el panel

### 3. Revisión de Staff
- Alguien aplica para staff
- Verificas su antigüedad en Discord
- Cuentas muy nuevas son sospechosas
- Priorizas usuarios con cuentas antiguas

### 4. Seguridad del servidor
- Verificas periódicamente a miembros del staff
- Detectas si alguien se une a servidores sospechosos
- Tomas medidas preventivas

---

## 🎨 CARACTERÍSTICAS DEL DISEÑO

### Modales Elegantes
- **Centrados en la pantalla** para mejor visualización
- **Tema oscuro** consistente con el panel
- **Animaciones suaves** al abrir/cerrar
- **Efectos de brillo** para resaltar información importante

### Colores de Riesgo
- 🟢 **Verde**: Todo bien
- 🟡 **Amarillo**: Ten cuidado
- 🔴 **Rojo**: ¡Peligro!

### Badges y Etiquetas
Toda la información está organizada con badges de colores:
- **Verde**: Información positiva
- **Rojo**: Información negativa
- **Azul**: Información neutra
- **Amarillo**: Advertencias

---

## ⌨️ ATAJOS DE TECLADO

- **Enter**: Confirmar verificación
- **Escape**: Cerrar modal
- **Tab**: Navegar entre botones

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### "Usuario no encontrado"
- ✅ Verifica que el ID sea correcto
- ✅ Asegúrate de copiar el ID completo
- ✅ El usuario debe existir en Discord
- ✅ El bot debe tener acceso al usuario

### "Error al verificar usuario"
- ✅ Verifica tu conexión a internet
- ✅ Recarga la página
- ✅ Verifica que el bot de Discord esté conectado
- ✅ Revisa la consola para más detalles

### No muestra servidores en común
- ✅ Es normal si el usuario no está en tus servidores
- ✅ El bot solo puede ver servidores donde ambos están
- ✅ No es necesariamente malo

---

## 📱 RESPONSIVE DESIGN

El verificador funciona perfecto en:
- 💻 **Desktop**: Vista completa con toda la información
- 📱 **Tablet**: Diseño adaptado
- 📱 **Móvil**: Optimizado para pantallas pequeñas

---

## 🎯 MEJORES PRÁCTICAS

### ✅ HAZ ESTO:
- Verifica **siempre** antes de whitelist
- Documenta tus decisiones
- Comparte información con el team
- Usa el nivel de riesgo como guía
- Considera el contexto completo

### ❌ NO HAGAS ESTO:
- No rechaces solo por cuenta nueva (puede ser legítimo)
- No compartas información sensible públicamente
- No abuses de la verificación (respeta privacidad)
- No ignores advertencias de alto riesgo

---

## 📈 ESTADÍSTICAS

Cada vez que verificas un usuario, se registra en:
- **Registro de actividad** del panel
- **Logs del servidor** para auditoría
- **Base de datos** para historial

Puedes ver tu actividad en la página **"Actividad"** del panel.

---

## 🎉 ¡DISFRUTA LA NUEVA FUNCIONALIDAD!

Esta herramienta te ayudará a:
- ✅ Mantener tu servidor seguro
- ✅ Detectar usuarios sospechosos
- ✅ Tomar decisiones informadas
- ✅ Proteger a tu comunidad

**¿Preguntas? ¿Sugerencias?**
Contacta con el equipo de desarrollo para más ayuda.

---

## 🚀 ACCESO RÁPIDO

**URL del Panel**: http://localhost:3000

**Ruta directa**: Dashboard → Accesos Rápidos → Verificar Usuario

**Función JavaScript**: `checkDiscordUser()`

---

*Verificador de Discord - Wanted Roleplay © 2025*
*Tu seguridad es nuestra prioridad* 🛡️
