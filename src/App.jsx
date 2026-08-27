import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import Pages
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import SeoCityPage from './pages/SeoCityPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Homepage */}
        <Route path="/" element={<Home />} />

        {/* Services Page */}
        <Route path="/home-tuition-services" element={<ServicesPage />} />

        {/* Contact Page */}
        <Route path="/contact-us" element={<ContactPage />} />

        {/* FAQ Page */}
        <Route path="/frequently-asked-questions" element={<FAQPage />} />
        
        {/* Secure Admin Dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />
        
        {/* Dynamic SEO Landing Pages */}
        <Route path="/tutors-in-bareilly" element={<SeoCityPage />} />
        <Route path="/tutors-in-meerut" element={<SeoCityPage />} />
        <Route path="/cbse-tuition-classes" element={<SeoCityPage />} />
        <Route path="/icse-home-tutors" element={<SeoCityPage />} />
        <Route path="/online-tuition-india" element={<SeoCityPage />} />
        <Route path="/maths-tutor" element={<SeoCityPage />} />
        <Route path="/science-tuition" element={<SeoCityPage />} />
        
        {/* Fallback redirecting to Home */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
