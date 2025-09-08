import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { createServiceCard, deleteServiceCard, selectAllServiceCards, updateServiceCard } from '../services/cads/services-cards';

const ContentContext = createContext()

export const useContent = () => {
  const context = useContext(ContentContext)
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider')
  }
  return context
}

// Dados padrão
const defaultData = {
  content: {
    header: {
      logo: "Advocacia",
      tagline: "Soluções Jurídicas",
      phone: "(92) 99453-6158",
      email: "contato@advocacia.com.br",
      hours: "Segunda a Sexta: 8h às 18h"
    },
    hero: {
      title: "Defendemos seus direitos com excelênciaaa",
      subtitle: "Especialistas em direito civil, trabalhista e empresarial. Oferecemos soluções jurídicas personalizadas com transparência, agilidade e resultados comprovados.",
      description: "Oferecemos serviços jurídicos especializados para empresas e pessoas físicas, garantindo a melhor defesa dos seus interesses.",
      protectionTitle: "Proteção Legal",
      protectionSubtitle: "Defesa especializada",
      features: [
        "Consultoria jurídica personalizada",
        "Atendimento 24/7 para emergências",
        "Transparência total nos processos"
      ],
      stats: [
        { value: "500+", label: "Casos Resolvidos" },
        { value: "15+", label: "Anos de Experiência" },
        { value: "98%", label: "Taxa de Sucesso" }
      ]
    },
    services: {
      title: "Nossos Serviços",
      subtitle: "Oferecemos soluções jurídicas especializadas em diversas áreas do direito, sempre com foco na excelência e nos melhores resultados para nossos clientes."
    },
    about: {
      title: "Sobre Nós",
      subtitle: "Uma equipe de advogados especializados comprometida em oferecer soluções jurídicas de excelência com transparência e agilidade.",
      historyTitle: "Nossa História e Missão",
      historyText: "Fundado em 2008, nosso escritório nasceu da paixão por defender os direitos de nossos clientes com excelência e dedicação. Ao longo dos anos, construímos uma reputação sólida baseada em resultados consistentes e relacionamentos duradouros.",
      missionText: "Nossa missão é oferecer soluções jurídicas personalizadas, sempre priorizando a transparência, agilidade e o melhor resultado possível para cada caso. Acreditamos que o direito deve ser acessível e compreensível para todos.",
      valuesTitle: "Nossos Valores",
      values: [
        {
          title: "Excelência",
          description: "Comprometimento com a qualidade e resultados excepcionais em cada caso."
        },
        {
          title: "Transparência",
          description: "Comunicação clara e honesta em todas as etapas do processo jurídico."
        },
        {
          title: "Agilidade",
          description: "Respostas rápidas e eficientes para atender às necessidades dos clientes."
        },
        {
          title: "Foco no Cliente",
          description: "Soluções personalizadas que atendem às necessidades específicas de cada caso."
        }
      ],
      achievementsTitle: "Nossos Números",
      achievements: [
        {
          number: "500+",
          label: "Casos Resolvidos"
        },
        {
          number: "15+",
          label: "Anos de Experiência"
        }
      ],
      photosTitle: "Nossos Clientes",
      team: [
        {
          id: 1,
          name: "Dr. João Silva",
          role: "Sócio Fundador",
          specialty: "Direito Civil e Empresarial",
          experience: "15 anos",
          photo: null
        },
        {
          id: 2,
          name: "Dra. Maria Santos",
          role: "Sócia",
          specialty: "Direito Trabalhista",
          experience: "12 anos",
          photo: null
        },
        {
          id: 3,
          name: "Dr. Pedro Costa",
          role: "Advogado Sênior",
          specialty: "Direito Tributário",
          experience: "10 anos",
          photo: null
        }
      ]
    },
    testimonials: {
      title: "O que nossos clientes dizem",
      subtitle: "Depoimentos de quem confia em nosso trabalho"
    },
    contact: {
      title: "Entre em Contato",
      subtitle: "Estamos prontos para ajudá-lo com suas questões jurídicas. Entre em contato conosco e agende uma consulta gratuita.",
      infoTitle: "Informações de Contato",
      info: [
        {
          title: "Telefone",
          details: ["(92) 99453-6158", "(92) 3333-4444"],
          description: "Segunda a Sexta, 8h às 18h"
        },
        {
          title: "E-mail",
          details: ["contato@advocacia.com.br", "emergencia@advocacia.com.br"],
          description: "Resposta em até 24 horas"
        },
        {
          title: "Endereço",
          details: ["Av. Paulista, 1000", "Bela Vista - São Paulo/SP", "CEP: 01310-100"],
          description: "Próximo ao metrô Trianon-MASP"
        },
        {
          title: "Horário de Funcionamento",
          details: ["Segunda a Sexta: 8h às 18h", "Sábado: 8h às 12h"],
          description: "Atendimento de emergência 24h"
        }
      ],
      emergencyTitle: "Emergência 24h",
      emergencyText: "Para casos urgentes que não podem esperar o horário comercial.",
      emergencyPhone: "(92) 99453-6158",
      formTitle: "Envie sua Mensagem"
    },
    footer: {
      description: "Sua advocacia de confiança, oferecendo soluções jurídicas especializadas com transparência e excelência.",
      address: "Rua das Flores, 123 - Centro, Manaus - AM",
      phone: "(92) 99453-6158",
      email: "contato@advocacia.com.br",
      copyright: "© 2024 Advocacia. Todos os direitos reservados."
    }
  },
  
  testimonials: [
    {
      id: 1,
      name: "Maria Silva",
      role: "Empresária",
      content: "Excelente atendimento! Resolveram minha questão trabalhista de forma rápida e eficiente.",
      rating: 5
    },
    {
      id: 2,
      name: "João Santos",
      role: "Executivo",
      content: "Profissionais competentes e dedicados. Recomendo para qualquer questão jurídica.",
      rating: 5
    },
    {
      id: 3,
      name: "Ana Costa",
      role: "Advogada",
      content: "Parceria de longa data. Sempre atenciosos e com resultados excepcionais.",
      rating: 5
    }
  ],
  photos: []
}

