# 🚀 Configuração do EmailJS para o Chatbot

## 📋 Pré-requisitos
- Conta no EmailJS (gratuita): https://www.emailjs.com/
- E-mail configurado (Gmail, Outlook, etc.)

## 🔧 Passo a Passo para Configuração

### 1. Criar Conta no EmailJS
1. Acesse: https://www.emailjs.com/
2. Clique em "Sign Up" e crie uma conta gratuita
3. Faça login na sua conta

### 2. Configurar Serviço de E-mail
1. No painel, vá para "Email Services"
2. Clique em "Add New Service"
3. Escolha seu provedor de e-mail:
   - **Gmail**: Mais comum, fácil de configurar
   - **Outlook**: Alternativa ao Gmail
   - **Outros**: Suporte a diversos provedores

#### Para Gmail:
1. Selecione "Gmail"
2. Nome do serviço: `gmail` (ou qualquer nome)
3. Clique em "Connect Account"
4. Autorize o EmailJS a acessar sua conta Gmail
5. Salve o serviço

### 3. Criar Template de E-mail
1. No painel, vá para "Email Templates"
2. Clique em "Create New Template"
3. Escolha "Blank Template"

#### Template HTML Personalizado:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nova Consulta Jurídica</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .header {
            background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
            margin-bottom: 0;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 16px;
        }
        .content {
            background: white;
            padding: 30px;
            border-radius: 0 0 10px 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 25px;
        }
        .info-item {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #0ea5e9;
        }
        .info-label {
            font-weight: 600;
            color: #0ea5e9;
            font-size: 12px;
            text-transform: uppercase;
            margin-bottom: 5px;
        }
        .info-value {
            font-size: 14px;
            color: #333;
        }
        .case-description {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }
        .case-description h3 {
            margin: 0 0 15px 0;
            color: #0ea5e9;
            font-size: 18px;
        }
        .case-description p {
            margin: 0;
            line-height: 1.6;
            white-space: pre-line;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #666;
            font-size: 12px;
        }
        .urgent-badge {
            background: #dc2626;
            color: white;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            display: inline-block;
            margin-left: 10px;
        }
        .logo {
            font-size: 28px;
            margin-bottom: 10px;
        }
        @media (max-width: 600px) {
            .info-grid {
                grid-template-columns: 1fr;
            }
            body {
                padding: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">⚖️</div>
        <h1>Nova Consulta Jurídica</h1>
        <p>Recebida através do chatbot do site</p>
    </div>
    
    <div class="content">
        <div class="info-grid">
            <div class="info-item">
                <div class="info-label">Nome do Cliente</div>
                <div class="info-value">{{from_name}}</div>
            </div>
            <div class="info-item">
                <div class="info-label">E-mail</div>
                <div class="info-value">{{from_email}}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Telefone</div>
                <div class="info-value">{{from_phone || 'Não informado'}}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Área do Direito</div>
                <div class="info-value">{{area_direito || 'Não especificada'}}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Urgência</div>
                <div class="info-value">
                    {{urgencia}}
                    {% if urgencia == 'URGENTE' %}
                        <span class="urgent-badge">URGENTE</span>
                    {% endif %}
                </div>
            </div>
            <div class="info-item">
                <div class="info-label">Data de Envio</div>
                <div class="info-value">{{data_envio}}</div>
            </div>
        </div>
        
        <div class="case-description">
            <h3>📋 Descrição do Caso</h3>
            <p>{{descricao_caso}}</p>
        </div>
        
        <div style="text-align: center; margin-top: 25px;">
            <p style="color: #666; font-size: 14px;">
                <strong>⚠️ IMPORTANTE:</strong> Esta consulta foi enviada automaticamente através do chatbot do site.<br>
                Entre em contato com o cliente o mais breve possível.
            </p>
        </div>
    </div>
    
    <div class="footer">
        <p>
            <strong>Dr. Bot - Assistente Virtual</strong><br>
            Sistema automatizado de atendimento jurídico<br>
            Enviado em: {{data_envio}}
        </p>
    </div>
</body>
</html>
```

### 4. Configurar Variáveis do Template
No template, as seguintes variáveis estão disponíveis:
- `{{from_name}}` - Nome do cliente
- `{{from_email}}` - E-mail do cliente
- `{{from_phone}}` - Telefone do cliente
- `{{area_direito}}` - Área do direito
- `{{urgencia}}` - Nível de urgência
- `{{descricao_caso}}` - Descrição detalhada do caso
- `{{data_envio}}` - Data e hora do envio

### 5. Salvar e Obter IDs
1. Salve o template com um nome descritivo
2. Anote o **Template ID** (aparece na URL ou no painel)
3. Anote o **Service ID** (nome do serviço criado)

### 6. Atualizar Configuração no Código
1. Abra o arquivo `src/config/emailjs.js`
2. Substitua as credenciais:

```javascript
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'gmail', // Seu Service ID
  TEMPLATE_ID: 'template_abc123', // Seu Template ID
  PUBLIC_KEY: 'user_xyz789' // Sua Public Key
}
```

### 7. Obter Public Key
1. No painel do EmailJS, vá para "Account" → "API Keys"
2. Copie sua **Public Key**

## 🧪 Testando a Configuração

1. Inicie o servidor: `npm run dev`
2. Abra o chatbot no site
3. Preencha o formulário
4. Clique em "Enviar para WhatsApp e E-mail"
5. Verifique:
   - WhatsApp abriu automaticamente
   - E-mail foi enviado para sua caixa de entrada

## 🔍 Solução de Problemas

### E-mail não está sendo enviado:
- Verifique se as credenciais estão corretas
- Confirme se o serviço de e-mail está ativo
- Verifique o console do navegador para erros

### Template não está funcionando:
- Verifique se as variáveis estão escritas corretamente
- Confirme se o template foi salvo
- Teste o template no painel do EmailJS

### WhatsApp não abre:
- Verifique se o número está correto
- Confirme se o formato da mensagem está válido

## 📱 Recursos Implementados

✅ **WhatsApp Automático**: Redirecionamento via wa.me
✅ **E-mail via EmailJS**: Envio direto sem mailto:
✅ **Template Personalizado**: Design profissional e responsivo
✅ **Estado de Loading**: Indicador visual durante envio
✅ **Tratamento de Erros**: Mensagens informativas
✅ **Confirmação Dupla**: WhatsApp + E-mail simultâneos

## 🎯 Próximos Passos

1. Configure suas credenciais do EmailJS
2. Teste o sistema completo
3. Personalize o template conforme sua marca
4. Monitore os e-mails recebidos
5. Ajuste o design se necessário

---

**🎉 Parabéns! Seu chatbot agora tem um sistema profissional de envio de e-mails!**

