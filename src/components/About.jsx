import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Users, GraduationCap, Building2, Smile, HeartHandshake } from 'lucide-react';

// Animated count-up number that triggers when scrolled into view
function CountUp({ value, duration = 2000 }) {
  const [display, setDisplay] = useState("0");
  const ref = useRef(null);
  const started = useRef(false);

  // Parse numeric portion + suffix/prefix (e.g. "2000+", "98%")
  const match = String(value).match(/^(\D*)(\d+)(\D*)$/);
  const prefix = match ? match[1] : "";
  const target = match ? parseInt(match[2], 10) : 0;
  const suffix = match ? match[3] : String(value);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const tick = (now) => {
              const progress = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
              setDisplay(String(Math.round(eased * target)));
              if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref}>
      {prefix}{display}{suffix}
    </span>
  );
}

export default function About() {
  const stats = [
    {
      icon: <Users className="h-6 w-6" />,
      count: "2000+",
      label: "Happy Parents",
      description: "Families who trust Vidi Veda for quality learning support and personal attention.",
    },
    {
      icon: <GraduationCap className="h-6 w-6" />,
      count: "1000+",
      label: "Verified Tutors",
      description: "Experienced tutors helping students learn, grow, and achieve their goals.",
    },
    {
      icon: <Building2 className="h-6 w-6" />,
      count: "10+",
      label: "Cities Covered",
      description: "Expanding our tutor network to support students in multiple cities across India.",
    },
    {
      icon: <Smile className="h-6 w-6" />,
      count: "98%",
      label: "Satisfaction Rate",
      description: "Positive learning experiences shared by students and parents.",
    },
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
                Helping Students Learn with Confidence Through Personal Attention and Quality Guidance
              </h2>
            </div>
            
            <p className="text-muted-grey text-base leading-relaxed font-light">
              At <strong>Vidi Veda</strong>, we believe every student deserves the right guidance to learn, grow, and succeed. We connect students and parents with trusted, experienced tutors who provide personalized learning support based on each student's needs and learning style.
            </p>
            
            <p className="text-muted-grey text-base leading-relaxed font-light">
              Whether it's daily studies, exam preparation, homework support, concept building, or improving confidence in a subject, our tutors are here to help. We support students from CBSE, ICSE, State Boards, and other academic backgrounds across India.
            </p>

            <p className="text-muted-grey text-base leading-relaxed font-light">
              Our goal is simple — to make quality education more accessible, personalized, and effective while helping students build confidence and achieve their full potential.
            </p>

            {/* Trust Statement */}
            <div className="bg-primary-50/50 border-l-4 border-primary-400 p-4 rounded-r-xl flex items-start space-x-3">
              <HeartHandshake className="h-5 w-5 text-primary-400 shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-charcoal/90 leading-relaxed">
                Supporting students, empowering parents, and connecting families with trusted tutors across India.
              </p>
            </div>
          </motion.div>
          
        </div>
      </div>

      {/* Trust & Impact Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-14 space-y-3"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-primary-400 font-heading font-extrabold text-sm uppercase tracking-widest block">Our Growing Learning Community</span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-charcoal leading-tight">
            Trusted by Students and Parents Across India
          </h2>
          <div className="w-16 h-1 bg-primary-400 mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white border border-primary-100/50 rounded-2xl p-6 text-center shadow-lg shadow-primary-100/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="inline-flex text-primary-400 p-3 bg-primary-50 rounded-xl mb-4">
                {stat.icon}
              </div>
              <h3 className="font-heading font-extrabold text-4xl text-charcoal leading-none">
                <CountUp value={stat.count} />
              </h3>
              <p className="text-sm text-primary-500 font-bold uppercase tracking-wider mt-2 mb-3">
                {stat.label}
              </p>
              <p className="text-xs text-muted-grey leading-relaxed font-light">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom Trust Statement */}
        <motion.p
          className="text-center text-muted-grey text-base font-light italic mt-12 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Building trusted learning connections between students, parents, and tutors every day.
        </motion.p>
      </div>
    </section>
  );
}
