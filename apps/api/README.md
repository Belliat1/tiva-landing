# Tiva Store API - Backend

Backend API para Tiva Store, una plataforma SaaS de e-commerce que permite a emprendedores crear catálogos, subir productos con imágenes optimizadas por IA, y recibir pedidos por WhatsApp o SMS.

## 🚀 Características

- **Subida de imágenes** con Cloudinary y Multer
- **Autenticación JWT** con middleware de seguridad
- **Rate limiting** para prevenir abuso
- **Logging estructurado** con Pino
- **CORS configurado** para frontend
- **Validación de archivos** (tipo, tamaño, cantidad)
- **Optimización automática** de imágenes
- **Eliminación segura** de imágenes

## 🛠️ Tecnologías

- **Node.js** + **Express.js**
- **MongoDB** con **Mongoose**
- **Cloudinary** para gestión de imágenes
- **Multer** para subida de archivos
- **JWT** para autenticación
- **Pino** para logging
- **Helmet** para seguridad
- **CORS** para cross-origin requests

## 📦 Instalación

1. **Instalar dependencias**
   ```bash
   cd apps/api
   npm install
   ```

2. **Configurar variables de entorno**
   ```bash
   cp env.example .env
   ```
   
   Editar `.env` con tus configuraciones:
   ```env
   PORT=5000
   MONGO_URI=tu_mongo_uri
   JWT_SECRET=tu_jwt_secret
   CLOUDINARY_CLOUD_NAME=dbkpipizy
   CLOUDINARY_API_KEY=376188943244162
   CLOUDINARY_API_SECRET=lNcpMUKZllgbpuM7ZUZz82cxqWo
   ALLOWED_ORIGINS=http://localhost:5173
   ```

3. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

4. **Ejecutar en producción**
   ```bash
   npm start
   ```

## 🔧 Endpoints de Subida de Imágenes

### POST /api/uploads
Subir una imagen única

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (form-data):**
```
image: [archivo de imagen]
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {
    "secure_url": "https://res.cloudinary.com/dbkpipizy/image/upload/v1734521623/tiva_uploads/abc123.png",
    "public_id": "tiva_uploads/abc123",
    "format": "png",
    "bytes": 283912,
    "width": 800,
    "height": 600,
    "created_at": "2024-12-18T10:30:00Z"
  },
  "message": "Imagen subida exitosamente"
}
```

### POST /api/uploads/multiple
Subir múltiples imágenes (máximo 10)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Body (form-data):**
```
images: [archivo1, archivo2, ...]
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {
    "uploaded": [
      {
        "originalname": "producto1.jpg",
        "secure_url": "https://res.cloudinary.com/...",
        "public_id": "tiva_uploads/abc123",
        "format": "jpg",
        "bytes": 283912,
        "width": 800,
        "height": 600
      }
    ],
    "errors": [],
    "total_uploaded": 1,
    "total_errors": 0
  },
  "message": "1 imagen(es) subida(s) exitosamente"
}
```

### GET /api/uploads
Listar imágenes del usuario/tienda

**Headers:**
```
Authorization: Bearer <token>
```

**Query parameters:**
- `folder` (opcional): Carpeta específica
- `max_results` (opcional): Máximo de resultados (default: 50)

### GET /api/uploads/:publicId
Obtener información de una imagen específica

**Headers:**
```
Authorization: Bearer <token>
```

### DELETE /api/uploads/:publicId
Eliminar una imagen

**Headers:**
```
Authorization: Bearer <token>
```

## 🔒 Seguridad

### Autenticación
- Todas las rutas requieren token JWT válido
- Token debe enviarse en header `Authorization: Bearer <token>`

### Rate Limiting
- **General**: 100 requests por IP cada 15 minutos
- **Subida de imágenes**: 10 subidas por IP cada minuto

### Validaciones
- **Tipos de archivo**: Solo JPG, PNG, WebP
- **Tamaño máximo**: 5MB por archivo
- **Cantidad máxima**: 10 archivos por subida
- **Carpetas**: Organizadas por `storeId` del usuario

## 📊 Logging

El servidor utiliza Pino para logging estructurado:

```javascript
// Logs de requests
{
  "level": "info",
  "time": "2024-12-18T10:30:00.000Z",
  "method": "POST",
  "url": "/api/uploads",
  "ip": "127.0.0.1",
  "userAgent": "Mozilla/5.0...",
  "msg": "Request recibida"
}

// Logs de errores
{
  "level": "error",
  "time": "2024-12-18T10:30:00.000Z",
  "error": "Error message",
  "stack": "Error stack trace",
  "url": "/api/uploads",
  "method": "POST",
  "msg": "Error no manejado"
}
```

## 🧪 Pruebas

### Con Postman

1. **Configurar headers:**
   ```
   Authorization: Bearer <tu_token_jwt>
   ```

2. **Subir imagen:**
   - Método: `POST`
   - URL: `http://localhost:5000/api/uploads`
   - Body: `form-data`
   - Key: `image`, Type: `File`

3. **Verificar respuesta:**
   ```json
   {
     "success": true,
     "data": {
       "secure_url": "https://res.cloudinary.com/...",
       "public_id": "tiva_uploads/abc123"
     }
   }
   ```

### Con cURL

```bash
# Subir imagen
curl -X POST \
  http://localhost:5000/api/uploads \
  -H "Authorization: Bearer <token>" \
  -F "image=@/path/to/image.jpg"

# Listar imágenes
curl -X GET \
  http://localhost:5000/api/uploads \
  -H "Authorization: Bearer <token>"

# Eliminar imagen
curl -X DELETE \
  http://localhost:5000/api/uploads/tiva_uploads/abc123 \
  -H "Authorization: Bearer <token>"
```

## 🔧 Configuración de Cloudinary

### Cuenta configurada:
- **Cloud Name**: `dbkpipizy`
- **API Key**: `376188943244162`
- **API Secret**: `lNcpMUKZllgbpuM7ZUZz82cxqWo`

### Configuraciones aplicadas:
- **Carpeta**: `tiva_uploads/{storeId}`
- **Transformaciones**: 
  - Ancho máximo: 800px
  - Calidad: automática
  - Formato: automático
- **Optimización**: Habilitada

## 📁 Estructura del Proyecto

```
src/
├── config/
│   └── cloudinary.js          # Configuración de Cloudinary
├── controllers/
│   └── uploadController.js    # Controladores de subida
├── middleware/
│   └── authMiddleware.js      # Middleware de autenticación
├── models/
│   └── User.js               # Modelo de Usuario
├── routes/
│   └── uploadRoutes.js       # Rutas de subida
└── server.js                 # Servidor principal
```

## 🚀 Despliegue

### Variables de entorno para producción:
```env
NODE_ENV=production
PORT=5000
MONGO_URI=tu_mongo_uri_produccion
JWT_SECRET=tu_jwt_secret_seguro
CLOUDINARY_CLOUD_NAME=dbkpipizy
CLOUDINARY_API_KEY=376188943244162
CLOUDINARY_API_SECRET=lNcpMUKZllgbpuM7ZUZz82cxqWo
ALLOWED_ORIGINS=https://tu-dominio.com
LOG_LEVEL=warn
```

### Comandos de despliegue:
```bash
# Build
npm run build

# Start
npm start
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico, contacta a:
- Email: hola@tiva.com
- WhatsApp: +57 301 253 3436

---

**Tiva Store API** - Backend robusto para e-commerce 🚀
