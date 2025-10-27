# 🔍 SISTEMA DE DETECCIÓN DE SERVIDORES DE HACKS - EXPLICACIÓN

## 📋 ¿Cómo funciona ahora?

### 🎯 **ANTES vs AHORA**

#### ❌ **ANTES (Limitado):**
- Solo revisaba servidores en común entre tu bot y el usuario
- Si el usuario estaba en un servidor de hacks donde tu bot NO estaba, NO lo detectaba
- Dependía de que tu bot estuviera en muchos servidores

#### ✅ **AHORA (Mejorado):**
- Revisa TODOS los servidores donde están TANTO tu bot COMO el usuario
- Analiza el nombre y descripción de cada servidor buscando palabras clave
- Detecta servidores de hacks de FiveM específicamente
- Clasifica el riesgo en 4 niveles: CRITICAL, HIGH, MEDIUM, LOW

---

## 🔎 **SISTEMA DE DETECCIÓN AVANZADO**

### **Palabras clave detectadas (40+ términos):**

#### Hacks Generales:
- `hack`, `cheat`, `esp`, `aimbot`, `wallhack`, `triggerbot`

#### Mod Menus:
- `mod menu`, `menu mod`, `executor`, `injector`, `loader`

#### FiveM Específico:
- `fivem hack`, `fivem cheat`, `fivem mod`, `fivem esp`, `fivem aimbot`
- `gta hack`, `gta cheat`, `gta mod menu`

#### Términos de Venta:
- `cheat shop`, `hack shop`, `premium cheat`, `vip cheat`, `private cheat`
- `buy cheat`, `sell cheat`, `selling`, `cheap hack`

#### Términos Técnicos:
- `exploit`, `bypass`, `undetected`, `ud`, `private hack`
- `lua executor`, `script executor`, `eulen`, `redengine`

#### Español:
- `hackear`, `trucos`, `trampas`, `mod menu español`

---

## 🎨 **NIVELES DE RIESGO DE SERVIDORES**

### 🚨 **CRITICAL (Crítico)**
**Características:**
- Servidor confirmado en lista negra de IDs conocidos
- 2+ palabras clave críticas en el nombre
- Palabras como "fivem hack", "cheat shop", etc.

**Acción:**
- Trust Score: -40 puntos
- Recomendación: RECHAZAR INMEDIATAMENTE
- Alerta visual máxima

### ⚠️ **HIGH (Alto)**
**Características:**
- 1 palabra clave crítica + otras palabras sospechosas
- Palabras como "hack", "cheat", "mod menu"
- 3+ palabras clave sospechosas

**Acción:**
- Trust Score: -30 puntos
- Recomendación: NO ACEPTAR
- Alerta visual alta

### 🟡 **MEDIUM (Medio)**
**Características:**
- 2 palabras clave sospechosas
- Términos ambiguos como "mod", "script"

**Acción:**
- Trust Score: -20 puntos
- Recomendación: INVESTIGAR MÁS
- Alerta visual media

### 🟢 **LOW (Bajo)**
**Características:**
- 1 palabra clave menor
- Podría ser falso positivo

**Acción:**
- Trust Score: -10 puntos
- Recomendación: REVISAR CONTEXTO
- Alerta visual baja

---

## 💳 **DETECCIÓN DE ROLES DE COMPRADOR**

### **Roles que se detectan:**
- `buyer`, `customer`, `purchased`, `verified buyer`
- `premium member`, `vip`, `donor`, `lifetime`, `subscribed`
- `comprador`, `cliente`, `verificado`, `premium`, `vitalicio`
- `hwid reset`, `licensed`, `active user`, `cheat user`, `hack user`

### **Penalizaciones:**
- **Rol en servidor de hacks**: -25 puntos Trust Score
- **Rol sospechoso en servidor normal**: -10 puntos Trust Score

---

## 📊 **TRUST SCORE SYSTEM (0-100)**

### **Cálculo del puntaje:**

**Base:** 50 puntos

#### ✅ **Puntos POSITIVOS:**
- Cuenta > 1 año: +30 puntos
- Cuenta 6-12 meses: +20 puntos
- Cuenta 3-6 meses: +10 puntos
- Cada insignia legítima de Discord: +5 puntos

