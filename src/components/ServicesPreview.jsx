import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, Laptop, Users, FileSpreadsheet, Backpack, BookOpen, ArrowRight } from 'lucide-react';

const services = [
  { icon: Home, title: "Home Tuition", tagline: "Personal Learning at Your Doorstep" },
  { icon: Laptop, title: "Online Tuition", tagline: "Learn from Anywhere, Anytime" },
  { icon: Users, title: "Group Learning Programs", tagline: "Learn Together, Grow Together" },
  { icon: FileSpreadsheet, title: "Exam Preparation Support", tagline: "Prepare with Confidence" },
  { icon: Backpack, title: "Homework & Assignment Assistance", tagline: "Daily Academic Guidance" },
  { icon: BookOpen, title: "Subject-Specific Tuition", tagline: "Extra Support Where It Matters Most" },
];

export default function ServicesPreview() {
  return (
    <section id="services" className="py-20 bg-white relative overflow-hidden">
      <div className="absolute top-1/4 left-0 w-20 h-40 bg-primary-100/30 rounded-r-full blur-xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <span className="text-primary-400 font-heading font-extrabold text-sm uppercase tracking-widest block">Our Core Services</span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-charcoal">
            Learning Solutions Designed Around Your Child's Needs
          </h2>
          <div className="w-16 h-1 bg-primary-400 mx-auto rounded-full" />
          <p className="text-muted-grey text-base font-light">
            From home and online tuition to exam preparation and subject-specific support, Vidi Veda offers flexible learning options to match your child's goals and schedule.
          </p>
        </div>

        {/* Compact service grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
              >
                <Link
                  to="/home-tuition-services"
                  className="group flex items-center gap-4 h-full bg-white border border-primary-100/60 rounded-2xl p-5 hover:border-primary-300 hover:shadow-lg hover:shadow-primary-200/20 transition-all duration-300"
                >
                  <span className="w-14 h-14 rounded-xl bg-primary-50 text-primary-400 flex items-center justify-center shrink-0 group-hover:bg-primary-400 group-hover:text-white transition-colors duration-300">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-heading font-bold text-base text-charcoal group-hover:text-primary-500 transition-colors">
                      {service.title}
                    </span>
                    <span className="block text-xs text-muted-grey mt-0.5">{service.tagline}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-primary-300 ml-auto shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* View all CTA */}
        <div className="text-center mt-12">
          <Link
            to="/home-tuition-services"
            className="inline-flex items-center gap-2 bg-primary-400 hover:bg-primary-500 text-white font-heading font-semibold text-sm px-7 py-3.5 rounded-full transition-all duration-300 shadow-md shadow-primary-400/20 hover:-translate-y-0.5"
          >
            <span>View All Services</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
