import React from 'react'
import { motion } from 'framer-motion'
import { 
  Scale, 
  Briefcase, 
  Building2, 
  Users, 
  FileText, 
  Shield,
  ArrowRight 
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useContent } from '../contexts/ContentContext'
import EditableText from './EditableText'

const Services = () => {
  const { isAuthenticated } = useAuth()
  const { content, services: adminServices, isEditing, updateContent } = useContent()
  
  // Verificar se os contextos estão disponíveis
  if (!content) {
    return (
      <section id="services" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container-custom text-center">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 rounded mb-8"></div>
          </div>
        </div>
      </section>
    )
  }
  
  // Use admin services if available, otherwise use default
  const services = adminServices.length > 0 ? adminServices.map(service => ({
    icon: Scale, // Default icon, will be mapped based on service.icon
    title: service.title,
    description: service.description,
    features: [], // Simplified for now
    color: 'from-blue-500 to-blue-600'
  })) :[]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  }

  return (
    <section id="services" className="section-padding bg-gray-50 dark:bg-gray-800">
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
            Nossos Serviços
          </h2>
          <EditableText
            value={content?.services?.subtitle || 'Oferecemos uma gama completa de serviços jurídicos para atender todas as suas necessidades legais com excelência e dedicação.'}
            onSave={(value) => updateContent('services', 'subtitle', value)}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            tag="p"
            multiline={true}
            isAdmin={isAuthenticated}
            isEditingMode={isEditing}
            maxLength={200}
          />
        </motion.div>

        {/* Services Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white dark:bg-gray-700 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {service.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {service.description}
              </p>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button className="flex items-center space-x-2 text-primary-600 font-medium group-hover:text-primary-700 transition-colors duration-200">
                <span>Saiba mais</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="bg-primary-600 rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Precisa de Ajuda Jurídica?
            </h3>
            <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
              Nossa equipe de especialistas está pronta para oferecer a melhor solução 
              para seu caso. Agende uma consulta gratuita e tire suas dúvidas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-primary-600 hover:bg-gray-50 font-medium py-3 px-8 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
              >
                Consulta Gratuita
              </button>
              <button className="border border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600">
                (11) 99999-9999
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Services
