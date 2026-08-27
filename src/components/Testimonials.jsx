import React, { useState, useEffect } from 'react';
import { Star, Quote, Play, X, ChevronLeft, ChevronRight, Video } from 'lucide-react';

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

// Video testimonials. Replace `src` with real YouTube/embed URLs and `thumb`
// with a poster image path (e.g. /images/testimonials/priya.jpg) when available.
const videoTestimonials = [
  { name: "Priya Verma", detail: "Parent · Class 10 CBSE", src: "", thumb: "/images/testimonials/priya.jpg" },
  { name: "Rakesh Gupta", detail: "Parent · Class 8 ICSE", src: "", thumb: "/images/testimonials/rakesh.jpg" },
  { name: "Sunita Devi", detail: "Parent · Class 12 Science", src: "", thumb: "/images/testimonials/sunita.jpg" },
  { name: "Amit Saxena", detail: "Parent · Class 6 CBSE", src: "", thumb: "/images/testimonials/amit.jpg" },
  { name: "Neha Agarwal", detail: "Parent · Class 9 CBSE", src: "", thumb: "/images/testimonials/neha.jpg" },
  { name: "Vikram Singh", detail: "Parent · Class 11 Commerce", src: "", thumb: "/images/testimonials/vikram.jpg" },
  { name: "Pooja Mishra", detail: "Parent · Class 7 ICSE", src: "", thumb: "/images/testimonials/pooja.jpg" },
  { name: "Deepak Rana", detail: "Parent · Class 10 State Board", src: "", thumb: "/images/testimonials/deepak.jpg" },
];

const INITIAL_COUNT = 4;

