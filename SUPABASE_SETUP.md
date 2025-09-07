# Configuração do Supabase Auth

Este projeto agora usa autenticação via Supabase Auth em vez de login local hardcoded.

## Configuração Necessária

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Crie um novo projeto
4. Anote a URL do projeto e a chave anônima

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com:

```env
VITE_SUPABASE_URL=https://seu-projeto-id.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

### 3. Configurar Autenticação no Supabase

1. No painel do Supabase, vá para **Authentication > Settings**
2. Configure as políticas de autenticação conforme necessário
3. Para desenvolvimento, você pode desabilitar a confirmação de email temporariamente

### 4. Criar Usuário Administrador

1. No painel do Supabase, vá para **Authentication > Users**
2. Clique em "Add user" para criar um usuário administrador
3. Use as credenciais criadas para fazer login no painel admin

## Funcionalidades Implementadas

- ✅ Login via Supabase Auth
- ✅ Logout via Supabase Auth
- ✅ Verificação de sessão automática
- ✅ Redirecionamento automático baseado no estado de autenticação
- ✅ Remoção completa do login hardcoded local

## Como Usar

1. Acesse `/login` para fazer login
2. Use as credenciais do usuário criado no Supabase
3. Após o login, você será redirecionado para `/` e verá o painel admin
4. Para sair, use o botão "Sair do Painel" no painel admin

## Segurança

- Todas as credenciais são gerenciadas pelo Supabase
- Sessões são gerenciadas automaticamente
- Não há mais credenciais hardcoded no código
- Suporte a políticas de autenticação avançadas do Supabase
