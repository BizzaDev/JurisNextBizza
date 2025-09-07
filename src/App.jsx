import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ContentProvider } from './contexts/ContentContext'
import { ThemeProvider } from './contexts/ThemeContext'
import ErrorBoundary from './components/ErrorBoundary'
import AdminLayout from './layouts/AdminLayout'
import Login from './components/Login'
import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import About from './components/About'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Chatbot from './components/Chatbot'

// Componente para a página principal (landing page) - usuários normais
const HomePage = () => {
  const { isAuthenticated } = useAuth()
  
  // Se estiver autenticado, mostrar o layout de admin
  if (isAuthenticated) {
    return <AdminLayout />
  }
  
  // Se não estiver autenticado, mostrar a página normal
  return (
    <>
      <Header />
      <main>
        <ErrorBoundary fallback={<div className="p-8 text-center text-red-600">Erro ao carregar seção Hero</div>}>
          <Hero />
        </ErrorBoundary>
        <ErrorBoundary fallback={<div className="p-8 text-center text-red-600">Erro ao carregar seção Services</div>}>
          <Services />
        </ErrorBoundary>
        <About />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <Chatbot />
    </>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ContentProvider>
            <Router>
              <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<Login />} />
                </Routes>
              </div>
            </Router>
          </ContentProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
