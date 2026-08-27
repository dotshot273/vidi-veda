import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import WhyChooseUs from '../components/WhyChooseUs';
import ServicesPreview from '../components/ServicesPreview';
import Subjects from '../components/Subjects';
import Cities from '../components/Cities';
import HowItWorks from '../components/HowItWorks';
import TutorVerification from '../components/TutorVerification';
import StudentForm from '../components/StudentForm';
import TutorForm from '../components/TutorForm';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';
import OfficeLocation from '../components/OfficeLocation';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar activePage="home" />
      <Hero />
      <Cities />
      <About />
      <WhyChooseUs />
      <ServicesPreview />
      <Subjects />
      <HowItWorks />
      <TutorVerification />
      
      {/* Forms Section wrapper with dual columns/tabs or stacked nicely */}
      <div className="bg-gradient-to-b from-white to-primary-50/10">
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
