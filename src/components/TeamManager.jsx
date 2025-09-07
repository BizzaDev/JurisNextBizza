import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Upload,
  User,
  Camera
} from 'lucide-react'

const TeamManager = ({ members, onAdd, onUpdate, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    specialty: '',
    experience: '',
    photo: null,
    photoPreview: ''
  })
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleAdd = () => {
    setIsAdding(true)
    setFormData({ 
      name: '', 
      role: '', 
      specialty: '', 
      experience: '',
      photo: null, 
      photoPreview: '' 
    })
  }

  const handleEdit = (member) => {
    setEditingId(member.id)
    setFormData({
      name: member.name,
      role: member.role,
      specialty: member.specialty,
      experience: member.experience,
      photo: member.photo,
      photoPreview: member.photo || ''
    })
  }

  const handleSave = () => {
    if (editingId) {
      onUpdate(editingId, formData)
      setEditingId(null)
    } else {
      onAdd(formData)
      setIsAdding(false)
    }
    setFormData({ 
      name: '', 
      role: '', 
      specialty: '', 
      experience: '',
      photo: null, 
      photoPreview: '' 
    })
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setFormData({ 
      name: '', 
      role: '', 
      specialty: '', 
      experience: '',
      photo: null, 
      photoPreview: '' 
    })
  }

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este membro da equipe?')) {
      onDelete(id)
    }
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setIsUploading(true)
      
      // Simular upload (em produção, você faria upload real)
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          photo: e.target.result,
          photoPreview: e.target.result
        }))
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="space-y-6">
      {/* Header com botão de adicionar */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">
          Gerenciar Equipe ({members.length})
        </h3>
        <button
          onClick={handleAdd}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar Membro</span>
        </button>
      </div>

      {/* Formulário de adição/edição */}
      {(isAdding || editingId) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-300"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? 'Editar Membro' : 'Adicionar Novo Membro'}
          </h4>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Upload de foto */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Foto do Membro
              </label>
              
              <div className="flex items-center space-x-4">
                {/* Preview da foto */}
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {formData.photoPreview ? (
                    <img 
                      src={formData.photoPreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                
                {/* Botão de upload */}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    {isUploading ? (
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                    <span className="text-sm">
                      {isUploading ? 'Enviando...' : 'Escolher Foto'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Campos do formulário */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Dr. João Silva"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cargo
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Sócio Fundador"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Especialidade
                </label>
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Direito Civil e Empresarial"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experiência
                </label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 15 anos"
                />
              </div>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex items-center justify-end space-x-3 mt-6">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={!formData.name.trim()}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>{editingId ? 'Salvar Alterações' : 'Adicionar Membro'}</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* Lista de membros */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
          >
            {/* Foto do membro */}
            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
              {member.photo ? (
                <img 
                  src={member.photo} 
                  alt={member.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-gray-600">
                  {getInitials(member.name)}
                </span>
              )}
            </div>

            {/* Informações do membro */}
            <div className="text-center space-y-2">
              <h4 className="text-lg font-semibold text-gray-900">
                {member.name}
              </h4>
              <p className="text-primary-600 font-medium">
                {member.role}
              </p>
              <p className="text-sm text-gray-600">
                {member.specialty}
              </p>
              <p className="text-sm text-gray-500">
                {member.experience}
              </p>
            </div>

            {/* Botões de ação */}
            <div className="flex items-center justify-center space-x-2 mt-4">
              <button
                onClick={() => handleEdit(member)}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                title="Editar membro"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(member.id)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                title="Excluir membro"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mensagem quando não há membros */}
      {members.length === 0 && (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Nenhum membro da equipe
          </h3>
          <p className="text-gray-500 mb-4">
            Adicione membros da equipe para exibir na seção "Nossa Equipe"
          </p>
          <button
            onClick={handleAdd}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Primeiro Membro</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default TeamManager