export default function Testimonials() {
  const [showAll, setShowAll] = useState(false);
  const [activeVideo, setActiveVideo] = useState(null);

  const visible = showAll ? videoTestimonials : videoTestimonials.slice(0, INITIAL_COUNT);

  // Lock body scroll while modal is open + close on Escape
  useEffect(() => {
    if (!activeVideo) return;
    const onKey = (e) => e.key === 'Escape' && setActiveVideo(null);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [activeVideo]);

  const scrollRow = (dir) => {
    const row = document.getElementById('video-testimonial-row');
    if (row) row.scrollBy({ left: dir * 340, behavior: 'smooth' });
  };

  return (
    <section id="testimonials" className="py-20 bg-white relative overflow-hidden">
      {/* Decorative details */}
      <div className="absolute top-1/3 right-0 w-24 h-48 bg-primary-100/40 rounded-l-full blur-xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <span className="text-primary-400 font-heading font-extrabold text-sm uppercase tracking-widest block">Parent Success Stories</span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-charcoal">
            See What Parents Say About Vidi Veda
          </h2>
          <div className="w-16 h-1 bg-primary-400 mx-auto rounded-full" />
          <p className="text-muted-grey text-base font-light">
            The trust of parents is our biggest achievement. Hear directly from families who have experienced personalized learning support through Vidi Veda.
          </p>
        </div>

        {/* Text Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {reviews.map((rev, index) => (
            <div
              key={index}
              className="bg-cream/20 p-8 rounded-3xl border border-primary-100/50 shadow-md relative text-left flex flex-col justify-between hover:bg-white hover:border-primary-200 hover:shadow-xl hover:shadow-primary-100/10 transition-all duration-300"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-primary-200/50 pointer-events-none" />
              <div>
                <div className="flex space-x-1 mb-4">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="h-4.5 w-4.5 text-primary-400 fill-primary-400" />
                  ))}
                </div>
                <p className="text-sm text-charcoal/90 leading-relaxed font-light italic mb-6">
                  "{rev.comment}"
                </p>
              </div>
              <div className="flex items-center space-x-3 pt-4 border-t border-primary-100/30">
                <div className="w-11 h-11 rounded-full bg-primary-400 text-white flex items-center justify-center font-heading font-extrabold text-base shadow-sm">
                  {rev.parent.charAt(0)}
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-charcoal leading-none">{rev.parent}</h4>
                  <span className="text-[10px] text-muted-grey mt-1 block font-semibold uppercase tracking-wider">{rev.role}</span>
                  <span className="text-[9px] text-primary-400 font-bold block mt-0.5">{rev.city}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Video Testimonials — Netflix-style horizontal scroll */}
        <div>
          <div className="flex items-end justify-between mb-6 gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-primary-500 font-heading font-bold text-xs uppercase tracking-widest mb-1">
                <Video className="h-4 w-4" />
                Video Stories
              </span>
              <h3 className="font-heading font-extrabold text-2xl text-charcoal">
                Hear It From Parents Themselves
              </h3>
            </div>
            {/* Scroll arrows (desktop) */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <button
                onClick={() => scrollRow(-1)}
                aria-label="Scroll left"
                className="w-10 h-10 rounded-full bg-white border border-primary-100 text-primary-500 hover:bg-primary-400 hover:text-white hover:border-primary-400 flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => scrollRow(1)}
                aria-label="Scroll right"
                className="w-10 h-10 rounded-full bg-white border border-primary-100 text-primary-500 hover:bg-primary-400 hover:text-white hover:border-primary-400 flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Scroll row */}
          <div
            id="video-testimonial-row"
            className="flex gap-5 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-hide"
          >
            {visible.map((video, index) => (
              <VideoCard key={index} video={video} onClick={() => setActiveVideo(video)} />
            ))}
          </div>

          {/* View more */}
          {videoTestimonials.length > INITIAL_COUNT && (
            <div className="text-center mt-8">
              <button
                onClick={() => setShowAll((s) => !s)}
                className="inline-flex items-center gap-2 bg-white border border-primary-200 text-primary-500 hover:bg-primary-400 hover:text-white hover:border-primary-400 font-heading font-semibold text-sm px-7 py-3 rounded-full transition-all duration-300 cursor-pointer"
              >
                {showAll ? 'View Less' : `View More Videos (${videoTestimonials.length - INITIAL_COUNT}+)`}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Video popup modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-sm"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-charcoal rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveVideo(null)}
              aria-label="Close video"
              className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="aspect-video w-full bg-black">
              {activeVideo.src ? (
                <iframe
                  className="w-full h-full"
                  src={activeVideo.src}
                  title={`${activeVideo.name} testimonial`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center text-white/70 gap-3 px-6">
                  <div className="w-16 h-16 rounded-full bg-primary-400/20 flex items-center justify-center">
                    <Play className="h-7 w-7 text-primary-400 fill-primary-400" />
                  </div>
                  <p className="font-heading font-semibold text-white">{activeVideo.name}</p>
                  <p className="text-sm">Video coming soon. Add the video URL to display it here.</p>
                </div>
              )}
            </div>

            <div className="p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-400 text-white flex items-center justify-center font-heading font-bold shrink-0">
                {activeVideo.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-heading font-bold text-white text-sm leading-none">{activeVideo.name}</h4>
                <span className="text-xs text-white/60">{activeVideo.detail}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function VideoCard({ video, onClick }) {
  const [imgOk, setImgOk] = useState(true);

  return (
    <button
      onClick={onClick}
      className="group relative shrink-0 w-[280px] sm:w-[300px] h-[380px] rounded-2xl overflow-hidden snap-start text-left cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-primary-300/30 hover:-translate-y-1.5 transition-all duration-300"
    >
      {/* Thumbnail or fallback */}
      {video.thumb && imgOk ? (
        <img
          src={video.thumb}
          alt={video.name}
          onError={() => setImgOk(false)}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-400 via-primary-500 to-charcoal">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 25% 20%, white 1.5px, transparent 1.5px)', backgroundSize: '26px 26px' }} />
        </div>
      )}

      {/* Dark gradient for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent" />

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="w-16 h-16 rounded-full bg-white/90 group-hover:bg-primary-400 flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300">
          <Play className="h-6 w-6 text-primary-500 group-hover:text-white fill-current ml-1" />
        </span>
      </div>

      {/* Badge */}
      <span className="absolute top-3 left-3 bg-primary-400 text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-md shadow">
        Parent Review
      </span>

      {/* Name */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h4 className="font-heading font-bold text-white text-base leading-tight">{video.name}</h4>
        <span className="text-xs text-white/75">{video.detail}</span>
      </div>
    </button>
  );
}
