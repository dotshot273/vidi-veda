import React, { useState } from 'react';
import { Phone, MessageCircle, Mail, Clock, Loader2, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [message, setMessage] = useState('');
  const [validationError, setValidationError] = useState('');

  const validate = () => {
    if (!name.trim()) return "Name is required";
    if (!mobile.trim()) return "Mobile number is required";
    if (!/^\d{10}$/.test(mobile.trim())) return "Enter a valid 10-digit mobile number";
    if (!message.trim()) return "Message is required";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setValidationError(err);
      return;
    }
    setValidationError('');
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/api.php?action=submit_contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, mobile, message }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        setName('');
        setEmail('');
        setMobile('');
        setMessage('');
      } else {
        setError(data.message || 'Submission failed. Please try again.');
      }
    } catch (err) {
      setError('Could not submit form. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-primary-400 font-heading font-extrabold text-sm uppercase tracking-widest block">Get In Touch</span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-charcoal">
            Have Questions? Talk to Us
          </h2>
          <div className="w-16 h-1 bg-primary-400 mx-auto rounded-full" />
          <p className="text-muted-grey text-base font-light">
            We are here to help. Drop us a message, write an email, or call our direct parent hotline anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Info Side */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div className="space-y-6 text-left">
              <h3 className="font-heading font-extrabold text-2xl text-charcoal">
                Contact Information
              </h3>
              <p className="text-muted-grey text-sm leading-relaxed font-light">
                Feel free to visit our main office in Bareilly or call our representative numbers. We operate Monday to Saturday from 9:00 AM to 8:00 PM.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-center space-x-4 bg-primary-50/40 p-4 rounded-2xl border border-primary-100/50">
                  <div className="bg-primary-400 text-white p-3 rounded-xl">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs text-muted-grey font-medium uppercase tracking-wider block">Call Us</span>
                    <a href="tel:6398889697" className="font-heading font-extrabold text-lg text-charcoal hover:text-primary-400 transition-colors block">
                      +91 63988 89697
                    </a>
                    <a href="tel:9634347076" className="font-heading font-extrabold text-lg text-charcoal hover:text-primary-400 transition-colors block">
                      +91 96343 47076
                    </a>
                    <span className="text-xs text-muted-grey font-light block mt-0.5">Parent hotline, Mon-Sat 9:00 AM - 8:00 PM</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 bg-primary-50/40 p-4 rounded-2xl border border-primary-100/50">
                  <div className="bg-emerald-500 text-white p-3 rounded-xl">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs text-muted-grey font-medium uppercase tracking-wider block">WhatsApp</span>
                    <a 
                      href="https://wa.me/916398889697?text=Hi%20Vidi%20Veda,%20I%20have%20an%20inquiry."
                      target="_blank"
                      rel="noreferrer"
                      className="font-heading font-extrabold text-lg text-charcoal hover:text-emerald-500 transition-colors"
                    >
                      Chat with us
                    </a>
                    <span className="text-xs text-muted-grey font-light block mt-0.5">Fastest response — send a screenshot anytime</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 bg-primary-50/40 p-4 rounded-2xl border border-primary-100/50">
                  <div className="bg-primary-400 text-white p-3 rounded-xl">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs text-muted-grey font-medium uppercase tracking-wider block">Email</span>
                    <a href="mailto:support.vidiveda@gmail.com" className="font-heading font-extrabold text-lg text-charcoal hover:text-primary-400 transition-colors">
                      support.vidiveda@gmail.com
                    </a>
                    <span className="text-xs text-muted-grey font-light block mt-0.5">For detailed queries &amp; documents</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 bg-primary-50/40 p-4 rounded-2xl border border-primary-100/50">
                  <div className="bg-primary-400 text-white p-3 rounded-xl">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs text-muted-grey font-medium uppercase tracking-wider block">Office Hours</span>
                    <span className="font-heading font-bold text-sm text-charcoal block">
                      Mon - Sat, 9:00 AM - 8:00 PM
                    </span>
                    <span className="text-xs text-muted-grey font-light block mt-0.5">Closed Sundays</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-7 bg-cream/35 border border-primary-100 rounded-3xl p-6 sm:p-10 shadow-xl shadow-primary-50/40 text-left">
            <h3 className="font-heading font-extrabold text-xl text-charcoal mb-6">
              Send Us a Quick Message
            </h3>

            {success ? (
              <div className="text-center py-10 space-y-4">
                <div className="bg-emerald-100 text-emerald-600 p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="font-heading font-bold text-lg text-charcoal">Message Sent Successfully!</h4>
                <p className="text-xs text-muted-grey font-light max-w-sm mx-auto">
                  Thank you for writing. Our customer support team will reply to your email or contact number within 24 hours.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="bg-primary-400 hover:bg-primary-500 text-white text-xs font-semibold px-5 py-2.5 rounded-full transition cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {validationError && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg text-red-700 text-xs font-semibold">
                    {validationError}
                  </div>
                )}
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg text-red-700 text-xs font-semibold">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-charcoal">Your Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Anand Sen"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white border border-primary-100 focus:border-primary-400 focus:outline-none rounded-xl px-4 py-2.5 text-xs"
                    />
                  </div>

                  {/* Mobile */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-charcoal">Mobile Number *</label>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="10-digit number"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-white border border-primary-100 focus:border-primary-400 focus:outline-none rounded-xl px-4 py-2.5 text-xs"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal">Email Address (Optional)</label>
                  <input
                    type="email"
                    placeholder="e.g. anand@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-primary-100 focus:border-primary-400 focus:outline-none rounded-xl px-4 py-2.5 text-xs"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal">How Can We Help You? *</label>
                  <textarea
                    rows={4}
                    placeholder="Describe your query in detail..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-white border border-primary-100 focus:border-primary-400 focus:outline-none rounded-xl px-4 py-2.5 text-xs"
                  />
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary-400 hover:bg-primary-500 text-white font-heading font-semibold text-xs py-3.5 rounded-xl transition flex items-center justify-center space-x-1.5 shadow-md shadow-primary-400/10 disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4.5 w-4.5 animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <span>Send Query Message</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
