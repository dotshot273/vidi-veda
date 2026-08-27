import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Award, CheckCircle } from 'lucide-react';

export default function Subjects() {
  const [activeTab, setActiveTab] = useState('primary');

  const gradeSegments = {
    primary: {
      title: "Primary School",
      grades: "Classes I - V",
      board: "CBSE & ICSE Foundations",
      focus: "Building foundational math, basic reading, writing skills, environmental studies, and cultivating healthy study habits.",
      subjects: ["Mathematics", "Environmental Science (EVS)", "English Literature & Grammar", "Hindi", "Social Studies Basics", "Computer Literacy"]
    },
    middle: {
      title: "Middle School",
      grades: "Classes VI - VIII",
      board: "CBSE & ICSE Curriculum",
      focus: "Transitioning to formal sciences and history. Developing analytical thinking, algebra basics, grammar mastery, and systematic exam writing.",
      subjects: ["Mathematics", "General Science", "English Grammar & Lit", "Hindi / Sanskrit", "History & Civics", "Geography", "Computer Applications"]
    },
    high: {
      title: "High School (Boards)",
      grades: "Classes IX - X",
      board: "CBSE Board & ICSE Board prep",
      focus: "Rigorous concept mastery for board examinations. Numerical problem solving, scientific derivations, map practices, and pre-board revision cycles.",
      subjects: ["Mathematics (Algebra & Geometry)", "Physics", "Chemistry", "Biology", "Social Science (Hist/Civ/Geo/Eco)", "English Communicative / Language", "Computer Applications (Java)"]
    },
    senior: {
      title: "Higher Secondary (ISC/Boards)",
      grades: "Classes XI - XII",
      board: "CBSE & ISC Specialized Streams",
      focus: "Syllabus specialization. In-depth preparation for boards and foundation preparation for college entrance exams (Commerce, Humanities, Science).",
      subjects: ["Physics", "Chemistry", "Biology", "Mathematics (Calculus/Algebra)", "Accountancy", "Business Studies", "Economics", "Computer Science (Python/Java)", "English Core"]
    }
  };

  return (
    <section id="subjects" className="py-20 bg-primary-50/20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <span className="text-primary-400 font-heading font-extrabold text-sm uppercase tracking-widest block">Classes & Subjects</span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-charcoal">
            Comprehensive Tutoring from Class 1 to 12
          </h2>
          <div className="w-16 h-1 bg-primary-400 mx-auto rounded-full" />
          <p className="text-muted-grey text-base font-light">
            We cover all core academic divisions under the CBSE and ICSE boards. Select a stage below to view the syllabus and focus subjects we teach.
          </p>
        </div>

        {/* Interactive Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {Object.keys(gradeSegments).map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => setActiveTab(tabKey)}
              className={`px-6 py-3 rounded-full font-heading font-semibold text-sm transition-all duration-300 cursor-pointer ${
                activeTab === tabKey
                  ? 'bg-primary-400 text-white shadow-lg shadow-primary-400/20'
                  : 'bg-white text-charcoal/80 hover:bg-primary-50 hover:text-primary-400 border border-primary-100/50'
              }`}
            >
              {gradeSegments[tabKey].title}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-primary-100/40 shadow-xl shadow-primary-100/5 min-h-[350px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center text-left"
            >
              {/* Info Column */}
              <div className="lg:col-span-6 space-y-5">
                <div className="space-y-1">
                  <div className="inline-flex items-center space-x-2 bg-primary-100/50 px-3 py-1 rounded-lg text-primary-700 text-xs font-bold uppercase tracking-wider">
                    <Award className="h-4 w-4 text-primary-400" />
                    <span>{gradeSegments[activeTab].board}</span>
                  </div>
                  <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-charcoal">
                    {gradeSegments[activeTab].title} <span className="text-primary-400 font-medium">({gradeSegments[activeTab].grades})</span>
                  </h3>
                </div>
                
                <p className="text-sm text-muted-grey leading-relaxed font-light">
                  {gradeSegments[activeTab].focus}
                </p>

                <div className="flex items-center space-x-2 text-xs text-charcoal/70 bg-primary-50/50 p-3 rounded-lg border border-primary-100/30">
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>Syllabus mapped directly to NCERT and CISCE guidelines.</span>
                </div>
              </div>

              {/* Subject Tags Column */}
              <div className="lg:col-span-6 space-y-4">
                <h4 className="font-heading font-bold text-sm text-charcoal uppercase tracking-wider flex items-center space-x-1.5">
                  <BookOpen className="h-4 w-4 text-primary-400" />
                  <span>Key Subjects Taught</span>
                </h4>
                
                <div className="flex flex-wrap gap-2.5">
                  {gradeSegments[activeTab].subjects.map((sub, idx) => (
                    <span
                      key={idx}
                      className="bg-primary-50/60 border border-primary-100/40 text-charcoal/80 text-xs font-medium px-4 py-2.5 rounded-xl hover:bg-primary-100/40 hover:border-primary-300 hover:text-primary-400 transition-colors duration-200"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
