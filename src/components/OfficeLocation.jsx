import React from 'react';
import { MapPin, Navigation, Star, ShieldCheck } from 'lucide-react';

export default function OfficeLocation() {
  return (
    <section id="office" className="py-16 bg-primary-50/20 relative border-t border-primary-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Details side */}
          <div className="lg:col-span-5 text-left space-y-5">
            <span className="text-primary-400 font-heading font-extrabold text-sm uppercase tracking-widest block">Main Office</span>
            <h2 className="font-heading font-extrabold text-3xl text-charcoal">
              Visit Us in Bareilly
            </h2>
            <p className="text-sm text-muted-grey leading-relaxed font-light">
              Our central operations and coordinator training center is situated in Bareilly. We welcome parents, tutors, and partners to visit our office to align on schedules, curriculum standards, and verification audits.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start space-x-3 text-sm">
                <MapPin className="h-5 w-5 text-primary-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-charcoal leading-none mb-1">Vidi Veda Headquarters</h4>
                  <p className="text-muted-grey font-light">Rampur Garden / Civil Lines Area, Bareilly, Uttar Pradesh, India - 243001</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-xs text-charcoal/80 bg-white p-3.5 rounded-xl border border-primary-100/40">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                <span>Physical operations verified by Google Business Profile.</span>
              </div>
            </div>

            <div className="pt-2 flex items-center space-x-4">
              <a
                href="https://maps.google.com/?q=Bareilly,+Uttar+Pradesh"
                target="_blank"
                rel="noreferrer"
                className="bg-primary-400 hover:bg-primary-500 text-white font-heading font-semibold text-xs px-6 py-3 rounded-full transition flex items-center space-x-2 shadow-md shadow-primary-400/10 cursor-pointer"
              >
                <Navigation className="h-4 w-4" />
                <span>Get Directions</span>
              </a>
              
              <div className="flex items-center space-x-1.5">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-charcoal">4.9 / 5.0 (Google Reviews)</span>
              </div>
            </div>
          </div>

          {/* Map Side */}
          <div className="lg:col-span-7 h-[350px] w-full rounded-3xl overflow-hidden border-6 border-white shadow-xl relative">
            <iframe
              title="Vidi Veda Bareilly Office Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112338.41103683072!2d79.37894269871783!3d28.361099615291244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39a0073111f185ef%3A0x6b772c3d52670e30!2sBareilly%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1689999999999!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

        </div>
      </div>
    </section>
  );
}
