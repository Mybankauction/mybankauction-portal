import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '@/components/Header';
import Hero from './Hero';
import About from './About';
import WhyUs from './WhyUs';
import HowItWorks from './HowItWorks';
import FAQ from './FAQ';
import ContactUs from './ContactUs';
import Footer from './Footer';

const IndexLanding: React.FC = () => {
  const navigate = useNavigate();
  // 1. Add a loading state, defaulting to true
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for user data in local storage
    const user = localStorage.getItem('user');

    if (user) {
      // If user exists, redirect them immediately
      navigate('/properties', { replace: true });
    } else {
      // If no user, stop loading to allow the page to render
      setIsLoading(false);
    }
  }, [navigate]); // Dependency array

  // 2. If the component is still in the loading state, render nothing.
  //    This prevents the page from flashing before the redirect happens.
  //    You could also render a full-page loading spinner here.
  if (isLoading) {
    return null;
  }

  return (
    <main className="relative bg-slate-600 text-white">
      <Header />

      <div
        className="absolute inset-0 -z-10 bg-cover bg-center opacity-20"
      />

      <div id="home" className="section-anchor">
        <Hero />
      </div>
      <div id="about" className="section-anchor">
        <About />
      </div>
      <div id="why-us" className="section-anchor">
        <WhyUs />
      </div>
      <div id="process" className="section-anchor">
        <HowItWorks />
      </div>
      <div id="faq" className="section-anchor">
        <FAQ />
      </div>
      <div id="contact" className="section-anchor">
        <ContactUs />
      </div>
      <div>
        <Footer />
      </div>
    </main>
  );
};

export default IndexLanding;