#### ❌ **Puntos NEGATIVOS:**
- Cuenta < 7 días: -30 puntos
- Cuenta < 30 días: -20 puntos
- Servidor CRITICAL detectado: -40 puntos CADA UNO
- Servidor HIGH detectado: -30 puntos CADA UNO
- Servidor MEDIUM detectado: -20 puntos CADA UNO
- Servidor LOW detectado: -10 puntos CADA UNO
- Rol de comprador en servidor de hacks: -25 puntos CADA UNO
- Rol sospechoso: -10 puntos CADA UNO
- Bot no verificado: -15 puntos

### **Interpretación:**
- **70-100**: ✅ Usuario CONFIABLE (Verde)
- **40-69**: ⚠️ PRECAUCIÓN recomendada (Amarillo)
- **0-39**: ❌ ALTO RIESGO - NO recomendado (Rojo)

---

## 🎯 **EJEMPLOS REALES**

### **Ejemplo 1: Usuario Limpio**
```
Usuario: JohnDoe#1234
Antigüedad: 3 años
Servidores detectados: 0 sospechosos
Roles: Ninguno sospechoso

Trust Score: 80/100 ✅
Nivel de Riesgo: LOW
Recomendación: ✅ ACEPTAR
```

### **Ejemplo 2: Usuario en Servidor de Hacks**
```
Usuario: HackerBoy#5678
Antigüedad: 2 meses
Servidores detectados:
  - "FiveM Cheats Shop" (CRITICAL) 🚨
  - "Undetected Mods" (HIGH) ⚠️
Roles: 
  - "Buyer" en FiveM Cheats Shop 💳
  - "VIP Member" en Undetected Mods 💳

Trust Score: 5/100 ❌
Nivel de Riesgo: CRITICAL
Recomendación: 🚨 RECHAZAR INMEDIATAMENTE
```

### **Ejemplo 3: Usuario Sospechoso**
```
Usuario: Newbie#9999
Antigüedad: 15 días
Servidores detectados:
  - "FiveM Scripts" (LOW) 🟡
Roles: Ninguno

Trust Score: 25/100 ⚠️
Nivel de Riesgo: MEDIUM
Recomendación: ⚠️ INVESTIGAR MÁS - Cuenta nueva
```

---

## ⚙️ **LIMITACIONES ACTUALES**

### **¿Qué NO puede hacer?**
1. **No revisa servidores privados** donde tu bot no está
2. **No accede a mensajes** del usuario
3. **No revisa el historial** de nombres de usuario
4. **No usa APIs externas** de bases de datos de cheaters

### **¿Por qué estas limitaciones?**
- Discord API no permite revisar servidores donde el bot no está
- Necesitarías permisos especiales o APIs de terceros
- Protección de privacidad de Discord

---

## 🚀 **MEJORAS FUTURAS POSIBLES**

### **Con API Externa (si existiera):**
- ✅ Consultar bases de datos globales de cheaters
- ✅ Verificar en servidores sin necesidad de estar en ellos
- ✅ Historial de baneos en otros servidores de FiveM
- ✅ Reputación cross-servidor

### **Con más desarrollo:**
- ✅ Machine Learning para detectar patrones
- ✅ Integración con FiveM ban lists públicas
- ✅ Sistema de reportes compartidos entre servidores
- ✅ Verificación de Steam/CFX accounts

---

## 📝 **CÓMO INTERPRETAR LOS RESULTADOS**

### **🚨 Alerta CRÍTICA (Rojo intenso):**
```
"🚨 ALERTA MÁXIMA: SERVIDORES DE HACKS CONFIRMADOS"
- Usuario detectado en servidor de lista negra
- Múltiples palabras clave críticas
- Roles de comprador confirmados
```
**Acción:** ❌ RECHAZAR INMEDIATAMENTE

### **⚠️ Alerta ALTA (Rojo):**
```
"🚨 SERVIDORES SOSPECHOSOS DETECTADOS"
- Usuario en servidores con palabras como "hack", "cheat"
- Roles sospechosos de comprador
```
**Acción:** ⚠️ NO ACEPTAR, investigar si hay dudas

### **🟡 Alerta MEDIA (Amarillo):**
```
"⚠️ ROLES SOSPECHOSOS DETECTADOS"
- Roles que podrían indicar compra
- Servidores con términos ambiguos
```
**Acción:** 🔍 INVESTIGAR más, preguntar al usuario

