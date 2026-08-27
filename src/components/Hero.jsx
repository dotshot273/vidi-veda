import React from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, CheckCircle, ArrowRight, ShieldCheck, UserCheck, Laptop, MapPin } from 'lucide-react';

export default function Hero({ 
  heading = "Find Trusted Home Tutors for CBSE & ICSE Students Across India",
  subheading = "Personal home tuition and online classes with experienced tutors, one-to-one attention and better learning support for students.",
  ctaRegisterText = "Register Student",
  ctaTutorText = "Become a Tutor"
}) {
  
  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section id="home" className="relative min-h-screen pt-28 pb-16 flex items-center overflow-hidden bg-gradient-to-b from-primary-50 via-cream to-white">
      {/* Background blobs for premium feel */}
      <div className="absolute top-10 right-[-10%] w-[500px] h-[500px] rounded-full bg-primary-100/40 blur-3xl -z-10 animate-pulse-soft" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-primary-200/20 blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & Actions */}
          <motion.div 
            className="lg:col-span-7 text-left space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Tagline */}
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center space-x-2 bg-primary-100/70 border border-primary-200/50 px-3.5 py-1.5 rounded-full text-xs font-bold text-primary-700 uppercase tracking-wider"
            >
              <ShieldCheck className="h-4 w-4 text-primary-500 shrink-0" />
              <span>100% Background Verified Home Tutors</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              variants={itemVariants}
              className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-charcoal leading-tight"
            >
              {heading.split(" ").map((word, idx) => {
                if (word.toLowerCase() === "cbse" || word.toLowerCase() === "icse" || word.toLowerCase() === "tutors" || word.toLowerCase() === "trusted") {
                  return <span key={idx} className="text-primary-400">{word} </span>;
                }
                return word + " ";
              })}
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              variants={itemVariants}
              className="text-lg text-muted-grey leading-relaxed max-w-xl font-light"
            >
              {subheading}
            </motion.p>

            {/* Key Trust Highlights */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 gap-4 max-w-lg pt-2"
            >
              <div className="flex items-center space-x-2 text-charcoal/80">
                <div className="bg-primary-100 text-primary-600 p-1 rounded-full shrink-0">
                  <UserCheck className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">Verified Tutors</span>
              </div>
              <div className="flex items-center space-x-2 text-charcoal/80">
                <div className="bg-primary-100 text-primary-600 p-1 rounded-full shrink-0">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">1-to-1 Attention</span>
              </div>
              <div className="flex items-center space-x-2 text-charcoal/80">
                <div className="bg-primary-100 text-primary-600 p-1 rounded-full shrink-0">
                  <Laptop className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">Online & Offline Options</span>
              </div>
              <div className="flex items-center space-x-2 text-charcoal/80">
                <div className="bg-primary-100 text-primary-600 p-1 rounded-full shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">Available Across India</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap gap-4 pt-4"
            >
              <button
                onClick={() => handleScroll('student-registration')}
                className="bg-primary-400 hover:bg-primary-500 text-white font-heading font-semibold px-8 py-3.5 rounded-full transition-all duration-300 shadow-lg shadow-primary-400/25 hover:shadow-xl hover:shadow-primary-400/30 hover:-translate-y-0.5 flex items-center space-x-2 group cursor-pointer"
              >
                <span>{ctaRegisterText}</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => handleScroll('tutor-registration')}
                className="bg-transparent hover:bg-primary-100/40 text-primary-400 hover:text-primary-600 border-2 border-primary-400 font-heading font-semibold px-8 py-3 rounded-full transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
              >
                {ctaTutorText}
              </button>
            </motion.div>

            {/* Secondary Contact Channels */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap gap-4 items-center text-sm pt-2 text-muted-grey border-t border-primary-100 max-w-lg"
            >
              <span className="font-semibold text-charcoal">Quick Contact:</span>
              <a
                href="tel:6398889697"
                className="flex items-center space-x-1 hover:text-primary-400 font-medium transition-colors"
              >
                <Phone className="h-4 w-4 text-primary-400" />
                <span>Call +91 6398889697</span>
              </a>
              <span className="hidden sm:inline text-primary-200">|</span>
              <a
                href="https://wa.me/916398889697?text=Hi%20Vidi%20Veda,%20I%20am%20looking%20for%20a%20home%20tutor."
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1 hover:text-emerald-500 font-medium transition-colors"
              >
                <MessageCircle className="h-4 w-4 text-emerald-500" />
                <span>WhatsApp Us</span>
              </a>
            </motion.div>
          </motion.div>
          
          {/* Right Column: Img & Floating Badges */}
          <motion.div 
            className="lg:col-span-5 relative mt-8 lg:mt-0 flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Visual Container with Organic Border Radius */}
            <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-[2rem] overflow-hidden border-8 border-white shadow-2xl bg-white">
              <img 
                src="/images/hero.png" 
                alt="Personal tutoring session in India" 
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 to-transparent pointer-events-none" />
            </div>

            {/* Floating Card 1: Students Success */}
            <div 
              className="absolute -top-4 -left-4 bg-white/95 backdrop-blur-xs p-4 rounded-2xl shadow-xl border border-primary-100 flex items-center space-x-3 animate-float pointer-events-none"
              style={{ animationDelay: '0.5s' }}
            >
              <div className="bg-primary-100 text-primary-400 p-2.5 rounded-xl">
                <Award className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" />
              </div>
              <div>
                <h5 className="font-heading font-bold text-sm text-charcoal leading-none">CBSE & ICSE</h5>
                <p className="text-[11px] text-muted-grey mt-0.5">Classes I - XII</p>
              </div>
            </div>

            {/* Floating Card 2: Callout Details */}
            <div 
              className="absolute -bottom-6 -right-2 bg-white/95 backdrop-blur-xs p-4 rounded-2xl shadow-xl border border-primary-100 flex items-center space-x-3 animate-float pointer-events-none"
              style={{ animationDelay: '2.5s' }}
            >
              <div className="bg-emerald-100 text-emerald-600 p-2.5 rounded-xl">
                <UserCheck className="h-6 w-6" />
              </div>
              <div className="text-left">
                <h5 className="font-heading font-bold text-sm text-charcoal leading-none">1-to-1 Attention</h5>
                <p className="text-[11px] text-muted-grey mt-0.5">For Better Grades</p>
              </div>
            </div>
            
            {/* Background Orange Graphic Circle */}
            <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-primary-400/10 border-4 border-dashed border-primary-400/30 -z-20 animate-spin" style={{ animationDuration: '30s' }} />
          </motion.div>

        </div>
      </div>
    </section>
  );
}

// Extra helper component for floating card svg (lucide-react doesn't have custom awards of school sometimes)
function Award({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="8" r="7"/>
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
    </svg>
  );
}
