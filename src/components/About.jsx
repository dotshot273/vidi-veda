import React from 'react';
import { motion } from 'framer-motion';
import { Users, GraduationCap, Building2, Smile } from 'lucide-react';

export default function About() {
  const stats = [
    { icon: <Users className="h-6 w-6" />, count: "500+", label: "Happy Parents" },
    { icon: <GraduationCap className="h-6 w-6" />, count: "200+", label: "Verified Tutors" },
    { icon: <Building2 className="h-6 w-6" />, count: "9+", label: "Cities Covered" },
    { icon: <Smile className="h-6 w-6" />, count: "98%", label: "Satisfaction Rate" },
  ];

  return (
    <section id="about" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Image with soft reveal animation */}
          <motion.div 
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <div className="absolute top-[-15px] left-[-15px] w-full h-full border-4 border-dashed border-primary-200 rounded-[2rem] -z-10" />
              <div className="rounded-[2rem] overflow-hidden border-6 border-white shadow-2xl">
                <img 
                  src="/images/about.png" 
                  alt="Happy Indian mother and child celebrating exam success" 
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            {/* Background shape */}
            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-primary-100/50 rounded-full blur-xl -z-20" />
          </motion.div>

          {/* Right Column: Mission and Content */}
          <motion.div 
            className="lg:col-span-7 space-y-6 text-left"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="space-y-2">
              <span className="text-primary-400 font-heading font-extrabold text-sm uppercase tracking-widest block">About Vidi Veda</span>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-charcoal leading-tight">
                Empowering Students in Tier 2 & Tier 3 Cities Across India
              </h2>
            </div>
            
            <p className="text-muted-grey text-base leading-relaxed font-light">
              Quality personal education shouldn't be a privilege reserved only for metro cities. At <strong>Vidi Veda</strong>, headquartered in Bareilly, Uttar Pradesh, our mission is to bring high-quality, trusted, and empathetic one-to-one home tutoring right to the doorsteps of families in tier 2 and tier 3 cities.
            </p>
            
            <p className="text-muted-grey text-base leading-relaxed font-light">
              We connect parents with highly competent, verified local school teachers and private tutors who understand the school curriculum (CBSE & ICSE). By emphasizing personalized learning plans and positive reinforcement, we help students overcome academic fear, build core conceptual understanding, and achieve their full potential.
            </p>

            {/* Stat Counters with Soft Reveal */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-primary-100">
              {stats.map((stat, index) => (
                <div key={index} className="space-y-1">
                  <div className="inline-flex text-primary-400 p-2 bg-primary-50 rounded-lg">
                    {stat.icon}
                  </div>
                  <h3 className="font-heading font-extrabold text-2xl text-charcoal leading-none">
                    {stat.count}
                  </h3>
                  <p className="text-xs text-muted-grey font-medium uppercase tracking-wider leading-none">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Heartfelt Callout Box */}
            <div className="bg-primary-50/50 border-l-4 border-primary-400 p-4 rounded-r-xl">
              <p className="text-sm font-medium text-charcoal/90 italic leading-relaxed">
                "Every child learns differently. We believe that with one-to-one attention, patient explanation, and continuous mentoring, every student in India can discover the joy of learning."
              </p>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
