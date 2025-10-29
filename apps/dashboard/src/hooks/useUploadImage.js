import { useState } from 'react'
import { uploadImage as uploadImageService } from '../api/uploadService'
import toast from 'react-hot-toast'

export function useUploadImage() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState(null)

  const uploadImage = async (file) => {
    if (!file) {
      throw new Error('No se proporcionó ningún archivo')
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Tipo de archivo no válido. Solo se permiten JPG, PNG y WebP')
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      throw new Error('El archivo es demasiado grande. Máximo 5MB')
    }

    setIsUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      // Simular progreso de subida
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      // Subir imagen usando el servicio del backend
      const secureUrl = await uploadImageService(file)
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      // Simular delay para mostrar progreso
      await new Promise(resolve => setTimeout(resolve, 500))
      
      toast.success('Imagen subida exitosamente')
      return secureUrl

    } catch (error) {
      console.error('Error uploading image:', error)
      setError(error.message || 'Error al subir la imagen')
      toast.error(error.message || 'Error al subir la imagen')
      throw error
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const uploadMultipleImages = async (files) => {
    const uploadPromises = Array.from(files).map(file => uploadImage(file))
    return Promise.all(uploadPromises)
  }

  const handleUpload = async (file) => {
    try {
      setError(null)
      const url = await uploadImage(file)
      return url
    } catch (err) {
      console.error(err)
      setError("Error subiendo imagen")
      return null
    }
  }

  return {
    uploadImage,
    uploadMultipleImages,
    handleUpload,
    isUploading,
    uploadProgress,
    error
  }
}
