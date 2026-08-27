import React from 'react';
import { Star, Quote } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    {
      parent: "Meenakshi Sharma",
      role: "Mother of Class X (CBSE) Student",
      city: "Bareilly, UP",
      rating: 5,
      comment: "We were very worried about our daughter's Class 10 Math board preparation. A friend recommended Vidi Veda. The tutor they assigned, Rohit Sir, was extremely patient. He cleared all algebra concepts and solved past ten years sample papers. She scored 95%! We are very grateful."
    },
    {
      parent: "Sanjay Rastogi",
      role: "Father of Class VIII (ICSE) Student",
      city: "Bareilly, UP",
      rating: 5,
      comment: "Unlike massive coaching institutes in Rampur Garden, Vidi Veda home tuition offered one-on-one attention. The teacher was highly professional and background-verified, which made us feel safe. The weekly mock tests on WhatsApp kept us updated. Highly recommended!"
    },
    {
      parent: "Anjali Tomar",
      role: "Mother of Class XII (CBSE) Science Student",
      city: "Meerut, UP",
      rating: 5,
      comment: "Excellent service! We opted for online physics and chemistry tuition because we wanted a highly experienced board teacher. Vidi Veda matched us with a teacher who explains numerical derivations using a digital tablet. My son's confidence has grown tremendously."
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-white relative">
      {/* Decorative details */}
      <div className="absolute top-1/3 right-0 w-24 h-48 bg-primary-100/40 rounded-l-full blur-xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-primary-400 font-heading font-extrabold text-sm uppercase tracking-widest block">Parent Experiences</span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-charcoal">
            What Parents Say About Vidi Veda
          </h2>
          <div className="w-16 h-1 bg-primary-400 mx-auto rounded-full" />
          <p className="text-muted-grey text-base font-light">
            Real stories of academic transformation, improved grades, and restored confidence from middle-class families in Tier 2 & Tier 3 cities.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((rev, index) => (
            <div
              key={index}
              className="bg-cream/20 p-8 rounded-3xl border border-primary-100/50 shadow-md relative text-left flex flex-col justify-between hover:bg-white hover:border-primary-200 hover:shadow-xl hover:shadow-primary-100/10 transition-all duration-300"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-primary-200/50 pointer-events-none" />
              
              <div>
                {/* Rating stars */}
                <div className="flex space-x-1 mb-4">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="h-4.5 w-4.5 text-primary-400 fill-primary-400" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-sm text-charcoal/90 leading-relaxed font-light italic mb-6">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author info */}
              <div className="flex items-center space-x-3 pt-4 border-t border-primary-100/30">
                {/* Fallback avatar with initial letter */}
                <div className="w-11 h-11 rounded-full bg-primary-400 text-white flex items-center justify-center font-heading font-extrabold text-base shadow-sm">
                  {rev.parent.charAt(0)}
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-charcoal leading-none">
                    {rev.parent}
                  </h4>
                  <span className="text-[10px] text-muted-grey mt-1 block font-semibold uppercase tracking-wider">{rev.role}</span>
                  <span className="text-[9px] text-primary-400 font-bold block mt-0.5">{rev.city}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
