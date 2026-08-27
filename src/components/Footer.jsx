import React from 'react';
import { BookOpen, Phone, MapPin, Mail, MessageCircle, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (e, targetId) => {
    const element = document.getElementById(targetId);
    if (element) {
      e.preventDefault();
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-charcoal text-white pt-16 pb-8 border-t-4 border-primary-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-primary-400 text-white p-2 rounded-xl">
                <BookOpen className="h-6 w-6" />
              </div>
              <span className="font-heading font-extrabold text-2xl tracking-tight">
                Vidi <span className="text-primary-400">Veda</span>
              </span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed font-light">
              Bridging the educational gap in Tier 2 and Tier 3 cities across India. Providing verified, empathetic, and professional home tutors for CBSE & ICSE boards to enable personalized, home-based learning.
            </p>
            <div className="flex space-x-3 pt-2">
              <a
                href="https://wa.me/916398889697"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-600 flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a
                href="tel:6398889697"
                className="w-10 h-10 rounded-full bg-primary-400 hover:bg-primary-500 flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
                aria-label="Call Now"
              >
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6 relative after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-0.5 after:bg-primary-400">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm text-white/75">
              <li>
                <a href="#home" onClick={(e) => handleLinkClick(e, 'home')} className="hover:text-primary-400 hover:underline transition duration-200">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" onClick={(e) => handleLinkClick(e, 'about')} className="hover:text-primary-400 hover:underline transition duration-200">
                  About Vidi Veda
                </a>
              </li>
              <li>
                <a href="#services" onClick={(e) => handleLinkClick(e, 'services')} className="hover:text-primary-400 hover:underline transition duration-200">
                  Our Services
                </a>
              </li>
              <li>
                <a href="#student-registration" onClick={(e) => handleLinkClick(e, 'student-registration')} className="hover:text-primary-400 hover:underline transition duration-200 font-medium text-primary-200">
                  Register as Student
                </a>
              </li>
              <li>
                <a href="#tutor-registration" onClick={(e) => handleLinkClick(e, 'tutor-registration')} className="hover:text-primary-400 hover:underline transition duration-200 font-medium text-primary-200">
                  Become a Tutor
                </a>
              </li>
              <li>
                <a href="#faq" onClick={(e) => handleLinkClick(e, 'faq')} className="hover:text-primary-400 hover:underline transition duration-200">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6 relative after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-0.5 after:bg-primary-400">
              Our Tuitions
            </h4>
            <ul className="space-y-3 text-sm text-white/75">
              <li>
                <a href="/cbse-tuition-classes" className="hover:text-primary-400 hover:underline transition duration-200">
                  CBSE Tuition Classes
                </a>
              </li>
              <li>
                <a href="/icse-home-tutors" className="hover:text-primary-400 hover:underline transition duration-200">
                  ICSE Home Tutors
                </a>
              </li>
              <li>
                <a href="/tutors-in-bareilly" className="hover:text-primary-400 hover:underline transition duration-200">
                  Home Tutors in Bareilly
                </a>
              </li>
              <li>
                <a href="/tutors-in-meerut" className="hover:text-primary-400 hover:underline transition duration-200">
                  Home Tutors in Meerut
                </a>
              </li>
              <li>
                <a href="/maths-tutor" className="hover:text-primary-400 hover:underline transition duration-200">
                  Mathematics Tutors
                </a>
              </li>
              <li>
                <a href="/science-tuition" className="hover:text-primary-400 hover:underline transition duration-200">
                  Science Tuition
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6 relative after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-0.5 after:bg-primary-400">
              Get in Touch
            </h4>
            <ul className="space-y-4 text-sm text-white/75">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-primary-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Main Office:</strong><br />
                  Bareilly, Uttar Pradesh,<br />
                  India - 243001
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary-400 shrink-0" />
                <a href="tel:6398889697" className="hover:text-primary-400 transition-colors">
                  +91 6398889697
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary-400 shrink-0" />
                <a href="mailto:info@vidiveda.com" className="hover:text-primary-400 transition-colors">
                  info@vidiveda.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-xs text-white/60">
          <p>© {currentYear} Vidi Veda. All Rights Reserved. Designed for CBSE & ICSE Students.</p>
          <div className="flex items-center space-x-1 mt-4 md:mt-0">
            <span>Made with</span>
            <Heart className="h-3 w-3 text-red-500 fill-red-500 animate-pulse" />
            <span>in India for Tier-2 & Tier-3 Families.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
