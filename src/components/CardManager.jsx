import React, { useState, useCallback, useMemo } from 'react'
import { Plus, Edit2, Trash2, Save, X, Building, Users, Shield, Scale, Star } from 'lucide-react'

const iconMap = {
  Scale,
  Building,
  Users,
  Shield
}

const CardManager = React.memo(({ 
  cards, 
  onAdd, 
  onUpdate, 
  onDelete, 
  title = "Gerenciar Cards",
  cardType = "service"
}) => {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [newCard, setNewCard] = useState({
    title: '',
    description: '',
    icon: 'Scale'
  })

  const handleAdd = useCallback(() => {
    if (newCard.title && newCard.description) {
      onAdd(newCard)
      setNewCard({ title: '', description: '', icon: 'Scale' })
      setIsAdding(false)
    }
  }, [newCard, onAdd])

  const handleUpdate = useCallback((id, updatedCard) => {
    onUpdate(id, updatedCard)
    setEditingId(null)
  }, [onUpdate])

  const handleDelete = useCallback((id) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      onDelete(id)
    }
  }, [onDelete])

  const CardForm = React.memo(({ card, onSave, onCancel, isNew = false }) => {
    const [formData, setFormData] = useState(card)
    const [errors, setErrors] = useState({})

    const validateForm = useCallback(() => {
      const newErrors = {}
      
      if (!formData.title.trim()) {
        newErrors.title = 'Título é obrigatório'
      }
      
      if (!formData.description.trim()) {
        newErrors.description = 'Descrição é obrigatória'
      }

      if (cardType === 'testimonial') {
        if (!formData.name?.trim()) {
          newErrors.name = 'Nome é obrigatório'
        }
        if (!formData.role?.trim()) {
          newErrors.role = 'Cargo é obrigatório'
        }
        if (!formData.content?.trim()) {
          newErrors.content = 'Depoimento é obrigatório'
        }
      }

      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }, [formData, cardType])

    const handleSubmit = useCallback((e) => {
      e.preventDefault()
      if (validateForm()) {
        onSave(formData)
      }
    }, [formData, validateForm, onSave])

    const handleInputChange = useCallback((field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }))
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }))
      }
    }, [errors])

    return (
      <div className="bg-white border-2 border-primary-500 rounded-lg p-4 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
              required
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
              rows={3}
              required
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {cardType === 'service' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ícone
              </label>
              <select
                value={formData.icon}
                onChange={(e) => handleInputChange('icon', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="Scale">Balança (Direito Civil)</option>
                <option value="Building">Prédio (Direito Empresarial)</option>
                <option value="Users">Usuários (Direito Trabalhista)</option>
                <option value="Shield">Escudo (Direito Criminal)</option>
              </select>
            </div>
          )}

          {cardType === 'testimonial' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome *
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cargo/Profissão *
                </label>
                <input
                  type="text"
                  value={formData.role || ''}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${errors.role ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
                {errors.role && (
                  <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Depoimento *
                </label>
                <textarea
                  value={formData.content || ''}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${errors.content ? 'border-red-500' : 'border-gray-300'}`}
                  rows={3}
                  required
                />
                {errors.content && (
                  <p className="text-red-500 text-xs mt-1">{errors.content}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Avaliação (1-5)
                </label>
                <select
                  value={formData.rating || 5}
                  onChange={(e) => handleInputChange('rating', parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value={1}>1 estrela</option>
                  <option value={2}>2 estrelas</option>
                  <option value={3}>3 estrelas</option>
                  <option value={4}>4 estrelas</option>
                  <option value={5}>5 estrelas</option>
                </select>
              </div>
            </>
          )}

          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{isNew ? 'Adicionar' : 'Salvar'}</span>
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancelar</span>
            </button>
          </div>
        </form>
      </div>
    )
  })

  const renderCard = useCallback((card) => {
    if (editingId === card.id) {
      return (
        <CardForm
          card={card}
          onSave={(updatedCard) => handleUpdate(card.id, updatedCard)}
          onCancel={() => setEditingId(null)}
        />
      )
    }

    return (
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {cardType === 'service' ? (
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                {React.createElement(iconMap[card.icon] || Scale, {
                  className: "w-6 h-6 text-primary-600"
                })}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{card.title}</h4>
                <p className="text-gray-600">{card.description}</p>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="font-semibold text-gray-900">{card.name}</h4>
                <span className="text-sm text-gray-500">- {card.role}</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < card.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 italic">"{card.content}"</p>
            </div>
          )}
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => setEditingId(card.id)}
            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            title="Editar"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(card.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Excluir"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }, [editingId, cardType, handleUpdate, handleDelete])

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Adicionar</span>
        </button>
      </div>

      {isAdding && (
        <div className="mb-6">
          <CardForm
            card={newCard}
            onSave={(formData) => {
              if (formData.title && formData.description) {
                onAdd(formData)
                setNewCard({ title: '', description: '', icon: 'Scale' })
                setIsAdding(false)
              }
            }}
            onCancel={() => setIsAdding(false)}
            isNew={true}
          />
        </div>
      )}

      <div className="space-y-4">
        {cards.map(renderCard)}
      </div>

      {cards.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhum item cadastrado ainda.</p>
          <p className="text-sm">Clique em "Adicionar" para criar o primeiro item.</p>
        </div>
      )}
    </div>
  )
})

CardManager.displayName = 'CardManager'
export default CardManager
