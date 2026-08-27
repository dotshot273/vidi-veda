import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, UserSearch, MonitorPlay, GraduationCap, ArrowRight, MessageCircle } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: <ClipboardList className="h-6 w-6" />,
      title: "Share Your Requirements",
      desc: "Tell us about your child's class, subjects, board, learning goals, preferred timings, and tuition preferences. The more we understand your needs, the better we can find the right tutor."
    },
    {
      number: "02",
      icon: <UserSearch className="h-6 w-6" />,
      title: "Get Matched with the Right Tutor",
      desc: "Based on your requirements, we carefully shortlist suitable tutors from our network. We focus on finding a tutor who matches your child's academic needs and learning style."
    },
    {
      number: "03",
      icon: <MonitorPlay className="h-6 w-6" />,
      title: "Attend a Demo Session",
      desc: "Meet the tutor and experience a demo class before making a decision. This helps parents and students understand the teaching approach and ensures the right learning fit."
    },
    {
      number: "04",
      icon: <GraduationCap className="h-6 w-6" />,
      title: "Start Learning with Confidence",
      desc: "Once you are satisfied, regular classes begin according to your preferred schedule. Our team remains available to provide support and ensure a positive learning experience throughout the journey."
    }
  ];

  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="how-it-works" className="py-20 bg-primary-50/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-primary-400 font-heading font-extrabold text-sm uppercase tracking-widest block">How It Works</span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-charcoal">
            Finding the Right Tutor for Your Child
          </h2>
          <div className="w-16 h-1 bg-primary-400 mx-auto rounded-full" />
          <p className="text-muted-grey text-base font-light">
            We make the process easy for parents. From understanding your child's learning needs to connecting you with the right tutor, our team supports you at every step to ensure a smooth and effective learning experience.
          </p>
        </div>

        {/* Vertical alternating timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Central spine */}
          <div className="absolute left-8 md:left-1/2 top-2 bottom-2 w-0.5 md:-translate-x-1/2 bg-gradient-to-b from-primary-200 via-primary-300 to-primary-200" />

          <div className="space-y-8 md:space-y-4">
            {steps.map((step, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="relative flex items-center md:justify-center"
                >
                  {/* Node marker on the spine */}
                  <div className="absolute left-8 md:left-1/2 md:-translate-x-1/2 z-10 -translate-x-1/2">
                    <div className="w-16 h-16 rounded-full bg-primary-400 text-white flex items-center justify-center shadow-lg shadow-primary-400/30 border-4 border-cream">
                      {step.icon}
                    </div>
                    <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-charcoal text-white text-[11px] font-heading font-bold flex items-center justify-center border-2 border-cream">
                      {step.number}
                    </span>
                  </div>

                  {/* Card — offset to one side on desktop, right of node on mobile */}
                  <div
                    className={`w-full md:w-[calc(50%-3rem)] pl-20 md:pl-0 ${
                      isLeft ? 'md:pr-16 md:text-right md:mr-auto' : 'md:pl-16 md:ml-auto'
                    }`}
                  >
                    <div className="bg-white p-6 rounded-2xl border border-primary-100/50 shadow-md shadow-primary-50/40 hover:shadow-lg hover:border-primary-200 transition-all duration-300">
                      <span className="text-[11px] font-heading font-bold uppercase tracking-widest text-primary-500 block mb-1.5">
                        Step {step.number}
                      </span>
                      <h3 className="font-heading font-bold text-lg text-charcoal mb-2.5">
                        {step.title}
                      </h3>
                      <p className="text-sm text-muted-grey leading-relaxed font-light">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom Trust Statement */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-muted-grey text-base font-light italic mt-14 max-w-3xl mx-auto"
        >
          From the first inquiry to regular learning support, Vidi Veda makes finding a trusted tutor simple, transparent, and stress-free for parents and students across India.
        </motion.p>

        {/* Call To Action banner */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mt-12 bg-gradient-to-r from-primary-400 to-primary-500 rounded-3xl p-8 sm:p-10 text-center shadow-xl shadow-primary-400/20 relative overflow-hidden"
        >
          <div className="absolute top-[-30px] right-[-30px] w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="relative">
            <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-white mb-6 max-w-xl mx-auto">
              Ready to Find the Right Tutor for Your Child?
            </h3>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <button
                onClick={() => handleScroll('student-registration')}
                className="w-full sm:w-auto bg-white text-primary-500 hover:bg-primary-50 font-heading font-semibold px-8 py-3.5 rounded-full transition-all duration-300 shadow-md hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Book a Free Demo Class</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleScroll('contact')}
                className="w-full sm:w-auto bg-white/15 hover:bg-white/25 text-white border border-white/40 font-heading font-semibold px-8 py-3.5 rounded-full transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Talk to Our Team</span>
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
