import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, UserCheck, Clock, ClipboardList, LineChart, Users2, HeartHandshake } from 'lucide-react';

export default function WhyChooseUs() {
  const reasons = [
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "Verified & Trusted Tutors",
      desc: "Every tutor is carefully screened to ensure students learn from qualified, responsible, and dedicated educators."
    },
    {
      icon: <UserCheck className="h-6 w-6" />,
      title: "Personal Attention for Every Student",
      desc: "One-to-one learning helps students understand concepts better, ask questions freely, and learn at their own pace."
    },
    {
      icon: <ClipboardList className="h-6 w-6" />,
      title: "Learning Plans Based on Student Needs",
      desc: "Every student is different. We help match tutors according to the student's class, subjects, learning goals, and academic requirements."
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Flexible Class Timings",
      desc: "Choose study schedules that fit comfortably into your child's daily routine and school commitments."
    },
    {
      icon: <LineChart className="h-6 w-6" />,
      title: "Regular Progress Updates",
      desc: "Stay informed about your child's learning journey with consistent feedback and performance updates."
    },
    {
      icon: <Users2 className="h-6 w-6" />,
      title: "Dedicated Parent Support",
      desc: "Our team is always available to assist with tutor selection, class coordination, and any support you may need."
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
          <span className="text-primary-400 font-heading font-extrabold text-sm uppercase tracking-widest block">Why Choose Vidi Veda</span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-charcoal">
            Trusted by Parents for Personalized Learning and Reliable Tutor Support
          </h2>
          <div className="w-16 h-1 bg-primary-400 mx-auto rounded-full" />
          <p className="text-muted-grey text-base font-light">
            Finding the right tutor is an important decision for every parent. At Vidi Veda, we focus on providing quality learning support, trusted tutors, and a smooth experience for both students and parents.
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
              className="relative bg-white rounded-2xl border border-primary-100/50 shadow-md shadow-primary-100/10 text-left overflow-hidden group transition-all duration-300 hover:border-primary-300 hover:shadow-xl hover:shadow-primary-200/20 hover:-translate-y-1.5"
            >
              {/* Left accent bar that grows on hover */}
              <span className="absolute left-0 top-0 h-full w-1.5 bg-primary-400 scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300 ease-out" />

              {/* Large watermark number */}
              <span className="absolute -top-2 right-3 font-heading font-extrabold text-7xl text-primary-100/60 group-hover:text-primary-200/70 transition-colors duration-300 select-none pointer-events-none leading-none">
                {String(index + 1).padStart(2, '0')}
              </span>

              <div className="relative p-7 pl-8">
                {/* Icon in rounded square */}
                <div className="relative w-14 h-14 flex items-center justify-center rounded-2xl bg-primary-50 text-primary-400 mb-5 group-hover:bg-primary-400 group-hover:text-white transition-all duration-300 group-hover:rotate-6 group-hover:scale-105">
                  {reason.icon}
                </div>

                {/* Title & Desc */}
                <h3 className="font-heading font-bold text-lg text-charcoal mb-2.5 group-hover:text-primary-500 transition-colors duration-200">
                  {reason.title}
                </h3>
                <p className="text-sm text-muted-grey leading-relaxed font-light">
                  {reason.desc}
                </p>

                {/* Bottom divider that fills on hover */}
                <div className="mt-5 h-px w-full bg-primary-100/60 relative overflow-hidden">
                  <span className="absolute inset-0 bg-primary-400 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Our Promise */}
        <motion.div
          className="mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-gradient-to-r from-primary-400 to-primary-500 rounded-3xl p-8 sm:p-10 text-center shadow-xl shadow-primary-400/20 relative overflow-hidden">
            <div className="absolute top-[-30px] right-[-30px] w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="inline-flex items-center justify-center bg-white/20 text-white p-3 rounded-2xl mb-5">
              <HeartHandshake className="h-7 w-7" />
            </div>
            <h3 className="font-heading font-extrabold text-2xl text-white mb-3">Our Promise</h3>
            <p className="text-white/90 text-base leading-relaxed font-light max-w-2xl mx-auto">
              We are committed to creating a positive learning experience where students feel confident, parents feel assured, and education becomes more effective and enjoyable.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
