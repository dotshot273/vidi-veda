import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import FAQFull from '../components/FAQFull';
import Footer from '../components/Footer';

export default function FAQPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Frequently Asked Questions | Vidi Veda Home Tutoring';
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      <Navbar activePage="faq" />
      {/* Spacer so the fixed navbar doesn't overlap the section */}
      <div className="pt-24" />
      <FAQFull />
      <Footer />
    </div>
  );
}
