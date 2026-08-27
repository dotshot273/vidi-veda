import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, Menu, X, BookOpen, ChevronDown } from 'lucide-react';

export default function Navbar({ activePage = 'home' }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/#home' },
    { name: 'About Us', href: '/#about' },
    { name: 'Services', href: '/home-tuition-services' },
    {
      name: 'Learning',
      children: [
        { name: 'Classes', href: '/#subjects' },
        { name: 'Boards', href: '/#subjects' },
        { name: 'Subjects', href: '/#subjects' },
      ],
    },
    { name: 'Why Vidi Veda', href: '/#why-choose-us' },
    { name: 'Become a Tutor', href: '/#tutor-registration' },
    { name: 'FAQs', href: '/frequently-asked-questions' },
    { name: 'Contact', href: '/contact-us' },
  ];

  const handleLinkClick = (e, href) => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
    setOpenMobileSubmenu(null);
    if (href.startsWith('/#')) {
      const targetId = href.split('#')[1];
      const element = document.getElementById(targetId);
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: 'smooth' });
        // Update URL hash without reload
        window.history.pushState(null, '', href);
      }
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md py-3 shadow-md border-b border-primary-100/50'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-2 group">
            <div className="bg-primary-400 text-white p-2 rounded-xl group-hover:bg-primary-500 transition-colors duration-300 shadow-md shadow-primary-400/20">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-2xl text-charcoal tracking-tight group-hover:text-primary-400 transition-colors duration-300">
                Vidi <span className="text-primary-400">Veda</span>
              </span>
              <p className="text-[10px] tracking-wider text-muted-grey font-semibold uppercase leading-none">Home Tutoring</p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) =>
              link.children ? (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(link.name)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={openDropdown === link.name}
                    onClick={() =>
                      setOpenDropdown(openDropdown === link.name ? null : link.name)
                    }
                    className="flex items-center space-x-1 text-[15px] font-medium text-charcoal/80 hover:text-primary-400 transition-colors duration-200 py-1 focus:outline-none"
                  >
                    <span>{link.name}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        openDropdown === link.name ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown panel */}
                  <div
                    className={`absolute left-0 top-full pt-3 w-52 transition-all duration-200 origin-top ${
                      openDropdown === link.name
                        ? 'opacity-100 visible translate-y-0'
                        : 'opacity-0 invisible -translate-y-1 pointer-events-none'
                    }`}
                  >
                    <div className="bg-white rounded-xl shadow-xl border border-primary-100/50 py-2 overflow-hidden">
                      {link.children.map((child) => (
                        <a
                          key={child.name}
                          href={child.href}
                          onClick={(e) => handleLinkClick(e, child.href)}
                          className="block px-4 py-2.5 text-sm font-medium text-charcoal/80 hover:text-primary-400 hover:bg-primary-50/60 transition-colors duration-150"
                        >
                          {child.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="text-[15px] font-medium text-charcoal/80 hover:text-primary-400 transition-colors duration-200 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary-400 hover:after:w-full after:transition-all after:duration-300"
                >
                  {link.name}
                </a>
              )
            )}
          </div>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center space-x-3">
            <a
              href="https://wa.me/916398889697?text=Hi%20Vidi%20Veda,%20I%20am%20looking%20for%20a%20home%20tutor."
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm px-4 py-2.5 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp</span>
            </a>
            <a
              href="tel:6398889697"
              className="flex items-center space-x-1.5 bg-primary-400 hover:bg-primary-500 text-white font-medium text-sm px-4 py-2.5 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-primary-400/20 hover:-translate-y-0.5"
            >
              <Phone className="h-4 w-4" />
              <span>Call Us</span>
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-charcoal p-1.5 focus:outline-none hover:text-primary-400 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sliding Menu */}
      <div
        className={`lg:hidden fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl z-50 p-6 transition-transform duration-300 transform ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-primary-100 pb-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="bg-primary-400 text-white p-1.5 rounded-lg">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="font-heading font-extrabold text-xl text-charcoal">
              Vidi <span className="text-primary-400">Veda</span>
            </span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-muted-grey hover:text-charcoal focus:outline-none"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col space-y-4">
          {navLinks.map((link) =>
            link.children ? (
              <div key={link.name} className="border-b border-primary-50/50">
                <button
                  type="button"
                  aria-expanded={openMobileSubmenu === link.name}
                  onClick={() =>
                    setOpenMobileSubmenu(
                      openMobileSubmenu === link.name ? null : link.name
                    )
                  }
                  className="w-full flex items-center justify-between text-base font-semibold text-charcoal/90 hover:text-primary-400 transition-colors py-2 focus:outline-none"
                >
                  <span>{link.name}</span>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform duration-200 ${
                      openMobileSubmenu === link.name ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openMobileSubmenu === link.name ? 'max-h-60 pb-2' : 'max-h-0'
                  }`}
                >
                  <div className="flex flex-col pl-4 border-l-2 border-primary-100">
                    {link.children.map((child) => (
                      <a
                        key={child.name}
                        href={child.href}
                        onClick={(e) => handleLinkClick(e, child.href)}
                        className="text-sm font-medium text-charcoal/75 hover:text-primary-400 transition-colors py-2"
                      >
                        {child.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="text-base font-semibold text-charcoal/90 hover:text-primary-400 transition-colors py-2 border-b border-primary-50/50"
              >
                {link.name}
              </a>
            )
          )}
          
          <div className="pt-6 flex flex-col space-y-3">
            <a
              href="https://wa.me/916398889697?text=Hi%20Vidi%20Veda,%20I%20am%20looking%20for%20a%20home%20tutor."
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 rounded-xl transition-all shadow-md shadow-emerald-500/10"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <MessageCircle className="h-5 w-5" />
              <span>WhatsApp Chat</span>
            </a>
            <a
              href="tel:6398889697"
              className="flex items-center justify-center space-x-2 bg-primary-400 hover:bg-primary-500 text-white font-medium py-3 rounded-xl transition-all shadow-md shadow-primary-400/10"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Phone className="h-5 w-5" />
              <span>Call 6398889697</span>
            </a>
          </div>
        </div>
      </div>
      
      {/* Background overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-charcoal/20 backdrop-blur-xs z-40 transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
}
