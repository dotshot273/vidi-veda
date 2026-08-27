import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, UserCheck, Clock, Layers, Award, Users2, LineChart } from 'lucide-react';

export default function WhyChooseUs() {
  const reasons = [
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "100% Verified Tutors",
      desc: "Every tutor undergoes strict background checks, qualification verify checks, and personal interviews for parent peace of mind."
    },
    {
      icon: <UserCheck className="h-6 w-6" />,
      title: "1-to-1 Personal Attention",
      desc: "No crowded coaching classes. The teacher focuses entirely on your child's specific doubts, pace, and syllabus needs."
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Flexible Class Timings",
      desc: "Schedule home or online classes at hours that fit your family's routine, leaving ample time for school and rest."
    },
    {
      icon: <Layers className="h-6 w-6" />,
      title: "Online & Offline Options",
      desc: "Choose safe face-to-face home tutoring or interactive online sessions using virtual whiteboard technology."
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Affordable Tier-2/3 Rates",
      desc: "Premium, top-quality education priced fairly to fit the monthly budgets of middle-class Indian families."
    },
    {
      icon: <Users2 className="h-6 w-6" />,
      title: "Continuous Parent Support",
      desc: "Direct communication channels. Connect with coordinators easily and stay closely involved in decision-making."
    },
    {
      icon: <LineChart className="h-6 w-6" />,
      title: "Regular Progress Tracking",
      desc: "Weekly revisions, chapter mock tests, and detailed progress reports shared with parents on WhatsApp."
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <section id="why-choose-us" className="py-20 bg-primary-50/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-primary-400 font-heading font-extrabold text-sm uppercase tracking-widest block">Why Vidi Veda</span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-charcoal">
            The Right Educational Support Your Child Deserves
          </h2>
          <div className="w-16 h-1 bg-primary-400 mx-auto rounded-full" />
          <p className="text-muted-grey text-base font-light">
            We understand the challenges parents face in finding reliable teachers. Here is how Vidi Veda makes home tuition safe, effective, and stress-free.
          </p>
        </div>

        {/* Reasons Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ 
                y: -6, 
                boxShadow: "0 20px 25px -5px rgba(255, 122, 48, 0.08), 0 8px 10px -6px rgba(255, 122, 48, 0.08)"
              }}
              className="bg-white p-8 rounded-2xl border border-primary-100/50 shadow-md shadow-primary-100/10 text-left transition-all duration-300 group hover:border-primary-200"
            >
              {/* Icon */}
              <div className="bg-primary-50 text-primary-400 p-3.5 rounded-xl inline-block group-hover:bg-primary-400 group-hover:text-white transition-all duration-300 mb-6">
                {reason.icon}
              </div>
              
              {/* Title & Desc */}
              <h3 className="font-heading font-bold text-xl text-charcoal mb-3 group-hover:text-primary-400 transition-colors duration-200">
                {reason.title}
              </h3>
              <p className="text-sm text-muted-grey leading-relaxed font-light">
                {reason.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
