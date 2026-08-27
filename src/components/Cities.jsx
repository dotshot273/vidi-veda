import React from 'react';
import * as SlickModule from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { MapPin, ArrowUpRight, GraduationCap, Home, Globe } from 'lucide-react';

// react-slick is published as CommonJS; normalize the default export so it
// works whether the bundler gives us the component directly or wrapped.
const Slider = SlickModule.default?.default || SlickModule.default || SlickModule;

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

  const sliderSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 600,
    autoplay: true,
    autoplaySpeed: 2500,
    pauseOnHover: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    cssEase: 'ease-in-out',
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section id="cities" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-primary-400 font-heading font-extrabold text-sm uppercase tracking-widest block">Our Coverage</span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-charcoal">
            Home Tuition in Select Cities, Online Tuition Everywhere
          </h2>
          <div className="w-16 h-1 bg-primary-400 mx-auto rounded-full" />
          <p className="text-muted-grey text-base font-light">
            Offline home tuition is available only in the cities listed below. Our online tuition is available across all of India, so students anywhere can learn with our verified tutors.
          </p>

          {/* Coverage badges */}
          <div className="flex flex-col sm:flex-row justify-center items-stretch gap-3 pt-2 text-left">
            <div className="flex items-center gap-3 bg-primary-50/60 border border-primary-100/70 rounded-2xl px-4 py-3">
              <span className="w-10 h-10 rounded-xl bg-primary-400 text-white flex items-center justify-center shrink-0">
                <Home className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-heading font-bold text-sm text-charcoal">Home Tuition (Offline)</span>
                <span className="block text-xs text-muted-grey">Available in selected cities below</span>
              </span>
            </div>

            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3">
              <span className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <Globe className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-heading font-bold text-sm text-charcoal">Online Tuition</span>
                <span className="block text-xs text-muted-grey">Available across all of India</span>
              </span>
            </div>
          </div>
        </div>

        {/* Cities Slider */}
        <Slider {...sliderSettings} className="cities-slider pb-4">
          {cities.map((city, index) => (
            <div key={index} className="px-3 py-1">
              <a
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

                  <div className="flex items-center gap-2 text-xs text-charcoal/80 font-medium">
                    <GraduationCap className="h-4 w-4 text-primary-400 shrink-0" />
                    <span>{city.tutors} Verified Tutors Available</span>
                    {city.headOffice && (
                      <span className="text-[10px] font-bold text-primary-600 bg-primary-100/70 px-1.5 py-0.5 rounded uppercase tracking-wide">
                        HQ
                      </span>
                    )}
                  </div>
                </div>

                {/* Arrow Indicator */}
                <div className="bg-white group-hover:bg-primary-400 group-hover:text-white text-primary-400 p-1.5 rounded-full border border-primary-100 group-hover:border-primary-400 transition-all duration-300 self-start">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </a>
            </div>
          ))}
        </Slider>

      </div>
    </section>
  );
}
