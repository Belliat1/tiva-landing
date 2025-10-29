# 📧 Configuración de Email para Reset de Contraseña

## 🔧 Variables de Entorno Requeridas

Agrega estas variables a tu archivo `.env` en `apps/api/`:

```env
# Email Configuration
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_app_password_de_gmail
FRONTEND_URL=http://localhost:5175
```

## 📋 Configuración de Gmail

### 1. **Habilitar Autenticación de 2 Factores**
- Ve a tu cuenta de Google
- Seguridad → Verificación en 2 pasos
- Activar la verificación en 2 pasos

### 2. **Generar App Password**
- Ve a Seguridad → Contraseñas de aplicaciones
- Selecciona "Aplicación" → "Otra (nombre personalizado)"
- Escribe "Tiva Store" y genera la contraseña
- **Copia la contraseña de 16 caracteres** (no tu contraseña normal)

### 3. **Configurar Variables**
```env
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop  # La contraseña de 16 caracteres
```

## 🔄 Flujo de Reset de Contraseña

### **Backend Endpoints:**
- `POST /api/password/forgot` - Solicitar reset
- `POST /api/password/reset` - Resetear con token
- `GET /api/password/verify/:token` - Verificar token

### **Frontend Pages:**
- `/forgot-password` - Solicitar reset
- `/reset-password?token=xxx` - Resetear contraseña

## 📧 Plantillas de Email

### **Email de Reset:**
- ✅ Diseño responsive
- ✅ Enlace seguro con token
- ✅ Expira en 1 hora
- ✅ Instrucciones claras

### **Email de Bienvenida:**
- ✅ Diseño atractivo
- ✅ Guía de inicio
- ✅ Enlaces al dashboard

## 🛡️ Seguridad Implementada

- ✅ **Tokens únicos** generados con crypto
- ✅ **Expiración de 1 hora** para tokens
- ✅ **Uso único** de tokens
- ✅ **Validación de email** antes de enviar
- ✅ **Mensajes seguros** (no revela si email existe)

## 🚀 Pruebas

### **1. Probar Configuración:**
```bash
# En apps/api/
node -e "
import('./src/services/emailService.js').then(module => {
  module.testEmailConnection().then(result => {
    console.log('Email config:', result ? '✅ OK' : '❌ Error');
  });
});
"
```

### **2. Probar Flujo Completo:**
1. Ir a `/login`
2. Click en "¿Olvidaste tu contraseña?"
3. Ingresar email
4. Revisar email recibido
5. Click en enlace
6. Ingresar nueva contraseña
7. Confirmar cambio

## 🔧 Troubleshooting

### **Error: "Invalid login"**
- Verifica que `EMAIL_USER` sea correcto
- Usa App Password, no tu contraseña normal
- Asegúrate de tener 2FA activado

### **Error: "Connection timeout"**
- Verifica conexión a internet
- Revisa configuración de firewall
- Prueba con otro servicio de email

### **Email no llega:**
- Revisa carpeta de spam
- Verifica que `EMAIL_USER` sea correcto
- Prueba con otro email

## 📱 Servicios de Email Alternativos

### **Outlook/Hotmail:**
```javascript
service: 'hotmail',
auth: {
  user: 'tu_email@outlook.com',
  pass: 'tu_contraseña'
}
```

### **Yahoo:**
```javascript
service: 'yahoo',
auth: {
  user: 'tu_email@yahoo.com',
  pass: 'tu_app_password'
}
```

### **SMTP Personalizado:**
```javascript
host: 'smtp.tu-servidor.com',
port: 587,
secure: false,
auth: {
  user: 'tu_email@tu-dominio.com',
  pass: 'tu_contraseña'
}
```

---

**¡El sistema de reset de contraseña está listo!** 🎉

Solo necesitas configurar las variables de entorno y el email funcionará automáticamente.
