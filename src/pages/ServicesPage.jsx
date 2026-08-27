import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Services from '../components/Services';
import ServiceFormatGuide from '../components/ServiceFormatGuide';
import Footer from '../components/Footer';

export default function ServicesPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Home & Online Tuition Services | Vidi Veda Home Tutoring';
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      <Navbar activePage="services" />
      {/* Spacer so the fixed navbar doesn't overlap the section */}
      <div className="pt-24" />
      <h1 className="sr-only">Home &amp; Online Tuition Services by Vidi Veda</h1>
      <Services />
      <ServiceFormatGuide />
      <Footer />
    </div>
  );
}
