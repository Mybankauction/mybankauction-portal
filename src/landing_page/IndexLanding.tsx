import React from 'react'
import Hero from './Hero'
import About from './About'
import WhyUs from './WhyUs'
import FAQ from './FAQ'
import HowItWorks from './HowItWorks'
import ContactUs from './ContactUs'

// import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Footer from './Footer'

const IndexLanding: React.FC = () => {
  return (
    <main className="relativ bg-slate-600 text-white">
      <Header />

      <div
        className="absolute inset-0 -z-10 bg-cover bg-center opacity-20"
      />
      <div id="home" className="section-anchor">
        <Hero />
      </div>
      <div id='about' className="section-anchor">
        <About />
      </div>
      <div id='why-us' className="section-anchor">
        <WhyUs />
      </div>
      <div id='process' className="section-anchor">
        <HowItWorks />
      </div>
      <div id='faq' className="section-anchor">
        <FAQ />
      </div>
      <div id='contact' className="section-anchor">
        <ContactUs />
      </div>
      <div>
        <Footer/>
      </div>
    </main>
  )
}

export default IndexLanding