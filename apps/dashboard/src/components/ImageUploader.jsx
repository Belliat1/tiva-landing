import { useState, useRef } from "react"
import { useUploadImage } from "../hooks/useUploadImage"
import { Upload, X, Image as ImageIcon, AlertCircle } from "lucide-react"

const ImageUploader = ({ onUpload, onRemove, maxImages = 5, existingImages = [] }) => {
  const [preview, setPreview] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)
  const { handleUpload, uploading, error } = useUploadImage()

  const handleFileChange = async (files) => {
    const fileArray = Array.from(files)
    
    // Validar cantidad máxima
    if (existingImages.length + fileArray.length > maxImages) {
      alert(`Máximo ${maxImages} imágenes permitidas`)
      return
    }

    // Procesar cada archivo
    for (const file of fileArray) {
      if (file) {
        // Crear preview local
        const localUrl = URL.createObjectURL(file)
        setPreview(localUrl)
        
        // Subir imagen
        const secureUrl = await handleUpload(file)
        if (secureUrl) {
          onUpload(secureUrl)
        }
      }
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files)
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    if (onRemove) {
      onRemove()
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full">
      {/* Zona de subida */}
      <div
        className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-colors ${
          dragActive
            ? "border-lime-400 bg-lime-50"
            : "border-gray-300 bg-gray-50 hover:bg-gray-100"
        } ${uploading ? "opacity-50 pointer-events-none" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={maxImages > 1}
          className="hidden"
          onChange={handleFileInput}
          disabled={uploading}
        />

        {!preview ? (
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-6 h-6 text-lime-600" />
            </div>
            <p className="text-sm text-gray-600 mb-2">
              {dragActive
                ? "Suelta las imágenes aquí"
                : "Arrastra y suelta imágenes o haz clic para seleccionar"}
            </p>
            <p className="text-xs text-gray-500 mb-4">
              PNG, JPG, WebP hasta 5MB cada una
            </p>
            <button
              type="button"
              onClick={openFileDialog}
              disabled={uploading}
              className="btn-primary text-sm"
            >
              {maxImages > 1 ? "Seleccionar imágenes" : "Seleccionar imagen"}
            </button>
          </div>
        ) : (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg shadow-md border"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-white p-1 rounded-full shadow-md hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4 text-red-600" />
            </button>
          </div>
        )}

        {/* Estado de carga */}
        {uploading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-xl">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-400 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Subiendo imagen...</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-2 flex items-center text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 mr-1" />
            {error}
          </div>
        )}
      </div>

      {/* Imágenes existentes */}
      {existingImages.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">
            Imágenes actuales ({existingImages.length}/{maxImages})
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {existingImages.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Imagen ${index + 1}`}
                  className="w-full h-20 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => onRemove && onRemove(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="mt-2 text-xs text-gray-500">
        <p>• Máximo {maxImages} imagen{maxImages > 1 ? 'es' : ''}</p>
        <p>• Tamaño máximo: 5MB por imagen</p>
        <p>• Formatos: JPG, PNG, WebP</p>
      </div>
    </div>
  )
}

export default ImageUploader