export const ContentProvider = ({ children }) => {
  // Estados
  const [content, setContent] = useState(defaultData.content)
  const [services, setServices] = useState([])
  const [testimonials, setTestimonials] = useState(defaultData.testimonials)
  const [photos, setPhotos] = useState(defaultData.photos)
  const [isEditing, setIsEditing] = useState(false)



  // Carregar dados salvos
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedContent = localStorage.getItem('admin-content')
        const savedTestimonials = localStorage.getItem('admin-testimonials')
        const savedPhotos = localStorage.getItem('admin-photos')
        
        if (savedContent) setContent(JSON.parse(savedContent))
        if (savedTestimonials) setTestimonials(JSON.parse(savedTestimonials))
        if (savedPhotos) setPhotos(JSON.parse(savedPhotos))
        
        // Carregar serviços do banco de dados
        await getAllServices()
        
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }
    
    loadData()
  }, [])

  // Salvar dados automaticamente
  useEffect(() => {
    localStorage.setItem('admin-content', JSON.stringify(content))
  }, [content])

  // Serviços agora são carregados do banco de dados, não salvos no localStorage

  useEffect(() => {
    localStorage.setItem('admin-testimonials', JSON.stringify(testimonials))
  }, [testimonials])

  useEffect(() => {
    localStorage.setItem('admin-photos', JSON.stringify(photos))
  }, [photos])

  // Função para atualizar conteúdo
  const updateContent = useCallback((section, field, value) => {
    setContent(prev => {
      if (field.includes('.')) {
        // Campo aninhado
        const keys = field.split('.')
        const newContent = { ...prev }
        let current = newContent[section]
        
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]]
        }
        current[keys[keys.length - 1]] = value
        
        return newContent
      } else {
        // Campo simples
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value
          }
        }
      }
    })
  }, [])

  // Funções CRUD para serviços
  const addService = useCallback(async (service) => {
    const id  = crypto.randomUUID()
    const newServiceApi = {
      id: id, // ou outro gerador de ID
      title: service.title,        // varchar
      description: service.description, // text
      icon: service.icon,          // varchar
      color: service.color || '#ffffff', // varchar, padrão opcional
      order_index: service.order_index || 0, // int2, padrão opcional
      is_active: service.is_active ?? true,  // bool, padrão true
      created_at: new Date().toISOString(),  // timestamp
      updated_at: new Date().toISOString(),  // timestamp
    };

    const response = await createServiceCard(newServiceApi)
    
    // Sempre adiciona ao estado local, independente da resposta do banco
   
    if(response){

    const newService = {
      ...service,
      id: response?.id || id
    }
    setServices(prev => [...prev, newService])
   }

  }, [])

  const updateService = useCallback(async (id, updatedService) => {
    const response = await updateServiceCard(id, updatedService)
    if(response){
     await getAllServices()
    }
  }, [])

  const deleteService = useCallback(async (id) => {
    const response = await deleteServiceCard(id)
    if(response){
    setServices(prev => prev.filter(service => service.id !== id))
    }
  }, [])

  const getAllServices = useCallback(async () => {
    const response = await selectAllServiceCards()
    console.log('dadps.response',response)
    if(response){
      setServices(response)
    }
  }, [services])



  // Funções CRUD para depoimentos
  const addTestimonial = useCallback((testimonial) => {
    const newTestimonial = { ...testimonial, id: Date.now() }
    setTestimonials(prev => [...prev, newTestimonial])
  }, [])

  const updateTestimonial = useCallback((id, updatedTestimonial) => {
    setTestimonials(prev => prev.map(testimonial => 
      testimonial.id === id ? { ...testimonial, ...updatedTestimonial } : testimonial
    ))
  }, [])

  const deleteTestimonial = useCallback((id) => {
    setTestimonials(prev => prev.filter(testimonial => testimonial.id !== id))
  }, [])

  // Funções CRUD para fotos
  const addPhoto = useCallback((photo) => {
    const newPhoto = { ...photo, id: Date.now() }
    setPhotos(prev => [...prev, newPhoto])
  }, [])

  const updatePhoto = useCallback((id, updatedPhoto) => {
    setPhotos(prev => prev.map(photo => 
      photo.id === id ? { ...photo, ...updatedPhoto } : photo
    ))
  }, [])

  const deletePhoto = useCallback((id) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id))
  }, [])

  // Funções CRUD para equipe
  const addTeamMember = useCallback((memberData) => {
    const newMember = {
      id: Date.now(),
      name: memberData.name || "Novo Membro",
      role: memberData.role || "Cargo",
      specialty: memberData.specialty || "Especialidade",
      experience: memberData.experience || "0 anos",
      photo: memberData.photo || null
    }
    setContent(prev => ({
      ...prev,
      about: {
        ...prev.about,
        team: [...prev.about.team, newMember]
      }
    }))
  }, [])

  const updateTeamMember = useCallback((id, memberData) => {
    setContent(prev => ({
      ...prev,
      about: {
        ...prev.about,
        team: prev.about.team.map(member => 
          member.id === id ? { ...member, ...memberData } : member
        )
      }
    }))
  }, [])

  const deleteTeamMember = useCallback((id) => {
    setContent(prev => ({
      ...prev,
      about: {
        ...prev.about,
        team: prev.about.team.filter(member => member.id !== id)
      }
    }))
  }, [])

  // Controle de edição
  const toggleEditing = useCallback(() => {
    setIsEditing(prev => !prev)
  }, [])

  const saveContent = useCallback(async () => {
    try {
      localStorage.setItem('admin-content', JSON.stringify(content))
      // Serviços são salvos no banco de dados, não no localStorage
      localStorage.setItem('admin-testimonials', JSON.stringify(testimonials))
      localStorage.setItem('admin-photos', JSON.stringify(photos))
      console.log('Conteúdo salvo com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar conteúdo:', error)
      throw error
    }
  }, [content, testimonials, photos])

  // Valor do contexto
  const value = useMemo(() => ({
    // Estados
    content,
    services,
    testimonials,
    photos,
    isEditing,
    
    // Funções de controle
    setIsEditing,
    toggleEditing,
    updateContent,
    saveContent,
    
    // CRUD de serviços
    addService,
    updateService,
    deleteService,
    getAllServices,
    
    // CRUD de depoimentos
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    
    // CRUD de fotos
    addPhoto,
    updatePhoto,
    deletePhoto,
    
    // CRUD de equipe
    addTeamMember,
    updateTeamMember,
    deleteTeamMember
  }), [
    content,
    services,
    testimonials,
    photos,
    isEditing,
    toggleEditing,
    updateContent,
    saveContent,
    addService,
    updateService,
    deleteService,
    getAllServices,
    addTestimonial,
    updateTestimonial,
    deleteTestimonial,
    addPhoto,
    updatePhoto,
    deletePhoto,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember
  ])

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  )
}