# Sistema de Subida de Imágenes - Tiva Store Dashboard

Este documento describe el sistema completo de subida de imágenes implementado en el dashboard de Tiva Store, que permite a los emprendedores subir imágenes de productos directamente al backend y obtener URLs de Cloudinary.

## 🏗️ Arquitectura

```
Frontend (React)          Backend (Node.js)           Cloudinary
┌─────────────────┐       ┌─────────────────┐        ┌─────────────────┐
│ ImageUploader   │──────▶│ /api/uploads    │───────▶│ Cloud Storage   │
│ Component       │       │ Multer + JWT    │        │ Image CDN       │
└─────────────────┘       └─────────────────┘        └─────────────────┘
         │                           │
         ▼                           ▼
┌─────────────────┐       ┌─────────────────┐
│ ProductForm     │       │ MongoDB         │
│ Component       │       │ Product Storage │
└─────────────────┘       └─────────────────┘
```

## 📁 Estructura de Archivos

```
src/
├── api/
│   ├── axios.js              # Instancia de Axios con interceptores
│   ├── uploadService.js      # Servicios de subida de imágenes
│   └── productService.js     # Servicios de productos
├── components/
│   ├── ImageUploader.jsx     # Componente de subida de imágenes
│   ├── ProductForm.jsx       # Formulario de productos
│   └── ProductFormExample.jsx # Ejemplo de uso
├── hooks/
│   └── useUploadImage.js     # Hook personalizado para subida
└── main.jsx                  # Configuración de react-hot-toast
```

## 🔧 Componentes Principales

### 1. ImageUploader Component

**Ubicación**: `src/components/ImageUploader.jsx`

**Características**:
- Drag & drop de imágenes
- Previsualización en tiempo real
- Validación de tipos y tamaños
- Soporte para múltiples imágenes
- Integración con backend via API

**Props**:
```jsx
<ImageUploader
  onUpload={(url) => console.log('Imagen subida:', url)}
  onRemove={(index) => console.log('Imagen eliminada:', index)}
  maxImages={5}
  existingImages={['url1', 'url2']}
/>
```

**Funcionalidades**:
- ✅ Drag & drop
- ✅ Selección de archivos
- ✅ Validación de tipos (JPG, PNG, WebP)
- ✅ Validación de tamaño (máx. 5MB)
- ✅ Previsualización local
- ✅ Subida automática al backend
- ✅ Manejo de errores
- ✅ Estados de carga

### 2. ProductForm Component

**Ubicación**: `src/components/ProductForm.jsx`

**Características**:
- Formulario completo de productos
- Integración con ImageUploader
- Validación de campos
- Creación y edición de productos
- Integración con React Query

**Uso**:
```jsx
<ProductForm
  product={editingProduct} // null para crear nuevo
  onClose={() => setFormOpen(false)}
  onSuccess={() => console.log('Producto guardado')}
/>
```

### 3. useUploadImage Hook

**Ubicación**: `src/hooks/useUploadImage.js`

**Funcionalidades**:
- Subida de imágenes individuales
- Subida de múltiples imágenes
- Estados de carga y error
- Validaciones de archivo
- Integración con toast notifications

**Uso**:
```jsx
const { handleUpload, uploading, error } = useUploadImage()

const url = await handleUpload(file)
```

## 🔌 Servicios de API

### 1. uploadService

**Ubicación**: `src/api/uploadService.js`

**Endpoints disponibles**:
- `uploadImage(file)` - Subir una imagen
- `uploadMultipleImages(files)` - Subir múltiples imágenes
- `deleteImage(publicId)` - Eliminar imagen
- `getImageInfo(publicId)` - Obtener información
- `listImages(params)` - Listar imágenes

### 2. productService

**Ubicación**: `src/api/productService.js`

**Endpoints disponibles**:
- `createProduct(data)` - Crear producto
- `updateProduct(id, data)` - Actualizar producto
- `getProducts(params)` - Listar productos
- `deleteProduct(id)` - Eliminar producto

## 🚀 Flujo de Subida de Imágenes

