import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, CheckCircle, Baby, Blocks, FlaskConical, GraduationCap,
  Trophy, Sparkles, Cpu, Layers, ArrowRight, Rocket, ShieldCheck, Star
} from 'lucide-react';

// Main class-stage tabs
const stages = [
  {
    key: 'foundation',
    tab: 'Play Group – Class 1',
    icon: Baby,
    title: 'Building Strong Learning Foundations',
    grades: 'Play Group to Class 1',
    intro: 'At this stage, we focus on developing basic learning skills, communication, creativity, and confidence through engaging and age-appropriate teaching methods.',
    subjects: [
      'English Basics', 'Phonics & Reading Skills', 'Hindi Basics',
      'Numbers & Basic Mathematics', 'Drawing & Creative Activities',
      'General Awareness', 'Speaking & Communication Skills', 'Rhymes & Story Learning',
    ],
  },
  {
    key: 'primary',
    tab: 'Class 2 – 5',
    icon: Blocks,
    title: 'Strengthening Core Concepts and Study Habits',
    grades: 'Class 2 to Class 5',
    intro: 'These years are important for building a strong academic foundation. We help students improve understanding, concentration, reading skills, and problem-solving abilities.',
    subjects: [
      'Mathematics', 'English', 'Hindi', 'Environmental Studies (EVS)',
      'General Science', 'Social Studies', 'Computer Studies', 'General Knowledge',
      'Spoken English', 'School Homework Support',
    ],
  },
  {
    key: 'middle',
    tab: 'Class 6 – 8',
    icon: FlaskConical,
    title: 'Building Subject Knowledge and Academic Confidence',
    grades: 'Class 6 to Class 8',
    intro: 'Middle school introduces more advanced subjects and concepts. Our tutors help students understand topics clearly and prepare them for higher classes.',
    subjects: [
      'Mathematics', 'Science', 'Physics Basics', 'Chemistry Basics', 'Biology Basics',
      'English Language & Literature', 'Hindi', 'Social Science', 'History', 'Geography',
      'Civics', 'Computer Science', 'Information Technology (IT)', 'Coding Fundamentals',
      'Artificial Intelligence (AI) Basics', 'Robotics & STEM Learning', 'School Project Support',
    ],
    more: true,
  },
  {
    key: 'secondary',
    tab: 'Class 9 – 10',
    icon: GraduationCap,
    title: 'Board Exam Preparation and Concept Clarity',
    grades: 'Class 9 & Class 10',
    intro: "These classes play an important role in a student's academic journey. We focus on concept building, regular practice, revision, and exam preparation.",
    subjects: [
      'Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi',
      'Social Science', 'History', 'Geography', 'Political Science', 'Economics',
      'Computer Applications', 'Information Technology (IT)', 'Artificial Intelligence (AI)',
      'Sanskrit', 'Board Exam Preparation',
    ],
    more: true,
  },
  {
    key: 'senior',
    tab: 'Class 11 – 12',
    icon: Trophy,
    title: 'Expert Guidance for Higher Secondary Education',
    grades: 'Class 11 & Class 12',
    intro: 'We provide subject-specific support to help students prepare for board exams, competitive exams, and future career goals.',
    streams: [
      {
        name: 'Science Stream',
        subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science', 'Information Practices', 'Physical Education'],
      },
      {
        name: 'Commerce Stream',
        subjects: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics', 'Applied Mathematics', 'Entrepreneurship', 'Informatics Practices'],
      },
      {
        name: 'Humanities Stream',
        subjects: ['History', 'Geography', 'Political Science', 'Economics', 'Sociology', 'Psychology', 'English', 'Physical Education'],
      },
    ],
    more: true,
  },
];

