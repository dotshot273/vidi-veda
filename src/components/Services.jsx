import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Home, Laptop, Users, FileSpreadsheet, Backpack, BookOpen,
  ArrowRight, Check
} from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: Home,
      title: "Home Tuition",
      tagline: "Personal Learning at Your Doorstep",
      desc: "One-on-one personalized teaching in the safe environment of your own home.",
      image: "/images/services/home-tuition.jpg",
      points: [
        "A verified tutor visits at your preferred timings",
        "Focused on your child's school syllabus (CBSE/ICSE)",
        "Personalized attention and doubt clearing",
        "Ideal for Class I–XII across all core subjects",
      ],
    },
    {
      icon: Laptop,
      title: "Online Tuition",
      tagline: "Learn from Anywhere, Anytime",
      desc: "Interactive live classes with experienced tutors from any city in India.",
      image: "/images/services/online-tuition.jpg",
      points: [
        "Live interactive sessions with real-time doubt solving",
        "Digital learning tools and shared whiteboards",
        "Flexible schedules that fit your routine",
        "Quality learning support from any location",
      ],
    },
    {
      icon: Users,
      title: "Group Learning Programs",
      tagline: "Learn Together, Grow Together",
      desc: "Small group classes that encourage discussion and collaboration.",
      image: "/images/services/group-learning.jpg",
      points: [
        "Small batch sizes for focused attention",
        "Encourages healthy learning competition",
        "Collaborative discussion and peer learning",
        "Affordable and engaging for every student",
      ],
    },
    {
      icon: FileSpreadsheet,
      title: "Exam Preparation Support",
      tagline: "Prepare with Confidence",
      desc: "Focused support for school exams, board exams, and competitive programs.",
      image: "/images/services/exam-prep.jpg",
      points: [
        "Board exams, Olympiads and scholarship tests",
        "Regular practice, revision and mock tests",
        "Doubt solving and subject-specific guidance",
        "Structured preparation to perform your best",
      ],
    },
    {
      icon: Backpack,
      title: "Homework & Assignment Assistance",
      tagline: "Daily Academic Guidance",
      desc: "Daily support to keep students on track with their school curriculum.",
      image: "/images/services/homework.jpg",
      points: [
        "Homework help and project support",
        "Assignment completion guidance",
        "Helps students stay organized and on track",
        "Clear understanding of daily class topics",
      ],
    },
    {
      icon: BookOpen,
      title: "Subject-Specific Tuition",
      tagline: "Extra Support Where It Matters Most",
      desc: "Targeted help in the subjects your child needs most.",
      image: "/images/services/subject-tuition.jpg",
      points: [
        "Maths, Science, Physics, Chemistry, Biology & more",
        "English, Hindi, Accounts and Humanities subjects",
        "Focused on improving understanding",
        "Builds confidence in challenging subjects",
      ],
    },
  ];

  const handleScroll = () => {
    const element = document.getElementById('student-registration');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-20 bg-white relative overflow-hidden">
      {/* Visual background details */}
      <div className="absolute top-1/4 left-0 w-20 h-40 bg-primary-100/30 rounded-r-full blur-xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-primary-400 font-heading font-extrabold text-sm uppercase tracking-widest block">Our Core Services</span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-charcoal">
            Learning Solutions Designed Around Your Child's Needs
          </h2>
          <div className="w-16 h-1 bg-primary-400 mx-auto rounded-full" />
          <p className="text-muted-grey text-base font-light">
            Every student learns differently. That's why we offer flexible learning options to match your child's academic goals, learning style, and schedule. Whether you prefer home tuition, online classes, or subject-specific support, Vidi Veda helps you find the right tutor for better learning and better results.
          </p>
        </div>

        {/* Alternating feature rows */}
        <div className="divide-y divide-primary-100/50">
          {services.map((service, index) => (
            <ServiceRow
              key={index}
              service={service}
              index={index}
              flip={index % 2 === 1}
              onDemo={handleScroll}
            />
          ))}
        </div>

        {/* Bottom Trust Statement */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-muted-grey text-base font-light italic mt-14 max-w-3xl mx-auto"
        >
          From daily learning support to exam preparation, Vidi Veda helps students learn with confidence through trusted tutors, personalized guidance, and flexible learning options across India.
        </motion.p>

      </div>
    </section>
  );
}

function ServiceRow({ service, index, flip, onDemo }) {
  const { icon: Icon, title, tagline, desc, image, points } = service;
  const [imgOk, setImgOk] = useState(true);

  return (
    <div className="py-12 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

        {/* Image / illustration panel */}
        <motion.div
          initial={{ opacity: 0, x: flip ? 40 : -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={flip ? "lg:order-2" : "lg:order-1"}
        >
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
            {image && imgOk ? (
              <img
                src={image}
                alt={title}
                onError={() => setImgOk(false)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary-50 flex items-center justify-center relative">
                <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, var(--color-primary-100) 1.5px, transparent 1.5px)', backgroundSize: '26px 26px' }} />
                <div className="relative w-24 h-24 rounded-2xl bg-white shadow-md flex items-center justify-center text-primary-400">
                  <Icon className="h-11 w-11" />
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className={flip ? "lg:order-1" : "lg:order-2"}
        >
          <span className="inline-block bg-primary-50 text-primary-500 font-heading font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-lg mb-4">
            Service {String(index + 1).padStart(2, '0')}
          </span>

          <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-charcoal mb-3">
            {title}
          </h3>

          <p className="text-base text-muted-grey font-light mb-6">
            {desc}
          </p>

          <ul className="space-y-3 mb-8">
            {points.map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-charcoal/80">
                <span className="mt-0.5 text-primary-400 shrink-0">
                  <Check className="h-4 w-4" strokeWidth={3} />
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <p className="text-xs font-semibold text-primary-500 mb-4 uppercase tracking-wide">{tagline}</p>

          <button
            onClick={onDemo}
            className="inline-flex items-center gap-2 bg-primary-400 hover:bg-primary-500 text-white font-heading font-semibold text-sm px-6 py-3 rounded-xl transition-colors duration-300 shadow-md shadow-primary-400/20 cursor-pointer"
          >
            <span>Book Free Demo</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>

      </div>
    </div>
  );
}