### 1. Selección de Archivo
```jsx
// Usuario selecciona archivo
const file = event.target.files[0]

// Validaciones automáticas
- Tipo: JPG, PNG, WebP
- Tamaño: Máximo 5MB
- Cantidad: Máximo 5 imágenes
```

### 2. Previsualización Local
```jsx
// Crear URL local para preview
const localUrl = URL.createObjectURL(file)
setPreview(localUrl)
```

### 3. Subida al Backend
```jsx
// Crear FormData
const formData = new FormData()
formData.append('image', file)

// Enviar al backend
const response = await api.post('/uploads', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})

// Obtener URL de Cloudinary
const secureUrl = response.data.data.secure_url
```

### 4. Guardado en Producto
```jsx
// Agregar URL al producto
const productData = {
  name: 'Mi Producto',
  price: 50000,
  imageUrls: [secureUrl]
}

// Crear producto
await createProduct(productData)
```

## 🔒 Seguridad

### Autenticación
- Todas las subidas requieren token JWT válido
- Token se envía automáticamente via interceptor de Axios

### Validaciones
- **Frontend**: Tipo de archivo, tamaño, cantidad
- **Backend**: Re-validación, rate limiting, autenticación

### Rate Limiting
- Máximo 10 subidas por minuto por usuario
- Máximo 5MB por archivo
- Máximo 10 archivos por request

## 🎨 Estilos y UX

### Estados Visuales
- **Idle**: Zona de drag & drop con icono
- **Hover**: Cambio de color y cursor
- **Dragging**: Borde verde y fondo claro
- **Uploading**: Spinner y texto de progreso
- **Error**: Mensaje de error en rojo
- **Success**: Imagen previsualizada

### Responsive Design
- Grid adaptativo para imágenes
- Botones táctiles en móviles
- Zona de drop optimizada para touch

## 🧪 Pruebas

### Pruebas Manuales
1. **Drag & Drop**: Arrastrar imagen a la zona
2. **Selección**: Click en "Seleccionar imagen"
3. **Validación**: Probar archivos inválidos
4. **Múltiples**: Subir varias imágenes
5. **Eliminación**: Remover imágenes

### Casos de Error
- Archivo muy grande (>5MB)
- Tipo no soportado (.gif, .bmp)
- Sin conexión a internet
- Token expirado
- Límite de imágenes excedido

## 📱 Uso en Móviles

### Optimizaciones
- Zona de drop más grande
- Botones táctiles optimizados
- Previsualización adaptativa
- Gestos de eliminación

### Limitaciones
- Drag & drop no disponible
- Selección solo por botón
- Previsualización limitada

## 🔧 Configuración

### Variables de Entorno
```env
VITE_API_URL=http://localhost:5000/api
VITE_CLOUDINARY_CLOUD_NAME=dbkpipizy
VITE_CLOUDINARY_UPLOAD_PRESET=tiva_upload
```

### Dependencias
```json
{
  "react-hot-toast": "^2.4.1",
  "lucide-react": "^0.294.0",
  "axios": "^1.6.2"
}
```

## 🚀 Despliegue

### Backend
1. Configurar Cloudinary
2. Configurar MongoDB
3. Configurar JWT secrets
4. Desplegar en servidor

### Frontend
1. Configurar variables de entorno
2. Build de producción
3. Desplegar en CDN/servidor

## 📊 Monitoreo

### Métricas Importantes
- Tiempo de subida promedio
- Tasa de error de subidas
- Uso de almacenamiento
- Requests por minuto

### Logs
- Subidas exitosas
- Errores de validación
- Errores de red
- Errores de autenticación

## 🛠️ Mantenimiento

### Tareas Regulares
- Limpiar imágenes no utilizadas
- Monitorear uso de Cloudinary
- Actualizar dependencias
- Revisar logs de errores

### Optimizaciones Futuras
- Compresión automática
- Redimensionamiento inteligente
- CDN personalizado
- Cache de previsualizaciones

---

## 📞 Soporte

Para problemas técnicos o preguntas sobre el sistema de subida de imágenes:

- **Email**: hola@tiva.com
- **WhatsApp**: +57 301 253 3436
- **Documentación**: [docs.tiva.com](https://docs.tiva.com)

---

**Tiva Store** - Sistema de subida de imágenes robusto y escalable 🚀