// Special program highlight cards
const specialPrograms = [
  {
    icon: Rocket,
    tag: 'E-Techno School Support · 6th to 10th',
    title: 'Special Academic Support for E-Techno School Students',
    desc: 'We provide personalized tutoring support for students studying in E-Techno schools and integrated learning programs. Our tutors help students manage both school academics and competitive exam preparation with confidence.',
    subjects: [
      'Advanced Mathematics', 'Science', 'Physics Foundation', 'Chemistry Foundation',
      'Biology Foundation', 'Mental Ability', 'Logical Reasoning', 'Quantitative Aptitude',
      'Olympiad Preparation', 'NTSE Preparation', 'JEE Foundation', 'NEET Foundation',
      'Coding Fundamentals', 'Artificial Intelligence (AI)', 'Robotics & STEM Learning',
      'School Assignments & Projects', 'Exam Preparation & Revision Support',
    ],
    benefits: [
      'Students from Classes 6 to 10',
      'Students preparing for Olympiads',
      'Students enrolled in E-Techno and integrated programs',
      'Students building a strong foundation for JEE and NEET',
      'Students looking to improve problem-solving and analytical skills',
    ],
  },
  {
    icon: Sparkles,
    tag: 'Additional Learning Support',
    title: 'Beyond School Subjects',
    desc: 'Extra support that goes past the syllabus to build well-rounded, confident learners with lifelong skills.',
    subjects: [
      'Homework Assistance', 'Assignment Support', 'Exam Preparation', 'Doubt Solving Sessions',
      'Spoken English', 'Personality Development', 'Basic Computer Skills', 'Coding for Beginners',
      'Artificial Intelligence Basics', 'Olympiad Preparation', 'Scholarship Exam Preparation',
      'Study Skills & Time Management',
    ],
  },
];

const boards = [
  'CBSE', 'ICSE', 'ISC', 'State Boards', 'International School Curriculum',
  'Private School Curriculum', 'E-Techno Schools', 'Other Recognized Academic Boards',
];

