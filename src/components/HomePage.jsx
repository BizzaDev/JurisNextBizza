import React from 'react'
import Header from './Header'
import Hero from './Hero'
import Services from './Services'
import About from './About'
import Testimonials from './Testimonials'
import Contact from './Contact'
import Footer from './Footer'
import Chatbot from './Chatbot'
import AdminControls from './AdminControls'

const HomePage = () => {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <About />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <Chatbot />
      <AdminControls />
    </>
  )
}

export default HomePage
