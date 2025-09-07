import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Função para definir sessão
  const setSession = useCallback((session) => {
    if (session?.user) {
      setUser(session.user)
      setIsAuthenticated(true)
    } else {
      setUser(null)
      setIsAuthenticated(false)
    }
    setIsLoading(false)
  }, [])

  // Sign up
  const signUpNewUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
      })
      if (error) {
        console.error('Error signing up:', error)
        return { success: false, error: error.message }
      }
      return { success: true, data }
    } catch (error) {
      console.error('Error signing up:', error)
      return { success: false, error: 'Erro ao criar conta' }
    }
  }

  // Sign In
  const signInUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      })
      if (error) {
        console.error('Error signing in:', error)
        return { success: false, error: error.message }
      }
      console.log('User signed in:', data)
      return { success: true, data }
    } catch (error) {
      console.error('Error signing in:', error)
      return { success: false, error: 'Erro ao fazer login' }
    }
  }

  // Sign Out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error)
        return { success: false, error: error.message }
      }
      return { success: true }
    } catch (error) {
      console.error('Error signing out:', error)
      return { success: false, error: 'Erro ao fazer logout' }
    }
  }

  // Inicializar autenticação
  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Escutar mudanças no estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [setSession])

  // Função de login usando Supabase
  const login = useCallback(async (email, password) => {
    return await signInUser(email, password)
  }, [])

  // Função de logout usando Supabase
  const logout = useCallback(async () => {
    return await signOut()
  }, [])

  // Função para verificar permissões (pode ser expandida conforme necessário)
  const hasPermission = useCallback((permission) => {
    // Por enquanto, todos os usuários autenticados têm todas as permissões
    // Isso pode ser expandido para verificar roles específicos no futuro
    return isAuthenticated
  }, [isAuthenticated])

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    hasPermission,
    signUpNewUser,
    signOut,
    signInUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
