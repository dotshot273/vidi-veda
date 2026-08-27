import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: "How does Vidi Veda verify home tutors?",
      a: "Safety and competence are our highest priorities. Every tutor must pass a three-step check: 1) Verification of university degrees and teaching qualifications, 2) Background and ID proof check, and 3) A personal teaching audition to assess explanation skills, communication, and teaching empathy."
    },
    {
      q: "What happens in the free demo class?",
      a: "The demo class is a 1-hour trial session at your home (or online) with the matched tutor. It helps the student and tutor get comfortable. The tutor evaluates the child's academic strengths and weaknesses. There is no fee or obligation—you only confirm if you are 100% satisfied with the demo."
    },
    {
      q: "What is the fee structure for home tutoring?",
      a: "Our monthly rates are competitive and budget-friendly for tier-2 and tier-3 cities. Fees depend on the child's class grade, board (CBSE vs ICSE), and the number of hours requested. There are no hidden brokerages. Contact our coordinator at 6398889697 for an exact custom quote."
    },
    {
      q: "Can we change the tutor if we are not satisfied?",
      a: "Yes, absolutely. If at any point you feel the teaching style of the tutor is not matching your child's pace, simply contact us. We will analyze the gap and assign a replacement tutor immediately without any extra registration charges."
    },
    {
      q: "Do you cover both CBSE and ICSE boards?",
      a: "Yes. We have specialized teachers for both boards. Our CBSE tutors focus on NCERT textbook clearing and board grading patterns. Our ICSE tutors are experienced with the detailed CISCE syllabus, focusing heavily on literature, mathematics logic, and science theories."
    },
    {
      q: "What subjects do you cover?",
      a: "We offer complete tutoring for Mathematics, Sciences (Physics, Chemistry, Biology), English Grammar & Literature, Social Science, Hindi, and Computer programming (Java, Python, C++)."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-primary-50/20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-primary-400 font-heading font-extrabold text-sm uppercase tracking-widest block">Got Questions?</span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-charcoal">
            Frequently Asked Questions
          </h2>
          <div className="w-16 h-1 bg-primary-400 mx-auto rounded-full" />
          <p className="text-muted-grey text-base font-light">
            Everything you need to know about setting up home tuition, payments, verification, and our policies.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-primary-100 shadow-md shadow-primary-50/50 overflow-hidden text-left transition-all duration-300"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                >
                  <div className="flex items-center space-x-3 pr-4">
                    <HelpCircle className="h-5 w-5 text-primary-400 shrink-0" />
                    <span className="font-heading font-bold text-base sm:text-lg text-charcoal">
                      {faq.q}
                    </span>
                  </div>
                  <div className="text-primary-400 bg-primary-50 p-1.5 rounded-full shrink-0">
                    {isOpen ? <Minus className="h-4.5 w-4.5" /> : <Plus className="h-4.5 w-4.5" />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-1 text-sm text-muted-grey border-t border-primary-50/40 leading-relaxed font-light">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
