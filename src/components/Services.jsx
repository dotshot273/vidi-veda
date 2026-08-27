import React from 'react';
import { motion } from 'framer-motion';
import { Home, Laptop, Users, FileSpreadsheet, Backpack, BookOpen, ArrowRight } from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: <Home className="h-6 w-6" />,
      title: "Home Tuition",
      desc: "One-on-one personalized teaching inside the safe environment of your home. A verified expert teacher visits at your preferred times."
    },
    {
      icon: <Laptop className="h-6 w-6" />,
      title: "Online Tuition",
      desc: "Virtual interactive classes utilizing online whiteboards, screen-sharing, and recorded sessions. Access India's finest teachers anywhere."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Group Tuition",
      desc: "Small, curated batches of 3 to 5 students. Encourages healthy competition, team doubts clearance, and makes high-quality learning highly cost-effective."
    },
    {
      icon: <FileSpreadsheet className="h-6 w-6" />,
      title: "Exam Preparation",
      desc: "Focused short-term courses aimed at CBSE/ICSE board exams, sample paper mocks, solving past 10-year question sets, and time management hacks."
    },
    {
      icon: <Backpack className="h-6 w-6" />,
      title: "Homework & Assignment Help",
      desc: "Daily guide to keep your child on track with school homework, science projects, math worksheets, and conceptual understanding of daily class topics."
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Subject-Wise Focus",
      desc: "Struggling with only Mathematics, Physics, or English Literature? Enroll for target support to conquer specific fear-inducing subjects."
    }
  ];

  const handleScroll = () => {
    const element = document.getElementById('student-registration');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-20 bg-white relative">
      {/* Visual background details */}
      <div className="absolute top-1/4 left-0 w-20 h-40 bg-primary-100/30 rounded-r-full blur-xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-primary-400 font-heading font-extrabold text-sm uppercase tracking-widest block">Our Core Services</span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-charcoal">
            Tutoring Formats Customized for Every Family
          </h2>
          <div className="w-16 h-1 bg-primary-400 mx-auto rounded-full" />
          <p className="text-muted-grey text-base font-light">
            We adapt to how your child learns best. Choose from home, online, or small group formats tailored to match your requirements.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl border border-primary-50 hover:border-primary-200/70 shadow-md shadow-primary-50/50 hover:shadow-xl hover:shadow-primary-100/10 transition-all duration-300 text-left flex flex-col justify-between"
            >
              <div>
                <div className="bg-primary-50 text-primary-400 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  {service.icon}
                </div>
                <h3 className="font-heading font-bold text-xl text-charcoal mb-3">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-grey leading-relaxed mb-6 font-light">
                  {service.desc}
                </p>
              </div>
              
              <button 
                onClick={handleScroll}
                className="text-primary-400 hover:text-primary-500 font-heading font-semibold text-sm flex items-center space-x-1 group w-max cursor-pointer"
              >
                <span>Book Demo</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
