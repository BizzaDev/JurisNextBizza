import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useContent } from '../contexts/ContentContext'
import EditableText from './EditableText'

const Contact = () => {
  const { isAuthenticated } = useAuth()
  const { content, isEditing, updateContent } = useContent()
  
  // Verificar se os contextos estão disponíveis
  if (!content) {
    return (
      <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container-custom text-center">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 rounded mb-8"></div>
          </div>
        </div>
      </section>
    )
  }
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // Formatar mensagem para WhatsApp
      const whatsappMessage = `*Nova Mensagem - Site Advocacia*

*Nome:* ${formData.name}
*E-mail:* ${formData.email}
*Telefone:* ${formData.phone}
*Assunto:* ${formData.subject}

*Mensagem:*
${formData.message}

---
Enviado através do site em ${new Date().toLocaleString('pt-BR')}`

      // Número do WhatsApp (formato internacional)
      const phoneNumber = content?.contact?.info?.[0]?.details?.[0] 
        ? content.contact.info[0].details[0].replace(/\D/g, '') // Remove todos os caracteres não numéricos
        : '5592994536158' // Fallback
      
      // URL do WhatsApp Web
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`
      
      // Abrir WhatsApp em nova aba
      window.open(whatsappUrl, '_blank')
      
      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Mapear ícones para os dados do contexto
  const iconMap = [Phone, Mail, MapPin, Clock]
  
  // Dados padrão de fallback
  const defaultContactInfo = [
    {
      icon: Phone,
      title: 'Telefone',
      details: ['(92) 99453-6158', '(92) 3333-4444'],
      description: 'Segunda a Sexta, 8h às 18h'
    },
    {
      icon: Mail,
      title: 'E-mail',
      details: ['contato@advocacia.com.br', 'emergencia@advocacia.com.br'],
      description: 'Resposta em até 24 horas'
    },
    {
      icon: MapPin,
      title: 'Endereço',
      details: ['Av. Paulista, 1000', 'Bela Vista - São Paulo/SP', 'CEP: 01310-100'],
      description: 'Próximo ao metrô Trianon-MASP'
    },
    {
      icon: Clock,
      title: 'Horário de Funcionamento',
      details: ['Segunda a Sexta: 8h às 18h', 'Sábado: 8h às 12h'],
      description: 'Atendimento de emergência 24h'
    }
  ]

  // Função para verificar se é um array válido
  const isValidArray = (arr) => {
    return Array.isArray(arr) && arr.length > 0
  }

  // Função para normalizar dados de contato
  const normalizeContactInfo = (info) => {
    if (!info || typeof info !== 'object') return defaultContactInfo
    
    // Se for um array, usar diretamente
    if (Array.isArray(info)) {
      return info.map((item, index) => ({
        ...item,
        icon: iconMap[index] || Phone,
        title: item.title || defaultContactInfo[index]?.title || 'Contato',
        details: Array.isArray(item.details) ? item.details : [item.details || ''],
        description: item.description || defaultContactInfo[index]?.description || ''
      }))
    }
    
    // Se for um objeto, tentar extrair array ou usar fallback
    if (info.info && Array.isArray(info.info)) {
      return info.info.map((item, index) => ({
        ...item,
        icon: iconMap[index] || Phone,
        title: item.title || defaultContactInfo[index]?.title || 'Contato',
        details: Array.isArray(item.details) ? item.details : [item.details || ''],
        description: item.description || defaultContactInfo[index]?.description || ''
      }))
    }
    
    // Fallback para dados padrão
    return defaultContactInfo
  }

  // Obter dados de contato com verificações robustas
  const contactInfo = React.useMemo(() => {
    try {
      const contactData = content?.contact?.info
      return normalizeContactInfo(contactData)
    } catch (error) {
      console.error('Erro ao processar dados de contato:', error)
      return defaultContactInfo
    }
  }, [content?.contact?.info])

  return (
    <section id="contact" className="section-padding bg-white dark:bg-gray-900">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Entre em Contato
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Estamos prontos para ajudar você
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Informações de Contato
            </h3>
            
            <div className="space-y-8">
              {contactInfo && Array.isArray(contactInfo) && contactInfo.length > 0 ? contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {info.title}
                    </h4>
                    <div className="space-y-1">
                      {info.details.map((detail, detailIndex) => (
                        <EditableText
                          key={detailIndex}
                          value={detail}
                          onSave={(newDetail) => updateContent('contact', `info.${index}.details.${detailIndex}`, newDetail)}
                          className="text-gray-700 dark:text-gray-300"
                          tag="p"
                          isAdmin={isAuthenticated}
                          isEditingMode={isEditing}
                          maxLength={50}
                        />
                      ))}
                    </div>
                    <EditableText
                      value={info.description}
                      onSave={(newDesc) => updateContent('contact', `info.${index}.description`, newDesc)}
                      className="text-sm text-gray-500 dark:text-gray-400 mt-2"
                      tag="p"
                      isAdmin={isAuthenticated}
                      isEditingMode={isEditing}
                      maxLength={100}
                    />
                  </div>
                </motion.div>
              )) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Carregando informações de contato...</p>
                </div>
              )}
            </div>

            {/* Emergency Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-12 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6"
            >
              <EditableText
                value={content?.contact?.emergencyTitle || 'Emergência 24h'}
                onSave={(value) => updateContent('contact', 'emergencyTitle', value)}
                className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2"
                tag="h4"
                isAdmin={isAuthenticated}
                isEditingMode={isEditing}
                maxLength={30}
              />
              <EditableText
                value={content?.contact?.emergencyText || 'Para casos urgentes que não podem esperar o horário comercial.'}
                onSave={(value) => updateContent('contact', 'emergencyText', value)}
                className="text-red-700 dark:text-red-300 mb-4"
                tag="p"
                multiline={true}
                isAdmin={isAuthenticated}
                isEditingMode={isEditing}
                maxLength={100}
              />
              <EditableText
                value={content?.contact?.emergencyPhone || '(92) 99453-6158'}
                onSave={(value) => updateContent('contact', 'emergencyPhone', value)}
                className="text-red-600 font-semibold hover:text-red-700 transition-colors duration-200"
                tag="a"
                isAdmin={isAuthenticated}
                isEditingMode={isEditing}
                maxLength={20}
              />
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Envie sua Mensagem
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                      placeholder="Seu nome completo"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Assunto *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                    >
                      <option value="">Selecione o assunto</option>
                      <option value="consulta">Consulta Jurídica</option>
                      <option value="civil">Direito Civil</option>
                      <option value="trabalhista">Direito Trabalhista</option>
                      <option value="empresarial">Direito Empresarial</option>
                      <option value="consumidor">Direito do Consumidor</option>
                      <option value="tributario">Direito Tributário</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mensagem *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 resize-none"
                    placeholder="Descreva brevemente sua situação ou dúvida..."
                  />
                </div>

                {/* Submit Status */}
                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Formulário preenchido! O WhatsApp foi aberto com sua mensagem. Envie para finalizar o contato.</span>
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg"
                  >
                    <AlertCircle className="w-5 h-5" />
                    <span>Erro ao enviar mensagem. Tente novamente ou entre em contato por telefone.</span>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Enviar Mensagem</span>
                    </>
                  )}
                </button>
              </form>

              <p className="text-sm text-gray-500 mt-4 text-center">
                * Campos obrigatórios. Seus dados estão seguros conosco.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact
