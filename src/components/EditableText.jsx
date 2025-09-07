import React, { useState, useCallback, useMemo } from 'react'
import { Edit2, Check, X, AlertCircle } from 'lucide-react'

const EditableText = React.memo(({ 
  value, 
  onSave, 
  className = '', 
  tag = 'span',
  placeholder = 'Clique para editar',
  multiline = false,
  isAdmin = false,
  isEditingMode = false,
  validation = null,
  maxLength = null
}) => {
  const [isEditingLocal, setIsEditingLocal] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const [error, setError] = useState('')

  const isValid = useMemo(() => {
    if (!validation) return true
    return validation(editValue)
  }, [editValue, validation])

  const handleEdit = useCallback(() => {
    if (isAdmin && isEditingMode) {
      setIsEditingLocal(true)
      setEditValue(value)
      setError('')
    }
  }, [isAdmin, isEditingMode, value])

  const handleSave = useCallback(() => {
    if (!isValid || !editValue.trim()) {
      setError('Texto inválido ou vazio')
      return
    }

    try {
      onSave(editValue)
      setIsEditingLocal(false)
      setError('')
    } catch (err) {
      setError('Erro ao salvar')
    }
  }, [editValue, isValid, onSave])

  const handleCancel = useCallback(() => {
    setIsEditingLocal(false)
    setEditValue(value)
    setError('')
  }, [value])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    }
  }, [handleSave, handleCancel, multiline])

  const Tag = tag

  if (isEditingLocal) {
    return (
      <div className="relative z-50">
        <div className="bg-white border-2 border-blue-400 rounded-xl p-6 shadow-2xl max-w-2xl">
          {/* Header da edição */}
          <div className="flex items-center space-x-3 text-blue-700 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Edit2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">Editando Texto</h3>
              <p className="text-xs text-blue-600">Faça suas alterações abaixo</p>
            </div>
          </div>
          
          {/* Campo de edição */}
          <div className="space-y-3">
            {multiline ? (
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`w-full p-4 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 resize-none transition-all duration-200 ${className}`}
                rows={4}
                autoFocus
                maxLength={maxLength}
                placeholder="Digite seu texto aqui..."
              />
            ) : (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`w-full p-4 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all duration-200 ${className}`}
                autoFocus
                maxLength={maxLength}
                placeholder="Digite seu texto aqui..."
              />
            )}
            
            {/* Contador de caracteres */}
            {maxLength && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Caracteres utilizados</span>
                <span className={`font-medium ${editValue.length > maxLength * 0.9 ? 'text-orange-500' : 'text-gray-500'}`}>
                  {editValue.length}/{maxLength}
                </span>
              </div>
            )}
          </div>
          
          {/* Mensagem de erro */}
          {error && (
            <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg mt-3 border border-red-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {/* Controles */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <span className="font-medium">Atalhos:</span> {multiline ? 'Ctrl+Enter' : 'Enter'} para salvar • Esc para cancelar
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors shadow-sm"
              >
                <X className="w-4 h-4" />
                <span>Cancelar</span>
              </button>
              <button
                onClick={handleSave}
                disabled={!isValid || !editValue.trim()}
                className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4" />
                <span>Salvar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative group">
      <Tag 
        className={`${className} ${value ? '' : 'text-gray-400 italic'} ${
          isAdmin && isEditingMode 
            ? 'cursor-pointer relative transition-all duration-200 hover:bg-blue-50 hover:shadow-lg rounded-lg p-2 -m-2 hover:border-2 hover:border-blue-400 hover:border-dashed' 
            : ''
        }`}
        onClick={handleEdit}
        title={isAdmin && isEditingMode ? 'Clique para editar este texto' : ''}
      >
        {value || placeholder}
        
        {/* Indicador visual permanente no modo de edição */}
        {isAdmin && isEditingMode && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md opacity-60 group-hover:opacity-100 transition-opacity duration-200">
            <Edit2 className="w-2.5 h-2.5 text-white absolute top-0.5 left-0.5" />
          </div>
        )}
      </Tag>
      
      {/* Tooltip de edição */}
      {isAdmin && isEditingMode && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
          <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
            Clique para editar
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800"></div>
          </div>
        </div>
      )}
    </div>
  )
})

EditableText.displayName = 'EditableText'

export default EditableText