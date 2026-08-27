import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { seoData } from '../seoData';

import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import WhyChooseUs from '../components/WhyChooseUs';
import Services from '../components/Services';
import Subjects from '../components/Subjects';
import Cities from '../components/Cities';
import HowItWorks from '../components/HowItWorks';
import StudentForm from '../components/StudentForm';
import TutorForm from '../components/TutorForm';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';
import OfficeLocation from '../components/OfficeLocation';
import Footer from '../components/Footer';

export default function SeoCityPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  
  // Find SEO config for current path
  const config = seoData[path];

  // If path is not defined in seoData, redirect to home
  useEffect(() => {
    if (!config) {
      navigate('/');
    } else {
      // Dynamic Client-side SEO update (will work on browser)
      // Server-side SEO injector handles search engine crawler bots
      document.title = config.title;
      
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', config.description);
      }
      
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', config.keywords);
      }
      
      // Scroll to top of the page when route changes
      window.scrollTo(0, 0);
    }
  }, [path, config, navigate]);

  if (!config) return null;

  return (
    <div className="min-h-screen bg-cream">
      <Navbar activePage="home" />
      
      {/* Personalized Hero */}
      <Hero 
        heading={config.heading}
        subheading={config.subheading}
        ctaRegisterText={`Book ${config.city !== "India" ? config.city : ""} Demo`}
      />

      {/* Localized Content Banner */}
      <div className="bg-primary-100/40 py-8 border-y border-primary-200/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-primary-800 leading-relaxed">
            🎓 Looking for {config.subject} tuition under the {config.board} system in {config.city}? Vidi Veda provides vetted private tutors who live near your area.
            {config.extraContent && <span className="block mt-2 font-normal text-charcoal/80">{config.extraContent}</span>}
          </p>
        </div>
      </div>

      <About />
      <WhyChooseUs />
      <Services />
      <Subjects />
      <Cities />
      <HowItWorks />
      
      <div className="bg-gradient-to-b from-white to-primary-50/10">
        {/* Pass defaults down if needed */}
        <StudentForm />
        <TutorForm />
      </div>

      <Testimonials />
      <FAQ />
      
      <div className="bg-gradient-to-b from-white to-primary-50/20">
        <Contact />
        <OfficeLocation />
      </div>

      <Footer />
    </div>
  );
}
