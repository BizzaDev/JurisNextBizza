import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Shield, Users, Award } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useContent } from '../contexts/ContentContext'
import EditableText from './EditableText'

const Hero = () => {
  const { isAuthenticated } = useAuth()
  const { content, isEditing, updateContent } = useContent()
  
  // Verificação de segurança para evitar erros
  const heroStats = content?.hero?.stats || []
  
  // Verificar se os contextos estão disponíveis
  if (!content) {
    return (
      <section id="home" className="relative min-h-screen flex items-center bg-gradient-to-br from-primary-50 to-white dark:from-gray-900 dark:to-gray-800 pt-20">
        <div className="container-custom text-center">
          <div className="animate-pulse">
            <div className="h-16 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 bg-gray-200 rounded mb-8"></div>
          </div>
        </div>
      </section>
    )
  }
  
  const stats = [
    { icon: Shield, value: heroStats[0]?.value || '500+', label: heroStats[0]?.label || 'Casos Resolvidos' },
    { icon: Users, value: heroStats[1]?.value || '15+', label: heroStats[1]?.label || 'Anos de Experiência' },
    { icon: Award, value: heroStats[2]?.value || '98%', label: heroStats[2]?.label || 'Taxa de Sucesso' },
  ]

  const scrollToContact = () => {
    const element = document.querySelector('#contact')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

      return (
      <section id="home" className="relative min-h-screen flex items-center bg-gradient-to-br from-primary-50 to-white dark:from-gray-900 dark:to-gray-800 pt-16 md:pt-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 sm:space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <EditableText
                  value={content?.hero?.title || 'Soluções Jurídicas Especializadas'}
                  onSave={(value) => updateContent('hero', 'title', value)}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
                  tag="h1"
                  isAdmin={isAuthenticated}
                  isEditingMode={isEditing}
                  maxLength={100}
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <EditableText
                  value={content?.hero?.subtitle || 'Oferecemos consultoria jurídica especializada com mais de 15 anos de experiência. Nossa equipe está pronta para defender seus direitos e garantir a melhor solução para seu caso.'}
                  onSave={(value) => updateContent('hero', 'subtitle', value)}
                  className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl"
                  tag="p"
                  multiline={true}
                  isAdmin={isAuthenticated}
                  isEditingMode={isEditing}
                  maxLength={300}
                />
              </motion.div>
            </div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <button 
                onClick={scrollToContact}
                className="btn-primary flex items-center justify-center space-x-2 group"
              >
                <span>Consulta Gratuita</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              
              <button 
                onClick={() => document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-secondary flex items-center justify-center space-x-2"
              >
                <span>Nossos Serviços</span>
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6 lg:gap-8 pt-6 sm:pt-8 border-t border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center px-1">
                  <div className="flex justify-center mb-1 sm:mb-2">
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-primary-600" />
                  </div>
                  <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="text-[10px] sm:text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-tight break-words">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Image/Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <div className="relative bg-gradient-to-br from-primary-100 to-primary-200 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 shadow-2xl">
              {/* Placeholder for professional image */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Proteção Legal</h3>
                      <p className="text-gray-600 dark:text-gray-300">Defesa especializada</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700 dark:text-gray-300">Consultoria jurídica personalizada</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700 dark:text-gray-300">Atendimento 24/7 para emergências</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700 dark:text-gray-300">Transparência total nos processos</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-accent-400 rounded-full opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary-400 rounded-full opacity-20"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
