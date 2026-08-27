import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Phone, MessageCircle, FileText } from 'lucide-react';

const faqs = [
  {
    q: "How do I find the right tutor for my child?",
    a: "Simply share your requirements with us, including your child's class, subjects, board, preferred timings, and learning goals. Our team carefully matches your child with a suitable tutor based on these requirements.",
  },
  {
    q: "Can I book a demo class before starting regular tuition?",
    a: "Yes. We offer a demo session so that parents and students can interact with the tutor, understand the teaching style, and decide if it is the right fit before starting regular classes.",
  },
  {
    q: "How are tutors verified?",
    a: "Every tutor goes through a verification process that may include identity verification, qualification checks, teaching experience review, interviews, and subject knowledge evaluation.",
  },
  {
    q: "What if I am not satisfied with the tutor?",
    a: "Your satisfaction is important to us. If the tutor is not the right fit for your child, our team will work with you to find a suitable replacement whenever possible.",
  },
  {
    q: "Do you provide home tuition or online classes?",
    a: "We provide both home tuition and online learning support. Parents can choose the option that best suits their child's learning needs and schedule.",
  },
  {
    q: "Which classes do you cover?",
    a: "We provide tutoring support from Play Group and Primary Classes to Class 12, including academic guidance for school studies, board exams, and foundation learning programs.",
  },
  {
    q: "Which boards do you support?",
    a: "Our tutors support students from CBSE, ICSE, ISC, State Boards, International School Curriculums, E-Techno Schools, and other recognized educational boards.",
  },
  {
    q: "Which subjects do you teach?",
    a: "We provide support for Mathematics, Science, Physics, Chemistry, Biology, English, Hindi, Social Science, Computer Science, Commerce subjects, Humanities subjects, Coding, Artificial Intelligence, and many more.",
  },
  {
    q: "How much does home tuition cost?",
    a: "Tuition fees vary depending on the student's class, subjects, location, tutor experience, and learning requirements. Our team shares complete fee details after understanding your needs.",
  },
  {
    q: "Can one tutor teach multiple subjects?",
    a: "Yes. Depending on the tutor's qualifications and expertise, many tutors can teach multiple subjects, especially for primary and middle school students.",
  },
  {
    q: "Do you provide tuition for board exam preparation?",
    a: "Yes. We provide focused support for board exam preparation, revision planning, sample paper practice, doubt solving, and subject-specific guidance.",
  },
  {
    q: "Can I choose my preferred class timings?",
    a: "Yes. We try to match students with tutors based on their preferred schedule and availability for a convenient learning experience.",
  },
  {
    q: "How do parents track student progress?",
    a: "Regular feedback, performance discussions, and progress updates help parents stay informed about their child's learning journey and academic improvement.",
  },
  {
    q: "Do you provide tutors for competitive foundation programs?",
    a: "Yes. We also support students preparing for Olympiads, NTSE, scholarship exams, JEE Foundation, NEET Foundation, and other academic enrichment programs.",
  },
  {
    q: "How quickly can a tutor be assigned?",
    a: "The time required depends on the student's requirements and location. In many cases, we can begin the tutor matching process shortly after receiving the inquiry.",
  },
];

export default function FAQFull() {
  const [openIndex, setOpenIndex] = useState(0);

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/contact-us';
    }
  };

  return (
    <section id="faq" className="py-20 bg-primary-50/20 relative overflow-hidden">
      <div className="absolute bottom-0 right-[-6%] w-80 h-80 rounded-full bg-primary-100/25 blur-3xl -z-10" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-primary-400 font-heading font-extrabold text-sm uppercase tracking-widest block">Questions &amp; Answers</span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-charcoal leading-tight">
            Frequently Asked Questions
          </h2>
          <div className="w-16 h-1 bg-primary-400 mx-auto rounded-full" />
          <p className="text-muted-grey text-base font-light">
            Everything you need to know about finding the right tutor, demo classes, fees, tutor verification, and learning support.
          </p>
        </div>

        {/* Accordion — all questions, no categories */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`bg-white rounded-2xl border overflow-hidden text-left transition-all duration-300 hover:-translate-y-0.5 ${
                  isOpen ? 'border-primary-300 shadow-lg shadow-primary-100/20' : 'border-primary-100/70 shadow-sm hover:shadow-md'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-5 sm:px-6 py-4 flex items-center justify-between gap-4 text-left focus:outline-none cursor-pointer"
                >
                  <span className={`font-heading font-bold text-base transition-colors ${isOpen ? 'text-primary-500' : 'text-charcoal'}`}>
                    {faq.q}
                  </span>
                  <span
                    className={`p-1.5 rounded-full shrink-0 transition-colors duration-300 ${
                      isOpen ? 'bg-primary-400 text-white' : 'bg-primary-50 text-primary-400'
                    }`}
                  >
                    {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-5 sm:px-6 pb-5 pt-1 text-sm text-muted-grey leading-relaxed font-light">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Still have questions — bottom */}
        <div className="mt-12 bg-white rounded-3xl border border-primary-100/60 shadow-lg shadow-primary-100/10 p-6 sm:p-8">
          <div className="text-center mb-6">
            <h3 className="font-heading font-extrabold text-xl text-charcoal mb-1">Still Have Questions?</h3>
            <p className="text-sm text-muted-grey font-light">Our team is happy to help.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href="tel:6398889697"
              className="flex items-center gap-3 bg-primary-50/60 hover:bg-primary-100/50 border border-primary-100/60 rounded-xl px-4 py-3 transition-colors duration-200 group"
            >
              <span className="w-10 h-10 rounded-xl bg-primary-400 text-white flex items-center justify-center shrink-0">
                <Phone className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs text-muted-grey">Call Us</span>
                <span className="block font-heading font-bold text-sm text-charcoal group-hover:text-primary-500 transition-colors">6398889697</span>
              </span>
            </a>

            <a
              href="https://wa.me/916398889697?text=Hi%20Vidi%20Veda,%20I%20have%20a%20question."
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 bg-primary-50/60 hover:bg-primary-100/50 border border-primary-100/60 rounded-xl px-4 py-3 transition-colors duration-200 group"
            >
              <span className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <MessageCircle className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs text-muted-grey">Chat with us</span>
                <span className="block font-heading font-bold text-sm text-charcoal group-hover:text-emerald-600 transition-colors">WhatsApp</span>
              </span>
            </a>

            <button
              onClick={scrollToContact}
              className="flex items-center gap-3 bg-primary-50/60 hover:bg-primary-100/50 border border-primary-100/60 rounded-xl px-4 py-3 transition-colors duration-200 group text-left cursor-pointer"
            >
              <span className="w-10 h-10 rounded-xl bg-charcoal text-white flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs text-muted-grey">Prefer writing?</span>
                <span className="block font-heading font-bold text-sm text-charcoal group-hover:text-primary-500 transition-colors">Inquiry Form</span>
              </span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
