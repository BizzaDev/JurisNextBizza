import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useContent } from '../contexts/ContentContext'
import AdminControls from '../components/AdminControls'
import Header from '../components/Header'
import Hero from '../components/Hero'
import Services from '../components/Services'
import About from '../components/About'
import Testimonials from '../components/Testimonials'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import Chatbot from '../components/Chatbot'
import ScrollToTop from '../components/ScrollToTop'

const AdminLayout = () => {
  const { isAuthenticated, user } = useAuth()
  const { isEditing, toggleEditing } = useContent()

  // Se não estiver autenticado, redirecionar para login
  if (!isAuthenticated) {
    window.location.href = '/login'
    return null
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 relative">
      <ScrollToTop />
      
      {/* Controles de Administração */}
      <AdminControls />
      
      {/* Overlay de Modo de Edição - Melhorado */}
      {isEditing && (
        <div className="fixed inset-0 z-30 pointer-events-none">
          {/* Overlay sutil */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-blue-900/20 dark:to-purple-900/20"></div>
          
          {/* Indicadores de Status */}
          <div className="absolute top-36 left-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-xl shadow-xl">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <div>
                <p className="text-sm font-semibold">Modo de Edição Ativo</p>
                <p className="text-xs opacity-90">Clique nos elementos destacados para editar</p>
              </div>
            </div>
          </div>
          
          {/* Instruções */}
          <div className="absolute top-36 right-4 bg-white dark:bg-gray-800 border-2 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-300 px-4 py-3 rounded-xl shadow-xl max-w-xs">
            <div className="flex items-start space-x-2">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-xs font-bold">!</span>
              </div>
              <div>
                <p className="text-sm font-medium">Como editar:</p>
                <ul className="text-xs mt-1 space-y-1">
                  <li>• Clique em textos destacados</li>
                  <li>• Use Enter para salvar</li>
                  <li>• Use Esc para cancelar</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Principal com Indicadores Visuais */}
      <div className={`relative transition-all duration-300 ${
        isEditing 
          ? 'before:absolute before:inset-0 before:bg-blue-500/5 before:pointer-events-none before:z-10' 
          : ''
      }`}>
        <Header />
        <main>
          <Hero />
          <Services />
          <About />
          <Testimonials />
          <Contact />
        </main>
        <Footer />
        <Chatbot />
      </div>
    </div>
  )
}

export default AdminLayout
