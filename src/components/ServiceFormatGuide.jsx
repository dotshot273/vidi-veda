import React from 'react';
import { motion } from 'framer-motion';

const rows = [
  {
    situation: "Consistent weak spots, needs daily focus",
    format: "Home Tuition (1-to-1)",
    why: "Full personal attention at the child's own pace",
  },
  {
    situation: "Family travels / prefers no visitor at home",
    format: "Online Tuition",
    why: "Same tutor quality, lower fee, recordings",
  },
  {
    situation: "Budget-sensitive, child learns with peers",
    format: "Group Tuition",
    why: "Quality teaching at a shared cost",
  },
  {
    situation: "Boards in 3-6 months",
    format: "Exam Prep Sprint",
    why: "Structured revision, mocks and paper practice",
  },
  {
    situation: "Homework and projects piling up",
    format: "Homework Help",
    why: "Daily structure without exam intensity",
  },
  {
    situation: "One subject is the problem",
    format: "Subject-Wise Focus",
    why: "Targeted hours where they're actually needed",
  },
];

export default function ServiceFormatGuide() {
  return (
    <section className="py-20 bg-primary-50/20 relative overflow-hidden">
      <div className="absolute top-10 right-[-6%] w-72 h-72 rounded-full bg-primary-100/25 blur-3xl -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="max-w-2xl mb-10 space-y-4">
          <span className="inline-block bg-primary-100/70 text-primary-600 font-heading font-bold text-xs uppercase tracking-widest px-3 py-1.5 rounded-full">
            Not Sure?
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-charcoal leading-tight">
            Which format fits your child?
          </h2>
          <p className="text-muted-grey text-base font-light">
            A quick guide — and remember, the free demo removes all the guesswork.
          </p>
        </div>

        {/* Comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl border border-primary-100/50 shadow-lg shadow-primary-100/10 overflow-hidden"
        >
          {/* Column headers */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-primary-50/60 border-b border-primary-100/50">
            <span className="col-span-4 font-heading font-bold text-xs uppercase tracking-wider text-charcoal/70">Situation</span>
            <span className="col-span-4 font-heading font-bold text-xs uppercase tracking-wider text-charcoal/70">Best Format</span>
            <span className="col-span-4 font-heading font-bold text-xs uppercase tracking-wider text-charcoal/70">Why</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-primary-100/50">
            {rows.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-6 py-4 hover:bg-primary-50/40 transition-colors duration-200"
              >
                <div className="md:col-span-4">
                  <span className="md:hidden block text-[10px] font-bold uppercase tracking-wider text-charcoal/40 mb-0.5">Situation</span>
                  <span className="text-sm text-charcoal/80">{row.situation}</span>
                </div>
                <div className="md:col-span-4">
                  <span className="md:hidden block text-[10px] font-bold uppercase tracking-wider text-charcoal/40 mb-0.5">Best Format</span>
                  <span className="font-heading font-bold text-sm text-primary-500">{row.format}</span>
                </div>
                <div className="md:col-span-4">
                  <span className="md:hidden block text-[10px] font-bold uppercase tracking-wider text-charcoal/40 mb-0.5">Why</span>
                  <span className="text-sm text-muted-grey font-light">{row.why}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
