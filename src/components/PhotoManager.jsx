import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Upload,
  Image as ImageIcon,
  Camera
} from 'lucide-react'

const PhotoManager = ({ photos, onAddPhoto, onUpdatePhoto, onDeletePhoto, isAdmin, isEditingMode }) => {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageFile: null,
    imagePreview: ''
  })
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleAdd = () => {
    setIsAdding(true)
    setFormData({ title: '', description: '', imageFile: null, imagePreview: '' })
  }

  const handleEdit = (photo) => {
    setEditingId(photo.id)
    setFormData({
      title: photo.title,
      description: photo.description,
      imageFile: null,
      imagePreview: photo.imageUrl || ''
    })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Verificar se é uma imagem
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.')
        return
      }

      // Verificar tamanho do arquivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('O arquivo deve ter no máximo 5MB.')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          imageFile: file,
          imagePreview: e.target.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    if (!formData.title.trim()) {
      alert('Por favor, insira um título para a foto.')
      return
    }

    if (!formData.imageFile && !formData.imagePreview) {
      alert('Por favor, selecione uma imagem.')
      return
    }

    setIsUploading(true)

    try {
      const photoData = {
        title: formData.title,
        description: formData.description,
        imageUrl: formData.imagePreview
      }

      if (editingId) {
        onUpdatePhoto(editingId, photoData)
        setEditingId(null)
      } else {
        onAddPhoto(photoData)
        setIsAdding(false)
      }
      
      setFormData({ title: '', description: '', imageFile: null, imagePreview: '' })
    } catch (error) {
      console.error('Erro ao salvar foto:', error)
      alert('Erro ao salvar a foto. Tente novamente.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setFormData({ title: '', description: '', imageFile: null, imagePreview: '' })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta foto?')) {
      onDeletePhoto(id)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header com botão de adicionar */}
      {isAdmin && isEditingMode && (
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Galeria de Fotos
          </h3>
          <button
            onClick={handleAdd}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Foto</span>
          </button>
        </div>
      )}

      {/* Formulário de adição/edição */}
      {(isAdding || editingId) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-700 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center space-x-3 text-blue-700 dark:text-blue-400 mb-4">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingId ? 'Editar Foto' : 'Adicionar Nova Foto'}
              </h4>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Preencha os dados da foto abaixo
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Título da Foto *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500"
                placeholder="Ex: Cliente satisfeito"
                maxLength={50}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Selecionar Imagem *
              </label>
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <Camera className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">
                    {formData.imageFile ? 'Trocar Imagem' : 'Clique para selecionar'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Preview da imagem */}
          {formData.imagePreview && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preview da Imagem
              </label>
              <div className="relative w-full max-w-xs">
                <img
                  src={formData.imagePreview}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, imageFile: null, imagePreview: '' }))
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ''
                    }
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 resize-none"
              rows={3}
              placeholder="Descrição da foto ou depoimento do cliente..."
              maxLength={200}
            />
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <span className="font-medium">Dica:</span> Selecione imagens do seu computador ou celular. Formatos aceitos: JPG, PNG, GIF (máx. 5MB)
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cancelar</span>
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.title.trim() || (!formData.imageFile && !formData.imagePreview) || isUploading}
                className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Salvar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Grid de fotos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.7, 
              delay: index * 0.15,
              type: "spring",
              stiffness: 100
            }}
            viewport={{ once: true }}
            className="group photo-card border border-gray-100 relative z-10"
          >
            {/* Imagem com overlay gradiente */}
            <div className="photo-card-image h-56">
              {photo.imageUrl ? (
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }}
                />
              ) : null}
              
              {/* Overlay gradiente no hover */}
              <div className="photo-card-overlay"></div>
              
              {/* Placeholder quando não há imagem */}
              <div 
                className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100"
                style={{ display: photo.imageUrl ? 'none' : 'flex' }}
              >
                <div className="text-center">
                  <ImageIcon className="w-16 h-16 text-primary-400 mx-auto mb-2" />
                  <p className="text-primary-600 text-sm font-medium">Imagem não disponível</p>
                </div>
              </div>

            
              {/* Botões de ação para admin */}
              {isAdmin && isEditingMode && (
                <div className="photo-card-actions">
                  <button
                    onClick={() => handleEdit(photo)}
                    className="photo-card-action-btn text-blue-600 hover:bg-blue-600 hover:text-white"
                    title="Editar foto"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="photo-card-action-btn text-red-600 hover:bg-red-600 hover:text-white"
                    title="Excluir foto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Ícone de zoom no hover */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Conteúdo com design aprimorado */}
            <div className="photo-card-content">
              {/* Linha decorativa */}
              <div className="photo-card-divider"></div>
              
              <div className="mt-4">
                <h4 className="photo-card-title">
                  {photo.title}
                </h4>
                {photo.description && (
                  <p className="photo-card-description">
                    {photo.description}
                  </p>
                )}
              </div>

              {/* Footer do card */}
              <div className="photo-card-footer">
                <div className="flex items-center justify-between">
                  <div className="photo-card-status">
                    <div className="photo-card-status-dot"></div>
      
                  </div>
                  <div className="photo-card-date">
                    {new Date().toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Card vazio quando não há fotos */}
        {photos.length === 0 && (
          <motion.div 
            className="col-span-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center hover:border-primary-400 hover:bg-gradient-to-br hover:from-primary-50 hover:to-primary-100 transition-all duration-300">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Camera className="w-10 h-10 text-primary-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-3">
                Nenhuma foto adicionada ainda
              </h3>
              <p className="text-gray-500 text-lg mb-6 max-w-md mx-auto">
                {isAdmin && isEditingMode 
                  ? 'Comece criando sua galeria de fotos clicando no botão "Adicionar Foto" acima'
                  : 'Nossa galeria de fotos será atualizada em breve'
                }
              </p>
              {isAdmin && isEditingMode && (
                <div className="inline-flex items-center space-x-2 text-primary-600 font-medium">
                  <Plus className="w-5 h-5" />
                  <span>Adicione sua primeira foto</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default PhotoManager
