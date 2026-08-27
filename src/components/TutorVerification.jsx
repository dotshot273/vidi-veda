import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, BadgeCheck, MessagesSquare, BookOpenCheck, Star, CheckCircle } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: ShieldCheck,
    title: 'Background Verification',
    desc: 'We verify basic personal information and identity details to help ensure a safe and trustworthy learning experience for students and families.',
  },
  {
    number: '02',
    icon: BadgeCheck,
    title: 'Qualification Check',
    desc: 'Academic qualifications, certifications, and educational backgrounds are reviewed to ensure tutors meet the required teaching standards.',
  },
  {
    number: '03',
    icon: MessagesSquare,
    title: 'Personal Interview',
    desc: 'Tutors go through a screening interview where we assess communication skills, teaching approach, professionalism, and student-handling abilities.',
  },
  {
    number: '04',
    icon: BookOpenCheck,
    title: 'Subject Knowledge Evaluation',
    desc: "We evaluate the tutor's subject expertise to ensure they can explain concepts clearly and provide effective academic support to students.",
  },
  {
    number: '05',
    icon: Star,
    title: 'Continuous Performance Monitoring',
    desc: 'We regularly collect feedback from parents and students to help maintain quality learning experiences and improve tutor performance.',
  },
];

const whyItMatters = [
  'Trusted Tutors',
  'Quality Teaching Support',
  'Better Learning Experience',
  'Parent Confidence',
  'Student-Focused Approach',
];

export default function TutorVerification() {
  return (
    <section id="tutor-verification" className="py-20 bg-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-20 right-[-8%] w-80 h-80 rounded-full bg-primary-100/25 blur-3xl -z-10" />
      <div className="absolute bottom-10 left-[-8%] w-96 h-96 rounded-full bg-primary-200/15 blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-primary-400 font-heading font-extrabold text-sm uppercase tracking-widest block">Our Tutor Verification Process</span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-charcoal leading-tight">
            Every Tutor is Carefully Reviewed Before Joining Vidi Veda
          </h2>
          <div className="w-16 h-1 bg-primary-400 mx-auto rounded-full" />
          <p className="text-muted-grey text-base font-light">
            We understand that choosing a tutor for your child is an important decision. That's why every tutor goes through a verification and evaluation process before becoming part of our network. Our goal is to connect students with tutors who are knowledgeable, professional, and committed to helping students succeed.
          </p>
        </div>

        {/* Premium 5-card horizontal process */}
        <div className="relative">
          {/* Connecting line (desktop, 5 columns) */}
          <div className="hidden lg:block absolute top-9 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-primary-200 via-primary-300 to-primary-200 -z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="group relative flex flex-col items-center text-center"
                >
                  {/* Numbered icon node */}
                  <div className="relative z-10 mb-5">
                    <div className="w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-primary-400 to-primary-500 text-white flex items-center justify-center shadow-lg shadow-primary-400/25 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300 border-4 border-white">
                      <Icon className="h-8 w-8" />
                    </div>
                    <span className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-charcoal text-white text-xs font-heading font-extrabold flex items-center justify-center shadow-md border-2 border-white">
                      {step.number}
                    </span>
                  </div>

                  {/* Card body */}
                  <div className="bg-soft-bg border border-primary-100/50 rounded-2xl p-5 flex-1 w-full shadow-sm hover:shadow-lg hover:border-primary-200 hover:bg-white transition-all duration-300">
                    <h3 className="font-heading font-bold text-base text-charcoal mb-2 leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-xs text-muted-grey leading-relaxed font-light">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Why This Matters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mt-14 bg-primary-50/60 border border-primary-100/60 rounded-3xl p-7 sm:p-9"
        >
          <h3 className="font-heading font-extrabold text-xl text-charcoal text-center mb-6">
            Why This Matters
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {whyItMatters.map((item) => (
              <span
                key={item}
                className="flex items-center gap-2 bg-white border border-primary-100/70 text-charcoal/85 text-sm font-medium px-4 py-2.5 rounded-full shadow-sm hover:border-primary-300 hover:text-primary-500 transition-colors duration-200"
              >
                <CheckCircle className="h-4 w-4 text-primary-400 shrink-0" />
                {item}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Bottom Trust Statement */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-muted-grey text-base font-light italic mt-12 max-w-3xl mx-auto"
        >
          Every tutor at Vidi Veda is selected with care so that parents can feel confident and students can learn from trusted, capable, and dedicated educators.
        </motion.p>

      </div>
    </section>
  );
}
