import React from 'react'
import { motion } from 'framer-motion'
import { 
  Award, 
  Users, 
  Clock, 
  Target,
  CheckCircle,
  Star
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useContent } from '../contexts/ContentContext'
import EditableText from './EditableText'
import PhotoManager from './PhotoManager'

const About = () => {
  const { isAuthenticated } = useAuth()
  const { content, isEditing, updateContent, photos, addPhoto, updatePhoto, deletePhoto } = useContent()
  
  // Verificar se os contextos estão disponíveis
  if (!content) {
    return (
      <section id="about" className="py-20 bg-white dark:bg-gray-900">
        <div className="container-custom text-center">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded mb-4"></div>
            <div className="h-6 bg-gray-200 rounded mb-8"></div>
          </div>
        </div>
      </section>
    )
  }
  const values = [
    {
      icon: Award,
      title: content?.about?.values?.[0]?.title || 'Excelência',
      description: content?.about?.values?.[0]?.description || 'Comprometimento com a qualidade e resultados excepcionais em cada caso.'
    },
    {
      icon: Users,
      title: content?.about?.values?.[1]?.title || 'Transparência',
      description: content?.about?.values?.[1]?.description || 'Comunicação clara e honesta em todas as etapas do processo jurídico.'
    },
    {
      icon: Clock,
      title: content?.about?.values?.[2]?.title || 'Agilidade',
      description: content?.about?.values?.[2]?.description || 'Respostas rápidas e eficientes para atender às necessidades dos clientes.'
    },
    {
      icon: Target,
      title: content?.about?.values?.[3]?.title || 'Foco no Cliente',
      description: content?.about?.values?.[3]?.description || 'Soluções personalizadas que atendem às necessidades específicas de cada caso.'
    }
  ]

  const achievements = [
    { number: content?.about?.achievements?.[0]?.number || '500+', label: content?.about?.achievements?.[0]?.label || 'Casos Resolvidos' },
    { number: content?.about?.achievements?.[1]?.number || '15+', label: content?.about?.achievements?.[1]?.label || 'Anos de Experiência' }
  ]

  const team = content?.about?.team || [
    {
      name: 'Dr. João Silva',
      role: 'Sócio Fundador',
      specialty: 'Direito Civil e Empresarial',
      experience: '15 anos',
      image: '/api/placeholder/300/300'
    },
    {
      name: 'Dra. Maria Santos',
      role: 'Sócia',
      specialty: 'Direito Trabalhista',
      experience: '12 anos',
      image: '/api/placeholder/300/300'
    },
    {
      name: 'Dr. Pedro Costa',
      role: 'Advogado Sênior',
      specialty: 'Direito Tributário',
      experience: '10 anos',
      image: '/api/placeholder/300/300'
    }
  ]

  return (
    <section id="about" className="section-padding bg-white dark:bg-gray-900">
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
            Sobre Nossa Advocacia
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Experiência e compromisso com a excelência
          </p>
        </motion.div>

        {/* About Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Nossa História e Missão
            </h3>
            <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
              <EditableText
                value={content?.about?.historyText || 'Fundado em 2008, nosso escritório nasceu da paixão por defender os direitos de nossos clientes com excelência e dedicação. Ao longo dos anos, construímos uma reputação sólida baseada em resultados consistentes e relacionamentos duradouros.'}
                onSave={(value) => updateContent('about', 'historyText', value)}
                className="text-gray-600 dark:text-gray-300 leading-relaxed"
                tag="p"
                multiline={true}
                isAdmin={isAuthenticated}
                isEditingMode={isEditing}
                maxLength={300}
              />
              <EditableText
                value={content?.about?.missionText || 'Nossa missão é oferecer soluções jurídicas personalizadas, sempre priorizando a transparência, agilidade e o melhor resultado possível para cada caso. Acreditamos que o direito deve ser acessível e compreensível para todos.'}
                onSave={(value) => updateContent('about', 'missionText', value)}
                className="text-gray-600 dark:text-gray-300 leading-relaxed"
                tag="p"
                multiline={true}
                isAdmin={isAuthenticated}
                isEditingMode={isEditing}
                maxLength={300}
              />
            </div>

            {/* Key Points */}
            <div className="mt-8 space-y-3">
              {[
                'Mais de 15 anos de experiência no mercado',
                'Equipe especializada em diversas áreas do direito',
                'Atendimento personalizado e humanizado',
                'Tecnologia de ponta para agilizar processos'
              ].map((point, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{point}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl p-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white">Reconhecimento</h4>
                  <p className="text-gray-600 dark:text-gray-300">Prêmio de Excelência Jurídica 2023</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Satisfação do Cliente</span>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">4.9/5</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Tempo de Resposta</span>
                    <span className="text-sm font-medium text-green-600">&lt; 24h</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Casos Ganhos</span>
                    <span className="text-sm font-medium text-green-600">98%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Nossos Valores
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {value.title}
                </h4>
                <EditableText
                  value={value.description}
                  onSave={(newDesc) => updateContent('about', `values.${index}.description`, newDesc)}
                  className="text-gray-600 text-sm"
                  tag="p"
                  multiline={true}
                  isAdmin={isAuthenticated}
                  isEditingMode={isEditing}
                  maxLength={150}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div 
          className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 md:p-12 mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Nossos Números
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <EditableText
                  value={achievement.number}
                  onSave={(newNumber) => updateContent('about', `achievements.${index}.number`, newNumber)}
                  className="text-3xl md:text-4xl font-bold text-primary-600 mb-2"
                  tag="div"
                  isAdmin={isAuthenticated}
                  isEditingMode={isEditing}
                  maxLength={20}
                />
                <EditableText
                  value={achievement.label}
                  onSave={(newLabel) => updateContent('about', `achievements.${index}.label`, newLabel)}
                  className="text-gray-600 font-medium"
                  tag="div"
                  isAdmin={isAuthenticated}
                  isEditingMode={isEditing}
                  maxLength={30}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Client Photos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Nossos Clientes
          </h3>
          
          <PhotoManager
            photos={photos}
            onAddPhoto={addPhoto}
            onUpdatePhoto={updatePhoto}
            onDeletePhoto={deletePhoto}
            isAdmin={isAuthenticated}
            isEditingMode={isEditing}
          />
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Nossa Equipe
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                  {member.photo ? (
                    <img 
                      src={member.photo} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-gray-600 dark:text-gray-300">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  )}
                </div>
                <EditableText
                  value={member.name}
                  onSave={(newName) => updateContent('about', `team.${index}.name`, newName)}
                  className="text-lg font-semibold text-gray-900 dark:text-white mb-1"
                  tag="h4"
                  isAdmin={isAuthenticated}
                  isEditingMode={isEditing}
                  maxLength={50}
                />
                <EditableText
                  value={member.role}
                  onSave={(newRole) => updateContent('about', `team.${index}.role`, newRole)}
                  className="text-primary-600 font-medium mb-2"
                  tag="p"
                  isAdmin={isAuthenticated}
                  isEditingMode={isEditing}
                  maxLength={30}
                />
                <EditableText
                  value={member.specialty}
                  onSave={(newSpecialty) => updateContent('about', `team.${index}.specialty`, newSpecialty)}
                  className="text-gray-600 dark:text-gray-300 text-sm mb-2"
                  tag="p"
                  isAdmin={isAuthenticated}
                  isEditingMode={isEditing}
                  maxLength={50}
                />
                <EditableText
                  value={member.experience}
                  onSave={(newExperience) => updateContent('about', `team.${index}.experience`, newExperience)}
                  className="text-gray-500 dark:text-gray-400 text-xs"
                  tag="p"
                  isAdmin={isAuthenticated}
                  isEditingMode={isEditing}
                  maxLength={20}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About
