import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Sparkles, CheckCircle2, TrendingUp, PhoneCall } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: <ClipboardList className="h-6 w-6" />,
      title: "Share Requirements",
      desc: "Fill our simple 2-minute registration form below or call us at 6398889697. Tell us your child's class, board (CBSE/ICSE), and subjects."
    },
    {
      number: "02",
      icon: <Sparkles className="h-6 w-6" />,
      title: "Get a Free Demo Class",
      desc: "We match you with the best-suited verified tutor in your area who schedules a 1-hour free trial demo class to understand your child's status."
    },
    {
      number: "03",
      icon: <CheckCircle2 className="h-6 w-6" />,
      title: "Confirm & Start Tuition",
      desc: "If you love the demo class, confirm the schedule. Monthly fees are clear, simple, and paid directly. Regular tutoring sessions begin immediately."
    },
    {
      number: "04",
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Track Progress Monthly",
      desc: "Receive weekly feedback on WhatsApp, monthly revision mock test reports, and coordinate closely with our team for continuous support."
    }
  ];

  const handleScroll = () => {
    const element = document.getElementById('student-registration');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="how-it-works" className="py-20 bg-primary-50/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-primary-400 font-heading font-extrabold text-sm uppercase tracking-widest block">Simple Process</span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-charcoal">
            Four Simple Steps to Academic Success
          </h2>
          <div className="w-16 h-1 bg-primary-400 mx-auto rounded-full" />
          <p className="text-muted-grey text-base font-light">
            Finding the perfect tutor for your child is quick and straightforward. Here is how we get started.
          </p>
        </div>

        {/* Timeline Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white p-8 rounded-2xl border border-primary-100/50 shadow-md shadow-primary-50/40 relative text-left flex flex-col justify-between"
            >
              <div>
                {/* Numeric badge */}
                <div className="absolute top-4 right-6 font-heading font-extrabold text-4xl text-primary-100 select-none">
                  {step.number}
                </div>
                
                {/* Icon box */}
                <div className="bg-primary-50 text-primary-400 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  {step.icon}
                </div>

                <h3 className="font-heading font-bold text-lg text-charcoal mb-3">
                  {step.title}
                </h3>
                
                <p className="text-xs text-muted-grey leading-relaxed font-light">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action zone */}
        <div className="mt-14 flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={handleScroll}
            className="w-full sm:w-auto bg-primary-400 hover:bg-primary-500 text-white font-heading font-semibold px-8 py-3.5 rounded-full transition-all duration-300 shadow-md shadow-primary-400/20 hover:-translate-y-0.5 cursor-pointer"
          >
            Request a Free Demo Class
          </button>
          
          <a
            href="tel:6398889697"
            className="w-full sm:w-auto bg-white border border-primary-100 hover:bg-primary-50 text-charcoal font-heading font-semibold px-8 py-3.5 rounded-full transition-all duration-300 flex items-center justify-center space-x-2 shadow-sm"
          >
            <PhoneCall className="h-4 w-4 text-primary-400 shrink-0" />
            <span>Call Coordinator: 6398889697</span>
          </a>
        </div>

      </div>
    </section>
  );
}
