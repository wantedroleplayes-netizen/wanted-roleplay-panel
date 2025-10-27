# 🎮 GUÍA DE USO - PANEL DE STAFF MEJORADO

## 📋 Índice
1. [Inicio de Sesión](#inicio-de-sesión)
2. [Dashboard](#dashboard)
3. [Registrar Donación](#registrar-donación)
4. [Exportar Datos](#exportar-datos)
5. [Búsqueda Avanzada](#búsqueda-avanzada)
6. [Atajos de Teclado](#atajos-de-teclado)

---

## 🔐 Inicio de Sesión

1. Accede a `http://localhost:3000`
2. Click en **"Iniciar Sesión con Discord"**
3. Autoriza la aplicación en Discord
4. Serás redirigido automáticamente al Dashboard

**Mensaje de bienvenida** aparecerá automáticamente ✨

---

## 📊 Dashboard

### Estadísticas en Tiempo Real
- Se actualizan automáticamente cada 30 segundos
- Notificación sutil cuando se actualizan
- Cards animadas al pasar el mouse

### Actividad Reciente
- Muestra las últimas 10 acciones del staff
- Iconos codificados por color según tipo de acción
- Tiempo relativo ("hace 5 minutos")

---

## 💰 Registrar Donación

### Paso 1: Abrir Formulario
- Click en **"Registrar Donación"**
- Animación de entrada suave

### Paso 2: Llenar Datos
**Campos Obligatorios:**
- ✅ Nombre del Donador
- ✅ Monto (mayor a $0)

**Campos Opcionales:**
- ID del Jugador
- Método de Pago
- ID de Transacción
- Mensaje del Donador
- Notas internas

### Paso 3: Guardar
- Click en **"Guardar Donación"**
- Se mostrará loading animado
- Confirmación con todos los detalles
- Automáticamente cierra el formulario

### Validaciones Automáticas:
- ❌ Monto no puede ser 0 o negativo
- ❌ Nombre del donador es obligatorio
- ✅ Mensajes claros de error si falta algo

---

## 📤 Exportar Datos

### Exportar Donaciones a CSV
1. Ve a la vista de **Donaciones**
2. (Opcional) Filtra los datos que quieres exportar
3. Click en **"Exportar CSV"**
4. El archivo se descarga automáticamente con la fecha actual
5. Nombre del archivo: `donaciones_2025-10-27.csv`

### Formato del CSV:
```csv
ID,Donador,ID Jugador,Monto,Método de Pago,ID Transacción,Mensaje,Registrado por,Fecha
1,Juan Pérez,12345,50.00,PayPal,TXN123,Gracias,admin,27/10/2025 14:30
```

**Compatibilidad:**
- ✅ Excel
- ✅ Google Sheets
- ✅ LibreOffice Calc
- ✅ Cualquier editor de texto

---

## 🔍 Búsqueda Avanzada

### Búsqueda en Tiempo Real
- Escribe en el campo de búsqueda
- Los resultados se filtran automáticamente
- Espera 500ms después de dejar de escribir
- No satura el servidor

### Búsqueda por Enter
- Escribe tu búsqueda
- Presiona **Enter**
- Resultados inmediatos

### Filtros por Método de Pago
1. Despliega el selector de método
2. Selecciona: PayPal, Stripe, etc.
3. Los resultados se filtran automáticamente

### Limpiar Búsqueda
- Click en **"Ver Todas"**
- Vuelve a mostrar todos los registros

---

## ⌨️ Atajos de Teclado

| Acción | Atajo |
|--------|-------|
| Buscar | `Enter` en campo de búsqueda |
| Cerrar modal | `Esc` |
| Confirmar acción | `Enter` en SweetAlert |
| Cancelar acción | `Esc` en SweetAlert |

---

## 💡 Tips y Trucos

### 1. **Ver Detalles Completos**
- Click en el icono 👁️ (ojo) en cualquier registro
- Se abre un modal con TODA la información
- Diseño elegante con secciones codificadas por color

### 2. **Eliminar con Seguridad**
- Click en el icono 🗑️ (papelera)
- Aparece confirmación con preview
- Muestra qué vas a eliminar
- **Advertencia clara**: "No se puede deshacer"
- Solo se elimina si confirmas

### 3. **Estadísticas Detalladas**
- En la vista de Donaciones
- Monto total, promedio, máxima, mínima
- Desglose por método de pago
- Todo en tiempo real

### 4. **Copiar al Portapapeles**
- Próximamente: Click en IDs para copiar
- Notificación de confirmación

---

## 🎨 Elementos Visuales

### Colores del Sistema:
- 🟢 **Verde (#00ff88)**: Éxito, acciones positivas
- 🔴 **Rojo (#ff4444)**: Error, eliminaciones, peligro
- 🔵 **Azul (#00aaff)**: Información, actualizaciones
- 🟡 **Amarillo (#ffaa00)**: Advertencias, pendientes

### Iconos:
- ⛔ **Ban**: Baneos
- 🔒 **Lock**: Jail
- 🕵️ **Detective**: Hackers
- 💸 **Refund**: Devoluciones
- 💎 **Diamond**: Donaciones
- 💬 **Chat**: Chat interno
- 📊 **Stats**: Actividad

---

## ⚠️ Advertencias Importantes

### Al Eliminar Registros:
1. **Siempre aparece confirmación**
2. **Muestra preview del registro**
3. **Texto en rojo**: "No se puede deshacer"
4. **Requiere confirmación explícita**

### Mensajes de Error:
- 🔴 Aparecen en rojo
- 📝 Explican claramente qué salió mal
- 💡 Dan sugerencias de solución

### Loading States:
- ⏳ Spinner animado durante operaciones
- 🚫 No puedes cerrar haciendo click fuera
- ⏸️ Previenen doble-submit

---

## 🐛 Solución de Problemas

### No puedo registrar una donación
**Verifica:**
- ✅ Nombre del donador no está vacío
- ✅ Monto es mayor a 0
- ✅ Estás conectado a internet
- ✅ El servidor está corriendo

### La búsqueda no funciona
**Verifica:**
- ✅ Escribe al menos 3 caracteres
- ✅ Presiona Enter o espera 500ms
- ✅ Los datos existen en la base de datos

### No aparece el mensaje de bienvenida
**Es normal si:**
- ⏱️ Ya cerraste el mensaje
- 🔄 Refresca la página para verlo de nuevo

### Los datos no se actualizan
**Solución:**
- 🔄 Click en "Ver Todas" o "Sincronizar"
- ⏰ Espera 30 segundos para actualización automática
- 🔃 Refresca la página si persiste

---

## 🎯 Mejores Prácticas

### Al Registrar Donaciones:
1. ✅ Siempre incluye el monto exacto
2. ✅ Agrega ID de transacción si está disponible
3. ✅ Usa el método de pago correcto
4. ✅ Incluye mensaje del donador si lo hay
5. ✅ Agrega notas internas relevantes

### Al Buscar:
1. 🔍 Usa términos específicos
2. 📅 Filtra por fecha si es necesario
3. 💳 Usa filtros de método de pago
4. 📊 Exporta antes de limpiar filtros

### Al Exportar:
1. 📁 Filtra primero si no quieres todo
2. 💾 Descarga inmediatamente
3. 📋 Verifica el contenido del CSV
4. 🔒 Guarda en lugar seguro

---

## 📞 Soporte

Si tienes problemas:
1. 📖 Revisa esta guía
2. 🔍 Busca en la documentación
3. 💬 Pregunta en el chat del staff
4. 🐛 Reporta bugs al administrador

---

## 🎉 ¡Disfruta tu Panel!

Ahora tienes:
- ✨ Interfaz elegante y moderna
- 🚀 Funcionalidades avanzadas
- 💪 Herramientas poderosas
- 🎨 Diseño intuitivo

**¡A trabajar eficientemente! 🎮**