### **✅ Verificación LIMPIA (Verde):**
```
"✅ VERIFICACIÓN LIMPIA"
- No se detectaron servidores de hacks
- Sin roles sospechosos
```
**Acción:** ✅ Usuario parece confiable

---

## 🎮 **CASOS DE USO**

### **Caso 1: Proceso de Whitelist**
1. Usuario solicita acceso: "Hola, quiero entrar al servidor"
2. Staff pide Discord ID: "Pásame tu ID de Discord"
3. Staff verifica en el panel
4. **Si Trust Score > 60 y sin servidores**: ✅ APROBAR
5. **Si detecta servidores CRITICAL**: ❌ RECHAZAR con screenshot
6. **Si Trust Score 30-60**: 🔍 Hacer preguntas adicionales

### **Caso 2: Usuario Reportado**
1. Jugador reporta: "Hay un cheater en el servidor"
2. Staff obtiene Discord ID del sospechoso
3. Verifica en el panel
4. **Si detecta servidores de hacks**: Evidencia adicional
5. Documenta y procede con ban

### **Caso 3: Auditoría de Staff**
1. Admin quiere verificar integridad del staff
2. Verifica Discord ID de cada staff member
3. **Si alguno está en servidores de hacks**: Investigación interna
4. Tomar medidas según políticas

---

## ✅ **CHECKLIST DE INTERPRETACIÓN**

Cuando verificas un usuario, revisa en orden:

1. **Trust Score**
   - [ ] ¿Es mayor a 70? → Usuario confiable
   - [ ] ¿Está entre 40-70? → Revisar con cuidado
   - [ ] ¿Es menor a 40? → Alto riesgo

2. **Servidores Sospechosos**
   - [ ] ¿Hay servidores CRITICAL? → RECHAZAR
   - [ ] ¿Hay servidores HIGH? → NO ACEPTAR
   - [ ] ¿Hay solo MEDIUM/LOW? → Investigar contexto

3. **Roles de Comprador**
   - [ ] ¿Tiene roles en servidores de hacks? → Evidencia fuerte
   - [ ] ¿Solo roles sospechosos generales? → Investigar

4. **Antigüedad**
   - [ ] ¿Cuenta < 7 días? → Muy sospechoso si solicita acceso
   - [ ] ¿Cuenta < 30 días? → Pedir más verificación
   - [ ] ¿Cuenta > 1 año? → Punto a favor

5. **Decisión Final**
   - Combina todos los factores
   - Si hay duda: mejor prevenir que lamentar
   - Documenta tu decisión

---

## 📞 **PREGUNTAS FRECUENTES**

### **P: ¿Por qué no detecta TODOS los servidores de hacks?**
**R:** Solo puede revisar servidores donde tu bot de Discord está presente. Para una detección 100% completa necesitarías APIs externas o acceso especial de Discord.

### **P: ¿Los falsos positivos son posibles?**
**R:** Sí, especialmente en nivel LOW y MEDIUM. Por eso el sistema usa múltiples factores (Trust Score, roles, antigüedad) para dar una recomendación final.

### **P: ¿Puedo agregar más palabras clave?**
**R:** Sí, edita el array `hackKeywords` en el archivo `routes/api.js` línea ~735.

### **P: ¿Puedo agregar IDs de servidores conocidos?**
**R:** Sí, edita el array `knownHackServerIds` en el archivo `routes/api.js` línea ~760.

### **P: ¿Qué hago si un usuario legítimo está marcado?**
**R:** Revisa el contexto completo. Si solo tiene 1-2 alertas MEDIUM/LOW y buena antigüedad, podrías aceptarlo con seguimiento.

---

## 🎊 **CONCLUSIÓN**

Este sistema NO es perfecto pero es **MUCHO MEJOR** que no tener nada:

✅ **Detecta automáticamente** servidores de hacks donde tu bot está
✅ **Analiza 40+ palabras clave** específicas de FiveM
✅ **Clasifica el riesgo** en 4 niveles
✅ **Detecta roles de comprador** automáticamente
✅ **Calcula Trust Score objetivo** con múltiples factores
✅ **Da recomendaciones claras** sobre qué hacer

**Recuerda:** La decisión final siempre la tomas TÚ. El sistema solo te ayuda con información para decidir mejor.

---

*Sistema de Detección de Hacks - Wanted Roleplay © 2025*
*Usa esta herramienta responsablemente* 🛡️
