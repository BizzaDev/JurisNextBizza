import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit3, Eye, LogOut, Save, Settings, User, Shield, AlertCircle, Plus, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useContent } from '../contexts/ContentContext'
import CardManager from './CardManager'
import TeamManager from './TeamManager'

const AdminControls = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const { isEditing, toggleEditing, saveContent, services, testimonials, addService, updateService, deleteService, addTestimonial, updateTestimonial, deleteTestimonial, addTeamMember, updateTeamMember, deleteTeamMember, content } = useContent()
  const [showPanel, setShowPanel] = useState(false)
  const [activeTab, setActiveTab] = useState('services')

  if (!isAuthenticated) return null

  const handleLogout = async () => {
    if (window.confirm('Tem certeza que deseja sair do modo administrador?')) {
      try {
        await logout()
        window.location.href = '/'
      } catch (error) {
        console.error('Erro ao fazer logout:', error)
        // Mesmo com erro, redireciona para a página inicial
        window.location.href = '/'
      }
    }
  }

  const handleSave = async () => {
    try {
      await saveContent()
      // Feedback visual de sucesso
      const button = document.querySelector('[data-save-button]')
      if (button) {
        const originalContent = button.innerHTML
        button.innerHTML = '<span class="text-white">✓ Salvo!</span>'
        button.classList.add('bg-green-600')
        setTimeout(() => {
          button.innerHTML = originalContent
          button.classList.remove('bg-green-600')
        }, 2000)
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
    }
  }

  const handleResetContent = () => {
    if (window.confirm('Tem certeza que deseja resetar todo o conteúdo? Esta ação não pode ser desfeita.')) {
      localStorage.removeItem('admin-content')
      localStorage.removeItem('admin-services')
      localStorage.removeItem('admin-testimonials')
      window.location.reload()
    }
  }

  return (
    <>
      {/* Controles Principais - Canto Superior Direito */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-32 right-4 z-50"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 max-w-sm">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Painel Admin</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Bem-vindo, {user?.name || 'Admin'}</p>
            </div>
          </div>

          {/* Controles Principais */}
          <div className="space-y-2">
            {/* Toggle Edit Mode */}
            <button
              onClick={toggleEditing}
              className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isEditing
                  ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-300'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300'
              }`}
            >
              {isEditing ? (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Sair do Modo de Edição</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" />
                  <span>Entrar no Modo de Edição</span>
                </>
              )}
            </button>

            {/* Save Button - Only visible in edit mode */}
            {isEditing && (
              <button
                data-save-button
                onClick={handleSave}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Alterações</span>
              </button>
            )}

            {/* Gerenciar Cards */}
            <button
              onClick={() => setShowPanel(true)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-300 rounded-lg text-sm font-medium transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Gerenciar Cards</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair do Painel</span>
            </button>
          </div>

          {/* Status */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isEditing ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-xs text-gray-600">
                  {isEditing ? 'Modo de Edição Ativo' : 'Modo de Visualização'}
                </span>
              </div>
            </div>
            
            {isEditing && (
              <div className="mt-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertCircle className="w-3 h-3 text-blue-600" />
                  </div>
                  <div className="text-xs text-blue-800">
                    <p className="font-semibold mb-1">Modo de Edição Ativo:</p>
                    <ul className="space-y-1 text-blue-700">
                      <li>• Clique em textos com ícone de edição</li>
                      <li>• Use Enter para salvar, Esc para cancelar</li>
                      <li>• Alterações são salvas automaticamente</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Painel de Gerenciamento de Cards */}
      {showPanel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-4 pt-32"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
          >
            {/* Header do painel */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Gerenciamento de Cards</h2>
                <p className="text-blue-100">Gerencie serviços e depoimentos</p>
              </div>
              <button
                onClick={() => setShowPanel(false)}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('services')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'services'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Serviços ({services.length})
                </button>
                <button
                  onClick={() => setActiveTab('testimonials')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'testimonials'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Depoimentos ({testimonials.length})
                </button>
                <button
                  onClick={() => setActiveTab('team')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'team'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  Equipe ({content?.about?.team?.length || 0})
                </button>
              </nav>
            </div>

            {/* Conteúdo das tabs */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {activeTab === 'services' && (
                <CardManager
                  cards={services}
                  onAdd={addService}
                  onUpdate={updateService}
                  onDelete={deleteService}
                  title="Gerenciar Serviços"
                  cardType="service"
                />
              )}

              {activeTab === 'testimonials' && (
                <CardManager
                  cards={testimonials}
                  onAdd={addTestimonial}
                  onUpdate={updateTestimonial}
                  onDelete={deleteTestimonial}
                  title="Gerenciar Depoimentos"
                  cardType="testimonial"
                />
              )}

              {activeTab === 'team' && (
                <TeamManager
                  members={content?.about?.team || []}
                  onAdd={addTeamMember}
                  onUpdate={updateTeamMember}
                  onDelete={deleteTeamMember}
                />
              )}
            </div>

            {/* Footer do painel */}
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Status:</span> {isEditing ? 'Modo de Edição Ativo' : 'Modo de Visualização'}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleResetContent}
                  className="px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors text-sm font-medium"
                >
                  Resetar Conteúdo
                </button>
                <button
                  onClick={() => setShowPanel(false)}
                  className="px-6 py-2 bg-gray-600 dark:bg-gray-500 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-400 transition-colors text-sm font-medium"
                >
                  Fechar
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}

export default AdminControls