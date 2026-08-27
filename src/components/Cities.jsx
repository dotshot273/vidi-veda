import React from 'react';
import { MapPin, ArrowUpRight, GraduationCap } from 'lucide-react';

export default function Cities() {
  const cities = [
    { name: "Bareilly", path: "/tutors-in-bareilly", state: "Uttar Pradesh", tutors: "80+", headOffice: true },
    { name: "Meerut", path: "/tutors-in-meerut", state: "Uttar Pradesh", tutors: "45+", headOffice: false },
    { name: "Lucknow", path: "/online-tuition-india", state: "Uttar Pradesh", tutors: "35+", headOffice: false },
    { name: "Kanpur", path: "/online-tuition-india", state: "Uttar Pradesh", tutors: "30+", headOffice: false },
    { name: "Jaipur", path: "/online-tuition-india", state: "Rajasthan", tutors: "25+", headOffice: false },
    { name: "Indore", path: "/online-tuition-india", state: "Madhya Pradesh", tutors: "20+", headOffice: false },
    { name: "Patna", path: "/online-tuition-india", state: "Bihar", tutors: "28+", headOffice: false },
    { name: "Ranchi", path: "/online-tuition-india", state: "Jharkhand", tutors: "15+", headOffice: false },
    { name: "Dehradun", path: "/online-tuition-india", state: "Uttarakhand", tutors: "22+", headOffice: false }
  ];

  return (
    <section id="cities" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-primary-400 font-heading font-extrabold text-sm uppercase tracking-widest block">Expansion & Coverage</span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-charcoal">
            Providing Home & Online Tutors Across India
          </h2>
          <div className="w-16 h-1 bg-primary-400 mx-auto rounded-full" />
          <p className="text-muted-grey text-base font-light">
            Headquartered in Bareilly, we are rapidly expanding our physical network of home tutors across Tier 2 and Tier 3 cities, alongside comprehensive online coverage nationwide.
          </p>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city, index) => (
            <a
              key={index}
              href={city.path}
              className={`p-6 rounded-2xl border text-left flex items-start justify-between group transition-all duration-300 ${
                city.headOffice
                  ? 'bg-primary-50/50 border-primary-300 shadow-md'
                  : 'bg-cream/40 border-primary-100 hover:bg-white hover:border-primary-300 hover:shadow-lg hover:shadow-primary-100/10'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-xl shrink-0 ${city.headOffice ? 'bg-primary-400 text-white' : 'bg-primary-100 text-primary-400'}`}>
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-charcoal leading-none group-hover:text-primary-400 transition-colors">
                      {city.name}
                    </h3>
                    <span className="text-xs text-muted-grey mt-0.5 block">{city.state}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 text-xs text-charcoal/80 font-medium">
                  <GraduationCap className="h-4 w-4 text-primary-400 shrink-0" />
                  <span>{city.tutors} Verified Tutors Available</span>
                </div>
                
                {city.headOffice && (
                  <span className="inline-block bg-primary-200/50 border border-primary-300/40 text-primary-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    HQ & Operations Center
                  </span>
                )}
              </div>

              {/* Arrow Indicator */}
              <div className="bg-white group-hover:bg-primary-400 group-hover:text-white text-primary-400 p-1.5 rounded-full border border-primary-100 group-hover:border-primary-400 transition-all duration-300 self-start">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </a>
          ))}
        </div>

        {/* Global callout */}
        <div className="mt-12 bg-primary-50/30 rounded-3xl p-6 sm:p-10 border border-primary-100/50 text-center max-w-4xl mx-auto space-y-4">
          <h3 className="font-heading font-bold text-xl text-charcoal">
            Don't see your city listed above?
          </h3>
          <p className="text-sm text-muted-grey leading-relaxed max-w-2xl mx-auto font-light">
            No worries! We offer premium <strong>1-to-1 Online Tuition</strong> all over India, bringing Bareilly's finest home instructors and experienced board teachers right to your laptop or tablet with specialized digital whiteboard features.
          </p>
          <div className="pt-2">
            <a
              href="/online-tuition-india"
              className="inline-flex items-center space-x-2 bg-primary-400 hover:bg-primary-500 text-white font-heading font-semibold text-sm px-6 py-3 rounded-full transition-all shadow-md shadow-primary-400/10 hover:-translate-y-0.5"
            >
              <span>Explore Online Tuition</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
