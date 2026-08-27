import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Contact from '../components/Contact';
import OfficeLocation from '../components/OfficeLocation';
import Footer from '../components/Footer';

export default function ContactPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Contact Us | Vidi Veda Home Tutoring';
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      <Navbar activePage="contact" />
      {/* Spacer so the fixed navbar doesn't overlap the section */}
      <div className="pt-24" />
      <h1 className="sr-only">Contact Vidi Veda Home Tutoring</h1>
      <Contact />
      <OfficeLocation />
      <Footer />
    </div>
  );
}
