import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, GraduationCap, BookOpen, Clock, MapPin, Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const SUBJECTS = ["All Subjects (Primary)", "Mathematics", "Physics", "Chemistry", "Biology", "English Literature & Grammar", "Social Studies", "Computer Programming (Java/Python)", "Accountancy & Commerce"];
const EXPERIENCE_OPTIONS = ["Freshers / No formal tuition experience", "1 - 2 Years", "3 - 5 Years", "More than 5 Years"];

export default function TutorForm() {
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState(null);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [qualification, setQualification] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [experience, setExperience] = useState('');
  const [preferredAreas, setPreferredAreas] = useState('');
  
  // Files
  const [resume, setResume] = useState(null);
  const [idProof, setIdProof] = useState(null);
  
  const resumeRef = useRef();
  const idProofRef = useRef();

  const [errors, setErrors] = useState({});

  const handleSubjectCheckbox = (subject) => {
    if (subjects.includes(subject)) {
      setSubjects(subjects.filter(s => s !== subject));
    } else {
      setSubjects([...subjects, subject]);
    }
  };

  const validate = () => {
    const tempErrors = {};
    if (!fullName.trim()) tempErrors.fullName = "Full name is required";
    if (!mobileNumber.trim()) {
      tempErrors.mobileNumber = "Mobile number is required";
    } else if (!/^\d{10}$/.test(mobileNumber.trim())) {
      tempErrors.mobileNumber = "Must be a valid 10-digit number";
    }
    if (!qualification.trim()) tempErrors.qualification = "Qualification is required";
    if (subjects.length === 0) tempErrors.subjects = "Select at least one subject";
    if (!experience) tempErrors.experience = "Select teaching experience";
    if (!preferredAreas.trim()) tempErrors.preferredAreas = "Preferred tutoring locations are required";
    
    // File validation
    if (!resume) {
      tempErrors.resume = "Please upload your resume (PDF/DOC)";
    } else if (resume.size > 5 * 1024 * 1024) {
      tempErrors.resume = "File size must be under 5MB";
    }

    if (!idProof) {
      tempErrors.idProof = "Please upload your ID Proof (Aadhar/PAN/Voter)";
    } else if (idProof.size > 5 * 1024 * 1024) {
      tempErrors.idProof = "File size must be under 5MB";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('full_name', fullName);
    formData.append('mobile_number', mobileNumber);
    formData.append('qualification', qualification);
    formData.append('subjects', subjects.join(', '));
    formData.append('experience', experience);
    formData.append('preferred_areas', preferredAreas);
    formData.append('resume', resume);
    formData.append('id_proof', idProof);

    try {
      const response = await fetch('/api/api.php?action=register_tutor', {
        method: 'POST',
        body: formData, // Fetch automatically handles content-type for FormData
      });

      const data = await response.json();
      if (data.success) {
        setSuccessData(data);
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Could not connect to tutor registration portal. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="tutor-registration" className="py-20 bg-primary-50/20 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <span className="text-primary-400 font-heading font-extrabold text-sm uppercase tracking-widest block">Join Our Team</span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-charcoal">
            Become a Verified Home Tutor
          </h2>
          <div className="w-16 h-1 bg-primary-400 mx-auto rounded-full" />
          <p className="text-sm text-muted-grey font-light">
            Are you an experienced teacher or a talented college graduate? Register as a tutor, choose your timings/subjects, and earn locally in your city.
          </p>
        </div>

        {/* Form Box */}
        <div className="bg-white border border-primary-100 rounded-3xl p-6 sm:p-10 shadow-xl shadow-primary-100/5 text-left relative overflow-hidden">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl text-red-700 text-sm flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successData ? (
            <div className="text-center py-10 space-y-6">
              <div className="bg-emerald-100 text-emerald-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto shadow-md animate-bounce">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-charcoal">
                  Tutor Profile Registered!
                </h3>
                <p className="text-sm text-muted-grey font-light max-w-md mx-auto">
                  Thank you for applying. Our verification officer will review your qualification certificates, resume, and ID proof. We will coordinate a personal interview soon.
                </p>
              </div>

              {/* Unique ID Box */}
              <div className="bg-primary-50 border border-primary-200 p-6 rounded-2xl max-w-sm mx-auto space-y-1.5">
                <span className="text-[10px] text-primary-700 uppercase tracking-widest font-extrabold">Your Tutor ID</span>
                <div className="font-heading font-extrabold text-2xl text-charcoal tracking-wider">
                  {successData.tutor_id}
                </div>
                <p className="text-[10px] text-muted-grey">Your profile status is currently <strong>Pending</strong>.</p>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => {
                    setSuccessData(null);
                    setFullName('');
                    setMobileNumber('');
                    setQualification('');
                    setSubjects([]);
                    setExperience('');
                    setPreferredAreas('');
                    setResume(null);
                    setIdProof(null);
                  }}
                  className="bg-primary-400 hover:bg-primary-500 text-white font-heading font-semibold text-sm px-8 py-3.5 rounded-full transition shadow-md shadow-primary-400/10 cursor-pointer"
                >
                  Register Another Profile
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-charcoal flex items-center space-x-1.5">
                    <User className="h-4 w-4 text-primary-400" />
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Priyanshu Saxena"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`w-full bg-white border ${errors.fullName ? 'border-red-500' : 'border-primary-100'} focus:border-primary-400 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all`}
                  />
                  {errors.fullName && <p className="text-xs text-red-500 font-medium">{errors.fullName}</p>}
                </div>

                {/* Mobile */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-charcoal flex items-center space-x-1.5">
                    <Phone className="h-4 w-4 text-primary-400" />
                    <span>Mobile Number (WhatsApp Preferred) *</span>
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="10-digit number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                    className={`w-full bg-white border ${errors.mobileNumber ? 'border-red-500' : 'border-primary-100'} focus:border-primary-400 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all`}
                  />
                  {errors.mobileNumber && <p className="text-xs text-red-500 font-medium">{errors.mobileNumber}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Qualification */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-charcoal flex items-center space-x-1.5">
                    <GraduationCap className="h-4 w-4 text-primary-400" />
                    <span>Highest Qualification *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. M.Sc in Mathematics, B.Ed, B.Tech"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className={`w-full bg-white border ${errors.qualification ? 'border-red-500' : 'border-primary-100'} focus:border-primary-400 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all`}
                  />
                  {errors.qualification && <p className="text-xs text-red-500 font-medium">{errors.qualification}</p>}
                </div>

                {/* Experience */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-charcoal flex items-center space-x-1.5">
                    <Clock className="h-4 w-4 text-primary-400" />
                    <span>Tutoring Experience *</span>
                  </label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className={`w-full bg-white border ${errors.experience ? 'border-red-500' : 'border-primary-100'} focus:border-primary-400 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all`}
                  >
                    <option value="">-- Choose Experience --</option>
                    {EXPERIENCE_OPTIONS.map((exp, idx) => (
                      <option key={idx} value={exp}>{exp}</option>
                    ))}
                  </select>
                  {errors.experience && <p className="text-xs text-red-500 font-medium">{errors.experience}</p>}
                </div>
              </div>

              {/* Preferred Areas */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-charcoal flex items-center space-x-1.5">
                  <MapPin className="h-4 w-4 text-primary-400" />
                  <span>Preferred Teaching Locations / Local Areas *</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rajendra Nagar & Rampur Garden in Bareilly, or Saket in Meerut"
                  value={preferredAreas}
                  onChange={(e) => setPreferredAreas(e.target.value)}
                  className={`w-full bg-white border ${errors.preferredAreas ? 'border-red-500' : 'border-primary-100'} focus:border-primary-400 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all`}
                />
                {errors.preferredAreas && <p className="text-xs text-red-500 font-medium">{errors.preferredAreas}</p>}
              </div>

              {/* Subjects Checklist */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-charcoal flex items-center space-x-1.5">
                  <BookOpen className="h-4 w-4 text-primary-400" />
                  <span>Select Subjects You Can Teach *</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SUBJECTS.map((sub, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition ${
                        subjects.includes(sub)
                          ? 'bg-primary-50 border-primary-300 text-primary-700'
                          : 'bg-white border-primary-100 text-charcoal/80 hover:bg-primary-50/30'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={subjects.includes(sub)}
                        onChange={() => handleSubjectCheckbox(sub)}
                        className="rounded text-primary-400 focus:ring-primary-400 h-3.5 w-3.5"
                      />
                      <span>{sub}</span>
                    </label>
                  ))}
                </div>
                {errors.subjects && <p className="text-xs text-red-500 font-medium">{errors.subjects}</p>}
              </div>

              {/* File Uploads Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Resume Upload */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-charcoal flex items-center space-x-1.5">
                    <Upload className="h-4 w-4 text-primary-400" />
                    <span>Upload Resume (PDF/Word under 5MB) *</span>
                  </label>
                  <div 
                    onClick={() => resumeRef.current.click()}
                    className={`border-2 border-dashed ${errors.resume ? 'border-red-400 bg-red-50/20' : 'border-primary-200 bg-cream/20 hover:border-primary-400'} rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2`}
                  >
                    <input
                      type="file"
                      ref={resumeRef}
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setResume(e.target.files[0])}
                    />
                    {resume ? (
                      <>
                        <FileText className="h-8 w-8 text-primary-400" />
                        <span className="text-xs font-medium text-charcoal/90 truncate max-w-[200px]">{resume.name}</span>
                        <span className="text-[10px] text-muted-grey">{(resume.size / (1024 * 1024)).toFixed(2)} MB</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-primary-300" />
                        <span className="text-xs font-medium text-primary-400">Click to Select Resume</span>
                        <span className="text-[10px] text-muted-grey">PDF, DOC, or DOCX formats</span>
                      </>
                    )}
                  </div>
                  {errors.resume && <p className="text-xs text-red-500 font-medium">{errors.resume}</p>}
                </div>

                {/* ID Proof Upload */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-charcoal flex items-center space-x-1.5">
                    <Upload className="h-4 w-4 text-primary-400" />
                    <span>Upload ID Proof (Aadhar/PAN/Voter under 5MB) *</span>
                  </label>
                  <div 
                    onClick={() => idProofRef.current.click()}
                    className={`border-2 border-dashed ${errors.idProof ? 'border-red-400 bg-red-50/20' : 'border-primary-200 bg-cream/20 hover:border-primary-400'} rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-2`}
                  >
                    <input
                      type="file"
                      ref={idProofRef}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setIdProof(e.target.files[0])}
                    />
                    {idProof ? (
                      <>
                        <FileText className="h-8 w-8 text-primary-400" />
                        <span className="text-xs font-medium text-charcoal/90 truncate max-w-[200px]">{idProof.name}</span>
                        <span className="text-[10px] text-muted-grey">{(idProof.size / (1024 * 1024)).toFixed(2)} MB</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-primary-300" />
                        <span className="text-xs font-medium text-primary-400">Click to Select ID Proof</span>
                        <span className="text-[10px] text-muted-grey">PDF, PNG, JPG, or JPEG</span>
                      </>
                    )}
                  </div>
                  {errors.idProof && <p className="text-xs text-red-500 font-medium">{errors.idProof}</p>}
                </div>

              </div>

              {/* Submit Button */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-primary-400 hover:bg-primary-500 text-white font-heading font-semibold px-8 py-3.5 rounded-full transition flex items-center justify-center space-x-2 shadow-md shadow-primary-400/10 disabled:opacity-50 cursor-pointer animate-pulse-soft hover:animate-none"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Uploading Details...</span>
                    </>
                  ) : (
                    <span>Submit Tutor Profile</span>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </section>
  );
}
