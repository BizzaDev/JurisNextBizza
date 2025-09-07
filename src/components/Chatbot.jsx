import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import emailjs from 'emailjs-com'
import { EMAILJS_CONFIG } from '../config/emailjs'
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User,
  Phone,
  Mail,
  Clock,
  FileText,
  Scale,
  Briefcase,
  Building2,
  Users,
  Shield,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Download,
  Calendar,
  Loader2
} from 'lucide-react'

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [currentFormData, setCurrentFormData] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const messagesEndRef = useRef(null)

  // EmailJS Configuration
  const EMAILJS_SERVICE_ID = EMAILJS_CONFIG.SERVICE_ID
  const EMAILJS_TEMPLATE_ID = EMAILJS_CONFIG.TEMPLATE_ID
  const EMAILJS_PUBLIC_KEY = EMAILJS_CONFIG.PUBLIC_KEY

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        setMessages([
          {
            id: 1,
            text: "Olá! 👋 Sou o Dr. Bot, seu assistente jurídico virtual. Como posso ajudá-lo hoje?",
            sender: 'bot',
            timestamp: new Date(),
            type: 'welcome'
          }
        ])
        setTimeout(() => setShowOptions(true), 1000)
      }, 500)
    }
  }, [isOpen])

  // Base de dados real de conhecimento jurídico
  const legalKnowledge = {
    "direito civil": {
      title: "Direito Civil",
      description: "Área que regula as relações entre particulares",
      services: [
        "Contratos e Acordos",
        "Responsabilidade Civil", 
        "Direito de Família",
        "Sucessões e Heranças",
        "Danos Morais",
        "Direito do Consumidor",
        "Locação e Compra e Venda"
      ],
      commonQuestions: [
        "Como fazer um contrato de locação?",
        "Quais são os direitos do consumidor?",
        "Como funciona o divórcio?",
        "O que é dano moral?"
      ]
    },
    "direito trabalhista": {
      title: "Direito Trabalhista",
      description: "Protege os direitos dos trabalhadores",
      services: [
        "Rescisão de Contrato",
        "Cálculo de Rescisão",
        "FGTS e Multas",
        "Horas Extras",
        "Assédio Moral",
        "Acidentes de Trabalho",
        "Sindicatos e Acordos"
      ],
      commonQuestions: [
        "Como calcular minha rescisão?",
        "Tenho direito a horas extras?",
        "O que fazer em caso de assédio?",
        "Como reclamar FGTS?"
      ]
    },
    "direito empresarial": {
      title: "Direito Empresarial",
      description: "Regula as atividades empresariais",
      services: [
        "Constituição de Empresas",
        "Contratos Comerciais",
        "Recuperação Judicial",
        "Falência",
        "Compliance",
        "Fusões e Aquisições",
        "Propriedade Intelectual"
      ],
      commonQuestions: [
        "Como abrir uma empresa?",
        "Qual o melhor tipo societário?",
        "Como fazer recuperação judicial?",
        "O que é compliance?"
      ]
    },
    "direito tributário": {
      title: "Direito Tributário",
      description: "Regula as obrigações tributárias",
      services: [
        "Planejamento Tributário",
        "Execuções Fiscais",
        "Recuperação de Créditos",
        "Parcelamentos",
        "Defesas Administrativas",
        "Consultoria Tributária"
      ],
      commonQuestions: [
        "Como parcelar dívidas fiscais?",
        "Tenho direito a restituição?",
        "Como evitar execução fiscal?",
        "O que é planejamento tributário?"
      ]
    },
    "direito do consumidor": {
      title: "Direito do Consumidor",
      description: "Protege os direitos dos consumidores",
      services: [
        "Defesa do Consumidor",
        "Produtos com Defeito",
        "Serviços Mal Prestados",
        "Cobranças Indevidas",
        "Ações Coletivas",
        "Procon e Órgãos de Defesa"
      ],
      commonQuestions: [
        "Produto com defeito, o que fazer?",
        "Como cancelar contrato?",
        "Cobrança indevida, como agir?",
        "Direitos em viagens canceladas?"
      ]
    }
  }

  const commonScenarios = [
    {
      title: "Problema Trabalhista",
      description: "Demissão, assédio, horas extras...",
      icon: Briefcase,
      questions: [
        "Fui demitido sem justa causa",
        "Não recebi minhas horas extras",
        "Sofro assédio no trabalho",
        "Quero calcular minha rescisão"
      ]
    },
    {
      title: "Questão Familiar",
      description: "Divórcio, pensão, herança...",
      icon: Users,
      questions: [
        "Como fazer divórcio consensual?",
        "Preciso de pensão alimentícia",
        "Questão de herança",
        "Guarda de filhos"
      ]
    },
    {
      title: "Problema de Consumo",
      description: "Produtos com defeito, cobranças...",
      icon: Shield,
      questions: [
        "Produto com defeito",
        "Cobrança indevida",
        "Serviço mal prestado",
        "Contrato abusivo"
      ]
    },
    {
      title: "Questão Empresarial",
      description: "Abrir empresa, contratos...",
      icon: Building2,
      questions: [
        "Como abrir uma empresa?",
        "Contrato comercial",
        "Recuperação judicial",
        "Fusão de empresas"
      ]
    }
  ]

  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase()
    
    // Respostas específicas para perguntas comuns
    if (message.includes('rescisão') || message.includes('demissão')) {
      return {
        text: `📋 **Rescisão de Contrato de Trabalho**

**Tipos de Rescisão:**
• **Sem justa causa** (empregador demite): 13º + FGTS + multa de 40%
• **Com justa causa** (empregado comete falta grave): sem direitos
• **Pedido de demissão**: apenas FGTS

**Direitos em caso de demissão sem justa causa:**
✅ Saldo de salário
✅ Férias vencidas + 1/3
✅ 13º salário proporcional
✅ FGTS + multa de 40%
✅ Aviso prévio (30 dias ou indenização)

**Quer que eu calcule sua rescisão?** Preciso de algumas informações:
• Salário atual
• Data de admissão
• Data de demissão
• Tipo de demissão

Ou prefere **agendar uma consulta gratuita** com nossos especialistas?`,
        type: 'rescisao',
        actions: [
          { text: "Calcular Rescisão", action: "calcular_rescisao" },
          { text: "Agendar Consulta", action: "agendar_consulta" },
          { text: "Falar no WhatsApp", action: "whatsapp" }
        ]
      }
    }

    if (message.includes('fgts') || message.includes('multa')) {
      return {
        text: `💰 **FGTS e Multas**

**O que é FGTS:**
Fundo de Garantia por Tempo de Serviço - 8% do salário depositado mensalmente

**Quando você tem direito:**
✅ Demissão sem justa causa
✅ Aposentadoria
✅ Falecimento
✅ Doença grave (HIV, câncer, etc.)

**Multa de 40%:**
• Sobre o saldo total do FGTS
• Apenas em demissão sem justa causa
• Empregador paga ao funcionário

**Como sacar:**
🏦 **Caixa Econômica Federal**
📱 **App FGTS**
💳 **Cartão de débito Caixa**

**Valores aproximados:**
• Salário R$ 1.500/mês = R$ 120/mês de FGTS
• 2 anos de trabalho = R$ 2.880 + multa R$ 1.152 = **R$ 4.032**

**Precisa de ajuda para calcular ou sacar?**`,
        type: 'fgts',
        actions: [
          { text: "Calcular FGTS", action: "calcular_fgts" },
          { text: "Como Sacar", action: "como_sacar" },
          { text: "Falar no WhatsApp", action: "whatsapp" }
        ]
      }
    }

    if (message.includes('assédio') || message.includes('assedio')) {
      return {
        text: `⚠️ **Assédio Moral no Trabalho**

**O que é Assédio Moral:**
Conduta abusiva que humilha, constrange ou isola o trabalhador

**Exemplos de Assédio:**
• Gritos e xingamentos
• Isolamento social
• Sobrecarga de trabalho
• Críticas constantes
• Pressionar para pedir demissão

**Seus Direitos:**
✅ **Indenização por danos morais**
✅ **Estabilidade provisória** (12 meses)
✅ **Rescisão indireta** (com todos os direitos)
✅ **Ação trabalhista** contra a empresa

**O que fazer AGORA:**
1. 📱 **Documente tudo** (fotos, áudios, testemunhas)
2. 📝 **Faça denúncia** no RH ou sindicato
3. 🏥 **Procure um médico** (estresse pode gerar afastamento)
4. ⚖️ **Procure um advogado** especializado

**Este é um caso URGENTE!** Recomendo contato imediato.`,
        type: 'assedio',
        actions: [
          { text: "Falar URGENTE no WhatsApp", action: "whatsapp_urgente" },
          { text: "Como Documentar", action: "como_documentar" },
          { text: "Direitos Específicos", action: "direitos_assedio" }
        ]
      }
    }

    if (message.includes('divórcio') || message.includes('divorcio')) {
      return {
        text: `💔 **Divórcio - Guia Completo**

**Tipos de Divórcio:**

**1. Divórcio Consensual (mais rápido):**
✅ Acordo entre os cônjuges
✅ Processo mais rápido (1-2 meses)
✅ Menor custo
✅ Pode ser feito em cartório

**2. Divórcio Litigioso:**
⚖️ Sem acordo entre as partes
⏰ Processo mais longo (6-12 meses)
💰 Maior custo
🏛️ Necessita de advogado

**O que Definir:**
• **Guarda dos filhos** (compartilhada ou unilateral)
• **Pensão alimentícia** (para filhos e cônjuge)
• **Divisão de bens** (comunhão parcial ou total)
• **Visitas e convivência**

**Documentos Necessários:**
📄 Certidão de casamento
📄 RG e CPF
📄 Comprovante de residência
📄 Certidão de nascimento dos filhos

**Quer saber mais sobre algum aspecto específico?**`,
        type: 'divorcio',
        actions: [
          { text: "Divórcio Consensual", action: "divorcio_consensual" },
          { text: "Pensão Alimentícia", action: "pensao_alimenticia" },
          { text: "Agendar Consulta", action: "agendar_consulta" }
        ]
      }
    }

    if (message.includes('pensão') || message.includes('pensao')) {
      return {
        text: `💸 **Pensão Alimentícia - Direitos e Deveres**

**O que é Pensão Alimentícia:**
Valor pago para garantir necessidades básicas (alimentação, moradia, saúde, educação)

**Quem tem Direito:**
✅ **Filhos menores de 18 anos**
✅ **Filhos maiores** (até 24 anos se estudando)
✅ **Cônjuge** (em casos específicos)
✅ **Pais idosos** (quando necessário)

**Como Calcular:**
• **Filhos:** 15-30% da renda do alimentante
• **Cônjuge:** 20-30% da renda
• **Considerar:** necessidades do alimentado e possibilidades do alimentante

**O que Inclui:**
🍽️ Alimentação
🏠 Moradia
👕 Vestuário
🏥 Saúde
📚 Educação
🚌 Transporte

**O que NÃO Inclui:**
❌ Luxos ou supérfluos
❌ Viagens de lazer
❌ Presentes caros
❌ Hobbies dispendiosos

**Como Solicitar:**
1. **Acordo extrajudicial** (mais rápido)
2. **Ação judicial** (quando não há acordo)

**Precisa de ajuda para calcular ou solicitar?**`,
        type: 'pensao',
        actions: [
          { text: "Calcular Pensão", action: "calcular_pensao" },
          { text: "Como Solicitar", action: "como_solicitar_pensao" },
          { text: "Falar no WhatsApp", action: "whatsapp" }
        ]
      }
    }

    // Respostas para áreas do direito
    for (const [key, area] of Object.entries(legalKnowledge)) {
      if (message.includes(key) || message.includes(area.title.toLowerCase())) {
        return {
          text: `⚖️ **${area.title}**

${area.description}

**Nossos Serviços:**
${area.services.map(service => `• ${service}`).join('\n')}

**Perguntas Frequentes:**
${area.commonQuestions.map(q => `• ${q}`).join('\n')}

**Como posso ajudá-lo especificamente com ${area.title.toLowerCase()}?**`,
          type: 'area_direito',
          actions: [
            { text: "Ver Serviços", action: `ver_servicos_${key}` },
            { text: "Fazer Pergunta", action: "fazer_pergunta" },
            { text: "Agendar Consulta", action: "agendar_consulta" }
          ]
        }
      }
    }

    // Resposta padrão
    return {
      text: `🤔 **Entendi sua dúvida!**

Para um atendimento mais personalizado e preciso, recomendo que você:

**1. 📱 Fale diretamente conosco:**
• **WhatsApp:** (92) 99453-6158
• **Telefone:** (92) 99453-6158

**2. 📧 Envie um e-mail detalhado:**
• **E-mail:** mota.216573@gmail.com

**3. 🗓️ Agende uma consulta gratuita:**
• **Primeira consulta:** Sem custo
• **Análise personalizada** do seu caso
• **Orientações específicas** para sua situação

**4. 📋 Preencha nosso formulário:**
Posso abrir um formulário detalhado para você preencher com todas as informações do seu caso.

**Qual opção prefere?**`,
      type: 'default',
      actions: [
        { text: "Abrir Formulário", action: "abrir_formulario" },
        { text: "WhatsApp Direto", action: "whatsapp" },
        { text: "Enviar E-mail", action: "enviar_email" },
        { text: "Agendar Consulta", action: "agendar_consulta" }
      ]
    }
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    setTimeout(() => {
      const response = getBotResponse(inputValue)
      
      const botMessage = {
        id: Date.now() + 1,
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        type: response.type,
        actions: response.actions
      }

      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleAction = (action) => {
    switch (action) {
      case 'whatsapp':
        const whatsappUrl = `https://wa.me/5592994536158?text=Olá! Vim através do chatbot do site e gostaria de mais informações sobre meu caso jurídico.`
        window.open(whatsappUrl, '_blank')
        break
      
      case 'whatsapp_urgente':
        const whatsappUrgenteUrl = `https://wa.me/5592994536158?text=🚨 URGENTE! Preciso de atendimento jurídico imediato. Vim através do chatbot.`
        window.open(whatsappUrgenteUrl, '_blank')
        break
      
      case 'enviar_email':
        const emailUrl = `mailto:mota.216573@gmail.com?subject=Consulta Jurídica - Site&body=Olá!%0D%0A%0D%0AVim através do chatbot do site e gostaria de mais informações sobre meu caso jurídico.%0D%0A%0D%0APor favor, entre em contato comigo.%0D%0A%0D%0AObrigado!`
        window.open(emailUrl, '_blank')
        break
      
      case 'abrir_formulario':
        setCurrentFormData({
          nome: '',
          email: '',
          telefone: '',
          area_direito: '',
          descricao_caso: '',
          urgencia: 'normal'
        })
        setShowOptions(false)
        break
      
      case 'agendar_consulta':
        const consultaUrl = `https://wa.me/5592994536158?text=Olá! Gostaria de agendar uma consulta jurídica gratuita. Vim através do chatbot do site.`
        window.open(consultaUrl, '_blank')
        break
      
      default:
        if (action.startsWith('ver_servicos_')) {
          const area = action.replace('ver_servicos_', '')
          const areaInfo = legalKnowledge[area]
          if (areaInfo) {
            const botMessage = {
              id: Date.now() + 1,
              text: `📋 **Serviços em ${areaInfo.title}**

${areaInfo.services.map(service => `• ${service}`).join('\n')}

**Quer saber mais sobre algum serviço específico ou agendar uma consulta?**`,
              sender: 'bot',
              timestamp: new Date(),
              type: 'servicos',
              actions: [
                { text: "Agendar Consulta", action: "agendar_consulta" },
                { text: "Fazer Pergunta", action: "fazer_pergunta" },
                { text: "Falar no WhatsApp", action: "whatsapp" }
              ]
            }
            setMessages(prev => [...prev, botMessage])
          }
        }
        break
    }
  }

  // Função para enviar e-mail via EmailJS
  const sendEmail = async (formData) => {
    try {
      const templateParams = {
        to_name: 'Dr. Mota',
        from_name: formData.nome,
        from_email: formData.email,
        from_phone: formData.telefone,
        area_direito: formData.area_direito,
        urgencia: formData.urgencia === 'urgente' ? 'URGENTE' : 'Normal',
        descricao_caso: formData.descricao_caso,
        data_envio: new Date().toLocaleString('pt-BR'),
        reply_to: formData.email
      }

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      )

      return { success: true, data: response }
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error)
      return { success: false, error: error.message }
    }
  }

  const handleFormSubmit = async () => {
    if (!currentFormData.nome || !currentFormData.email || !currentFormData.descricao_caso) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      // 1. Enviar WhatsApp automático
      const whatsappMessage = `📋 *NOVO FORMULÁRIO - SITE ADVOCACIA*

*Nome:* ${currentFormData.nome}
*E-mail:* ${currentFormData.email}
*Telefone:* ${currentFormData.telefone}
*Área do Direito:* ${currentFormData.area_direito}
*Urgência:* ${currentFormData.urgencia === 'urgente' ? '🚨 URGENTE' : 'Normal'}

*Descrição do Caso:*
${currentFormData.descricao_caso}

---
Enviado através do chatbot em ${new Date().toLocaleString('pt-BR')}`

      const whatsappUrl = `https://wa.me/5592994536158?text=${encodeURIComponent(whatsappMessage)}`
      window.open(whatsappUrl, '_blank')

      // 2. Enviar e-mail via EmailJS
      const emailResult = await sendEmail(currentFormData)

      if (emailResult.success) {
        setSubmitStatus('success')
        
        // Mensagem de confirmação
        const confirmMessage = {
          id: Date.now() + 1,
          text: `✅ **Formulário enviado com sucesso!**

**O que aconteceu:**
📱 **WhatsApp:** Abriu automaticamente com todas as informações
📧 **E-mail:** Enviado diretamente para mota.216573@gmail.com

**Próximos passos:**
1. **Confirme o envio** no WhatsApp que abriu
2. **Verifique seu e-mail** - recebemos a mensagem
3. **Aguarde nosso contato** em até 24h

**Seu caso foi registrado e nossa equipe entrará em contato em breve!**

Precisa de mais alguma coisa?`,
          sender: 'bot',
          timestamp: new Date(),
          type: 'confirmacao'
        }

        setMessages(prev => [...prev, confirmMessage])
      } else {
        setSubmitStatus('error')
        
        // Mensagem de erro
        const errorMessage = {
          id: Date.now() + 1,
          text: `⚠️ **Formulário parcialmente enviado**

**O que funcionou:**
✅ **WhatsApp:** Abriu com todas as informações

**O que não funcionou:**
❌ **E-mail:** Houve um problema técnico

**O que fazer:**
1. **Confirme o envio** no WhatsApp
2. **Envie manualmente** para mota.216573@gmail.com
3. **Ou aguarde** - tentaremos novamente

**Seu caso foi registrado via WhatsApp!**`,
          sender: 'bot',
          timestamp: new Date(),
          type: 'erro'
        }

        setMessages(prev => [...prev, errorMessage])
      }

      setCurrentFormData(null)
      setShowOptions(true)
    } catch (error) {
      console.error('Erro ao enviar formulário:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleQuickQuestion = (question) => {
    setInputValue(question)
    setTimeout(() => handleSendMessage(), 100)
  }

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 rounded-full shadow-2xl hover:shadow-3xl flex items-center justify-center z-50 transition-all duration-300 chatbot-pulse"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Abrir chat"
      >
        {/* Notification Badge */}
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
          >
            <span className="text-xs text-white font-bold">!</span>
          </motion.div>
        )}
        
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-7 h-7 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-7 h-7 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-28 right-6 w-96 h-[500px] bg-white rounded-3xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Dr. Bot</h3>
                    <p className="text-xs text-primary-100">Assistente Jurídico Virtual</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-primary-600 text-white shadow-lg'
                        : 'bg-white text-gray-800 shadow-md border border-gray-100'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {message.sender === 'bot' && (
                        <Bot className="w-5 h-5 mt-0.5 text-primary-600 flex-shrink-0" />
                      )}
                      {message.sender === 'user' && (
                        <User className="w-5 h-5 mt-0.5 text-white flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className="text-sm whitespace-pre-line leading-relaxed">{message.text}</div>
                        
                        {message.actions && (
                          <div className="mt-4 space-y-2">
                            {message.actions.map((action, index) => (
                              <button
                                key={index}
                                onClick={() => handleAction(action.action)}
                                className="block w-full text-left text-sm bg-primary-50 hover:bg-primary-100 text-primary-700 px-3 py-2 rounded-lg transition-colors border border-primary-200 hover:border-primary-300"
                              >
                                {action.text}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 p-4 rounded-2xl shadow-md border border-gray-100">
                    <div className="flex items-center space-x-3">
                      <Bot className="w-5 h-5 text-primary-600" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Options */}
              {showOptions && messages.length === 1 && (
                <div className="space-y-3">
                  <p className="text-xs text-gray-500 text-center font-medium">Escolha uma opção:</p>
                  
                  {commonScenarios.map((scenario, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl p-3 shadow-sm border border-gray-100"
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <scenario.icon className="w-5 h-5 text-primary-600" />
                        <div>
                          <h4 className="font-semibold text-sm text-gray-800">{scenario.title}</h4>
                          <p className="text-xs text-gray-600">{scenario.description}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {scenario.questions.map((question, qIndex) => (
                          <button
                            key={qIndex}
                            onClick={() => handleQuickQuestion(question)}
                            className="block w-full text-left text-xs bg-gray-50 hover:bg-gray-100 p-2 rounded-lg transition-colors text-gray-700"
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Formulário */}
              {currentFormData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl p-4 shadow-md border border-gray-200"
                >
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <FileText className="w-5 h-5 text-primary-600 mr-2" />
                    Formulário de Consulta
                  </h4>
                  
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Seu nome completo *"
                      value={currentFormData.nome}
                      onChange={(e) => setCurrentFormData({...currentFormData, nome: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    />
                    
                    <input
                      type="email"
                      placeholder="Seu e-mail *"
                      value={currentFormData.email}
                      onChange={(e) => setCurrentFormData({...currentFormData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    />
                    
                    <input
                      type="tel"
                      placeholder="Seu telefone"
                      value={currentFormData.telefone}
                      onChange={(e) => setCurrentFormData({...currentFormData, telefone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    />
                    
                    <select
                      value={currentFormData.area_direito}
                      onChange={(e) => setCurrentFormData({...currentFormData, area_direito: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    >
                      <option value="">Selecione a área do direito</option>
                      <option value="Direito Civil">Direito Civil</option>
                      <option value="Direito Trabalhista">Direito Trabalhista</option>
                      <option value="Direito Empresarial">Direito Empresarial</option>
                      <option value="Direito Tributário">Direito Tributário</option>
                      <option value="Direito do Consumidor">Direito do Consumidor</option>
                    </select>
                    
                    <select
                      value={currentFormData.urgencia}
                      onChange={(e) => setCurrentFormData({...currentFormData, urgencia: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                    >
                      <option value="normal">Urgência Normal</option>
                      <option value="urgente">🚨 URGENTE</option>
                    </select>
                    
                    <textarea
                      placeholder="Descreva seu caso detalhadamente *"
                      value={currentFormData.descricao_caso}
                      onChange={(e) => setCurrentFormData({...currentFormData, descricao_caso: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm resize-none"
                    />
                    
                    <button
                      onClick={handleFormSubmit}
                      disabled={!currentFormData.nome || !currentFormData.email || !currentFormData.descricao_caso || isSubmitting}
                      className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Enviando...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Enviar para WhatsApp e E-mail</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            {!currentFormData && (
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Digite sua pergunta jurídica..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white p-3 rounded-lg transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Chatbot