export default function Subjects() {
  const [activeKey, setActiveKey] = useState('foundation');
  const active = stages.find((s) => s.key === activeKey);
  const ActiveIcon = active.icon;

  return (
    <section id="subjects" className="py-20 bg-primary-50/20 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-20 right-[-8%] w-80 h-80 rounded-full bg-primary-100/30 blur-3xl -z-10" />
      <div className="absolute bottom-10 left-[-8%] w-96 h-96 rounded-full bg-primary-200/15 blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <span className="text-primary-400 font-heading font-extrabold text-sm uppercase tracking-widest block">Classes &amp; Subjects</span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-charcoal leading-tight">
            Personalized Learning Support for Students from Play Group to Class 12th
          </h2>
          <div className="w-16 h-1 bg-primary-400 mx-auto rounded-full" />
          <p className="text-muted-grey text-base font-light">
            At Vidi Veda, we provide home tuition and online learning support for students across different boards and school curriculums in India. Our tutors help students build strong fundamentals, improve understanding, complete school work confidently, and prepare for exams with the right guidance.
          </p>
        </div>

        {/* Interactive Stage Selector + Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* Left: Vertical stage tabs */}
          <div className="lg:col-span-4">
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 -mx-1 px-1">
              {stages.map((stage) => {
                const Icon = stage.icon;
                const isActive = stage.key === activeKey;
                return (
                  <button
                    key={stage.key}
                    onClick={() => setActiveKey(stage.key)}
                    className={`group flex items-center gap-3 shrink-0 lg:w-full text-left px-4 py-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'bg-primary-400 border-primary-400 shadow-lg shadow-primary-400/25 lg:translate-x-1'
                        : 'bg-white border-primary-100/60 hover:border-primary-300 hover:bg-primary-50/50'
                    }`}
                  >
                    <span
                      className={`flex items-center justify-center w-11 h-11 rounded-xl shrink-0 transition-colors duration-300 ${
                        isActive ? 'bg-white/20 text-white' : 'bg-primary-50 text-primary-400 group-hover:bg-primary-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className={`block font-heading font-bold text-sm leading-tight ${isActive ? 'text-white' : 'text-charcoal'}`}>
                        {stage.tab}
                      </span>
                      <span className={`block text-xs mt-0.5 truncate ${isActive ? 'text-white/80' : 'text-muted-grey'}`}>
                        {stage.grades}
                      </span>
                    </span>
                    <ArrowRight className={`h-4 w-4 ml-auto shrink-0 hidden lg:block transition-all duration-300 ${isActive ? 'text-white opacity-100' : 'text-primary-300 opacity-0 group-hover:opacity-100'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Animated content panel */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl border border-primary-100/50 shadow-xl shadow-primary-100/10 p-7 sm:p-9 h-full relative overflow-hidden"
              >
                {/* Watermark icon */}
                <ActiveIcon className="absolute -top-4 -right-4 h-32 w-32 text-primary-50 -z-0 pointer-events-none" />

                <div className="relative">
                  {/* Panel header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-400 text-white shrink-0 shadow-md shadow-primary-400/20">
                      <ActiveIcon className="h-7 w-7" />
                    </div>
                    <div>
                      <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary-500 bg-primary-50 px-2.5 py-1 rounded-md mb-1.5">
                        {active.grades}
                      </span>
                      <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-charcoal leading-snug">
                        {active.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm text-muted-grey leading-relaxed font-light mb-6">
                    {active.intro}
                  </p>

                  {/* Streams (for 11-12) or flat subject list */}
                  {active.streams ? (
                    <div className="space-y-5">
                      {active.streams.map((stream) => (
                        <div key={stream.name}>
                          <h4 className="font-heading font-bold text-sm text-charcoal uppercase tracking-wide flex items-center gap-2 mb-3">
                            <Layers className="h-4 w-4 text-primary-400" />
                            {stream.name}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {stream.subjects.map((sub) => (
                              <SubjectChip key={sub} label={sub} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <h4 className="font-heading font-bold text-sm text-charcoal uppercase tracking-wide flex items-center gap-2 mb-3">
                        <BookOpen className="h-4 w-4 text-primary-400" />
                        Subjects Covered
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {active.subjects.map((sub) => (
                          <SubjectChip key={sub} label={sub} />
                        ))}
                      </div>
                    </>
                  )}

                  {active.more && (
                    <p className="text-xs text-muted-grey/80 italic mt-4">…and other subjects</p>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Highlighted Special Programs Band */}
        <div className="relative mt-14">
          {/* Highlight backdrop */}
          <div className="absolute inset-x-[-1rem] sm:inset-x-[-2rem] -inset-y-6 bg-gradient-to-br from-primary-100/40 via-primary-50/30 to-transparent rounded-[2.5rem] -z-10" />

          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 text-primary-500 font-heading font-extrabold text-xs uppercase tracking-widest bg-white border border-primary-200/60 px-4 py-1.5 rounded-full shadow-sm">
              <Star className="h-3.5 w-3.5 fill-primary-400 text-primary-400" />
              Special Programs
            </span>
            <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-charcoal mt-4">
              Programs That Set Students Apart
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* E-Techno — Featured card */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 relative bg-white rounded-3xl shadow-2xl shadow-primary-300/25 ring-1 ring-primary-200/60 overflow-hidden"
            >
              {/* Floating featured badge */}
              <div className="absolute top-5 right-5 z-10">
                <span className="flex items-center gap-1.5 bg-primary-400 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg shadow-primary-400/30">
                  <Star className="h-3.5 w-3.5 fill-white" />
                  Featured Program
                </span>
              </div>

              {/* Gradient top ribbon */}
              <div className="bg-gradient-to-r from-primary-500 via-primary-400 to-primary-500 px-7 sm:px-9 pt-8 pb-16 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, white 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
                <div className="relative flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm text-white shrink-0">
                    <Rocket className="h-6 w-6" />
                  </div>
                  <span className="inline-block bg-white/20 backdrop-blur-sm text-white font-heading font-extrabold text-lg sm:text-xl tracking-wide px-4 py-2 rounded-xl shadow-sm">
                    {specialPrograms[0].tag}
                  </span>
                </div>
              </div>

              {/* Body pulled up over ribbon */}
              <div className="px-7 sm:px-9 pb-8 -mt-8 relative">
                <div className="bg-white rounded-2xl shadow-lg shadow-primary-100/40 border border-primary-100/50 p-6 sm:p-7">
                  <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-charcoal mb-3">{specialPrograms[0].title}</h3>
                  <p className="text-sm text-muted-grey leading-relaxed font-light mb-5">{specialPrograms[0].desc}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {specialPrograms[0].subjects.map((sub) => (
                      <span
                        key={sub}
                        className="text-xs font-medium bg-primary-50/70 border border-primary-100/60 text-charcoal/80 px-3 py-1.5 rounded-lg hover:bg-primary-100/60 hover:border-primary-300 transition-colors duration-200"
                      >
                        {sub}
                      </span>
                    ))}
                    <span className="text-xs font-medium text-primary-400/80 px-2 py-1.5 italic">…and more</span>
                  </div>

                  <div className="bg-primary-50/50 rounded-2xl p-5 border border-primary-100/50">
                    <h4 className="font-heading font-bold text-sm text-charcoal mb-3.5 flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-primary-400" />
                      Who Can Benefit?
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2.5">
                      {specialPrograms[0].benefits.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-sm text-charcoal/75">
                          <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Additional Learning Support — accent card */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-5 relative bg-gradient-to-br from-primary-100/70 via-primary-50 to-cream rounded-3xl p-7 sm:p-8 overflow-hidden ring-1 ring-primary-200/60 shadow-lg shadow-primary-200/20"
            >
              <div className="absolute bottom-[-50px] left-[-40px] w-56 h-56 rounded-full bg-primary-200/30 blur-3xl pointer-events-none" />
              <div className="absolute top-[-40px] right-[-30px] w-40 h-40 rounded-full bg-primary-300/25 blur-2xl pointer-events-none" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-500 text-white shrink-0 shadow-lg shadow-primary-400/25">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary-600">
                    {specialPrograms[1].tag}
                  </span>
                </div>
                <h3 className="font-heading font-extrabold text-xl sm:text-2xl mb-3 text-charcoal">{specialPrograms[1].title}</h3>
                <p className="text-sm text-muted-grey leading-relaxed font-light mb-6">{specialPrograms[1].desc}</p>

                <div className="space-y-2.5">
                  {specialPrograms[1].subjects.map((sub) => (
                    <div
                      key={sub}
                      className="flex items-center gap-2.5 text-sm text-charcoal/80 bg-white/70 border border-primary-100/60 rounded-xl px-3.5 py-2.5 hover:bg-white hover:border-primary-300 transition-colors duration-200"
                    >
                      <CheckCircle className="h-4 w-4 text-primary-400 shrink-0" />
                      <span>{sub}</span>
                    </div>
                  ))}
                  <p className="text-xs text-primary-500/80 italic pt-1">…and other subjects</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Boards & Curriculums */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mt-10 bg-white rounded-3xl border border-primary-100/50 shadow-lg shadow-primary-100/10 p-7 sm:p-9"
        >
          <div className="text-center mb-6">
            <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-charcoal flex items-center justify-center gap-2">
              <Cpu className="h-5 w-5 text-primary-400" />
              Boards &amp; Curriculums We Support
            </h3>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {boards.map((board) => (
              <span
                key={board}
                className="flex items-center gap-2 bg-primary-50/70 border border-primary-100/60 text-charcoal/85 text-sm font-medium px-4 py-2.5 rounded-full hover:border-primary-300 hover:bg-primary-100/50 transition-colors duration-200"
              >
                <CheckCircle className="h-4 w-4 text-primary-400 shrink-0" />
                {board}
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
          From early learning to board exam preparation, Vidi Veda provides personalized learning support to help students build confidence, improve academic performance, and achieve their educational goals.
        </motion.p>

      </div>
    </section>
  );
}

function SubjectChip({ label }) {
  return (
    <span className="bg-primary-50/60 border border-primary-100/50 text-charcoal/80 text-xs font-medium px-3.5 py-2 rounded-xl hover:bg-primary-100/50 hover:border-primary-300 hover:text-primary-500 transition-colors duration-200">
      {label}
    </span>
  );
}
