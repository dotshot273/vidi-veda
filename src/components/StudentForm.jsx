import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, MapPin, Plus, Trash2, CheckCircle2, ChevronRight, ChevronLeft, Calendar, BookOpen, Loader2 } from 'lucide-react';

const CITIES = ["Bareilly", "Meerut", "Lucknow", "Kanpur", "Jaipur", "Indore", "Patna", "Ranchi", "Dehradun", "Other"];
const CLASSES = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);
const BOARDS = ["CBSE", "ICSE", "State Board", "Other"];
const SUBJECTS = ["All Subjects", "Mathematics", "Science (Physics/Chem/Bio)", "Physics", "Chemistry", "Biology", "English Literature & Grammar", "Social Science", "Computer Science / Applications", "Commerce (Accounts/Economics)"];
const TIMINGS = ["Morning (8:00 AM - 12:00 PM)", "Afternoon (12:00 PM - 4:00 PM)", "Evening (4:00 PM - 8:00 PM)", "Flexible / Any Time"];
const TUITION_TYPES = ["Home Tuition (Tutor visits home)", "Online Tuition (1-on-1 Interactive)", "Group Tuition (3-5 students batch)"];

export default function StudentForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState(null);

  // Form State
  const [parentName, setParentName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [useSameNumber, setUseSameNumber] = useState(false);

  // Children State
  const [children, setChildren] = useState([
    {
      studentName: '',
      studentClass: '',
      board: '',
      subjects: [],
      tuitionType: '',
      preferredTiming: ''
    }
  ]);

  // Validation errors
  const [validationErrors, setValidationErrors] = useState({});

  const handleCopyMobile = (checked) => {
    setUseSameNumber(checked);
    if (checked) {
      setWhatsappNumber(mobileNumber);
    } else {
      setWhatsappNumber('');
    }
  };

  const handleAddChild = () => {
    setChildren([
      ...children,
      {
        studentName: '',
        studentClass: '',
        board: '',
        subjects: [],
        tuitionType: '',
        preferredTiming: ''
      }
    ]);
  };

  const handleRemoveChild = (index) => {
    if (children.length > 1) {
      setChildren(children.filter((_, idx) => idx !== index));
    }
  };

  const handleChildFieldChange = (index, field, value) => {
    const updated = [...children];
    updated[index][field] = value;
    setChildren(updated);
  };

  const handleSubjectCheckbox = (childIdx, subject) => {
    const updated = [...children];
    const currentSubjects = updated[childIdx].subjects;
    
    if (subject === "All Subjects") {
      updated[childIdx].subjects = ["All Subjects"];
    } else {
      let nextSubjects = currentSubjects.filter(s => s !== "All Subjects");
      if (nextSubjects.includes(subject)) {
        nextSubjects = nextSubjects.filter(s => s !== subject);
      } else {
        nextSubjects.push(subject);
      }
      updated[childIdx].subjects = nextSubjects;
    }
    setChildren(updated);
  };

  const validateStep1 = () => {
    const errors = {};
    if (!parentName.trim()) errors.parentName = "Parent name is required";
    if (!mobileNumber.trim()) {
      errors.mobileNumber = "Mobile number is required";
    } else if (!/^\d{10}$/.test(mobileNumber.trim())) {
      errors.mobileNumber = "Please enter a valid 10-digit number";
    }
    if (!whatsappNumber.trim()) {
      errors.whatsappNumber = "WhatsApp number is required";
    } else if (!/^\d{10}$/.test(whatsappNumber.trim())) {
      errors.whatsappNumber = "Please enter a valid 10-digit number";
    }
    if (!address.trim()) errors.address = "Address is required";
    if (!city) {
      errors.city = "Please select a city";
    } else if (city === "Other" && !customCity.trim()) {
      errors.customCity = "Please type your city name";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    const errors = {};
    children.forEach((child, index) => {
      if (!child.studentName.trim()) errors[`child_${index}_name`] = "Child's name is required";
      if (!child.studentClass) errors[`child_${index}_class`] = "Please select a class";
      if (!child.board) errors[`child_${index}_board`] = "Please select an educational board";
      if (child.subjects.length === 0) errors[`child_${index}_subjects`] = "Please select at least one subject";
      if (!child.tuitionType) errors[`child_${index}_type`] = "Please select a tuition type";
      if (!child.preferredTiming) errors[`child_${index}_timing`] = "Please select a timing preference";
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handlePrev = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);
    setError(null);

    const body = new URLSearchParams();
    body.set('parent_name', parentName);
    body.set('mobile_number', mobileNumber);
    body.set('whatsapp_number', whatsappNumber);
    body.set('address', address);
    body.set('city', city === "Other" ? customCity : city);
    children.forEach((c, i) => {
      body.set(`children[${i}][student_name]`, c.studentName);
      body.set(`children[${i}][student_class]`, c.studentClass);
      body.set(`children[${i}][board]`, c.board);
      body.set(`children[${i}][subjects]`, c.subjects.join(', '));
      body.set(`children[${i}][tuition_type]`, c.tuitionType);
      body.set(`children[${i}][preferred_timing]`, c.preferredTiming);
    });

    try {
      const response = await fetch('/api/api.php?action=register_student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: body.toString(),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        setError('Registration server returned an unexpected response. Please try again.');
        return;
      }
      if (data.success) {
        setSuccessData(data);
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Could not connect to the registration server. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="student-registration" className="py-20 bg-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <span className="text-primary-400 font-heading font-extrabold text-sm uppercase tracking-widest block">Book Demo Session</span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-charcoal">
            Register Your Child for Home Tuition
          </h2>
          <div className="w-16 h-1 bg-primary-400 mx-auto rounded-full" />
          <p className="text-sm text-muted-grey font-light">
            Fill this multi-step form to register one or more children. We will match you with a trusted teacher and schedule a free trial class.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-cream/30 border border-primary-100 rounded-3xl p-6 sm:p-10 shadow-xl shadow-primary-100/5 relative overflow-hidden">
          
          {/* Progress bar */}
          {!successData && (
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-primary-100/50">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-heading font-bold text-sm ${step === 1 ? 'bg-primary-400 text-white shadow-md' : 'bg-primary-100 text-primary-600'}`}>
                  1
                </div>
                <span className={`text-sm font-semibold ${step === 1 ? 'text-charcoal' : 'text-muted-grey'}`}>Parent Details</span>
              </div>
              
              <div className="flex-1 h-0.5 bg-primary-100 mx-4" />

              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-heading font-bold text-sm ${step === 2 ? 'bg-primary-400 text-white shadow-md' : 'bg-primary-100 text-primary-600'}`}>
                  2
                </div>
                <span className={`text-sm font-semibold ${step === 2 ? 'text-charcoal' : 'text-muted-grey'}`}>Child Information</span>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {successData ? (
              // Success Screen
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 space-y-6"
              >
                <div className="bg-emerald-100 text-emerald-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-charcoal">
                    Registration Successful!
                  </h3>
                  <p className="text-sm text-muted-grey font-light max-w-md mx-auto">
                    Your details have been saved securely. Our educational coordinator will review your requirements and reach out to you within 2 hours.
                  </p>
                </div>

                {/* Unique ID Badge */}
                <div className="bg-primary-100/50 border border-primary-200 p-6 rounded-2xl max-w-sm mx-auto space-y-1.5">
                  <span className="text-[10px] text-primary-700 uppercase tracking-widest font-extrabold">Your Student ID</span>
                  <div className="font-heading font-extrabold text-2xl text-charcoal tracking-wider">
                    {successData.student_id}
                  </div>
                  <p className="text-[10px] text-muted-grey">Please save this ID for future reference.</p>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={() => {
                      setSuccessData(null);
                      setStep(1);
                      setParentName('');
                      setMobileNumber('');
                      setWhatsappNumber('');
                      setAddress('');
                      setCity('');
                      setChildren([{ studentName: '', studentClass: '', board: '', subjects: [], tuitionType: '', preferredTiming: '' }]);
                    }}
                    className="bg-primary-400 hover:bg-primary-500 text-white font-heading font-semibold text-sm px-6 py-3 rounded-full transition shadow-md shadow-primary-400/10 cursor-pointer"
                  >
                    Register Another Child
                  </button>
                  <a
                    href="tel:6398889697"
                    className="bg-white border border-primary-200 text-charcoal font-heading font-semibold text-sm px-6 py-3 rounded-full transition flex items-center justify-center space-x-2"
                  >
                    <span>Call Helpline</span>
                  </a>
                </div>
              </motion.div>
            ) : step === 1 ? (
              // Step 1: Parent Details
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 text-left"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Parent Name */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-charcoal flex items-center space-x-1.5">
                      <User className="h-4 w-4 text-primary-400" />
                      <span>Parent Name <span className="text-red-500">*</span></span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rakesh Sharma"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      className={`w-full bg-white border ${validationErrors.parentName ? 'border-red-500' : 'border-primary-100'} focus:border-primary-400 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all`}
                    />
                    {validationErrors.parentName && (
                      <p className="text-xs text-red-500 font-medium">{validationErrors.parentName}</p>
                    )}
                  </div>

                  {/* City Select */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-charcoal flex items-center space-x-1.5">
                      <MapPin className="h-4 w-4 text-primary-400" />
                      <span>City <span className="text-red-500">*</span></span>
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className={`w-full bg-white border ${validationErrors.city ? 'border-red-500' : 'border-primary-100'} focus:border-primary-400 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all`}
                    >
                      <option value="">-- Select Your City --</option>
                      {CITIES.map((c, i) => (
                        <option key={i} value={c}>{c}</option>
                      ))}
                    </select>
                    {validationErrors.city && (
                      <p className="text-xs text-red-500 font-medium">{validationErrors.city}</p>
                    )}
                  </div>
                </div>

                {/* Custom City input */}
                {city === "Other" && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="space-y-1.5"
                  >
                    <label className="text-sm font-semibold text-charcoal">Type City Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder="e.g. Noida, Delhi"
                      value={customCity}
                      onChange={(e) => setCustomCity(e.target.value)}
                      className="w-full bg-white border border-primary-100 focus:border-primary-400 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all"
                    />
                    {validationErrors.customCity && (
                      <p className="text-xs text-red-500 font-medium">{validationErrors.customCity}</p>
                    )}
                  </motion.div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Mobile Number */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-charcoal flex items-center space-x-1.5">
                      <Phone className="h-4 w-4 text-primary-400" />
                      <span>Mobile Number <span className="text-red-500">*</span></span>
                    </label>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="10-digit number"
                      value={mobileNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setMobileNumber(val);
                        if (useSameNumber) setWhatsappNumber(val);
                      }}
                      className={`w-full bg-white border ${validationErrors.mobileNumber ? 'border-red-500' : 'border-primary-100'} focus:border-primary-400 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all`}
                    />
                    {validationErrors.mobileNumber && (
                      <p className="text-xs text-red-500 font-medium">{validationErrors.mobileNumber}</p>
                    )}
                  </div>

                  {/* WhatsApp Number */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-semibold text-charcoal flex items-center space-x-1.5">
                        <Phone className="h-4 w-4 text-emerald-500" />
                        <span>WhatsApp Number <span className="text-red-500">*</span></span>
                      </label>
                      <label className="text-[11px] text-primary-400 font-semibold flex items-center space-x-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={useSameNumber}
                          onChange={(e) => handleCopyMobile(e.target.checked)}
                          className="rounded text-primary-400 focus:ring-primary-400 h-3 w-3"
                        />
                        <span>Same as Mobile</span>
                      </label>
                    </div>
                    <input
                      type="tel"
                      maxLength={10}
                      disabled={useSameNumber}
                      placeholder="10-digit number"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, ''))}
                      className={`w-full bg-white border ${validationErrors.whatsappNumber ? 'border-red-500' : 'border-primary-100'} disabled:bg-primary-50/50 focus:border-primary-400 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all`}
                    />
                    {validationErrors.whatsappNumber && (
                      <p className="text-xs text-red-500 font-medium">{validationErrors.whatsappNumber}</p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-charcoal flex items-center space-x-1.5">
                    <MapPin className="h-4 w-4 text-primary-400" />
                    <span>Tuition Address / Local Area <span className="text-red-500">*</span></span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. House No 42, Rampur Garden, Near Post Office"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={`w-full bg-white border ${validationErrors.address ? 'border-red-500' : 'border-primary-100'} focus:border-primary-400 focus:outline-none rounded-xl px-4 py-3 text-sm transition-all`}
                  />
                  {validationErrors.address && (
                    <p className="text-xs text-red-500 font-medium">{validationErrors.address}</p>
                  )}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-primary-400 hover:bg-primary-500 text-white font-heading font-semibold px-6 py-3 rounded-full transition flex items-center space-x-1.5 shadow-md shadow-primary-400/10 cursor-pointer"
                  >
                    <span>Next: Add Children</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              // Step 2: Children details
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-8 text-left"
              >
                {children.map((child, index) => (
                  <div key={index} className="bg-white p-6 rounded-2xl border border-primary-100/50 shadow-md relative space-y-6">
                    {/* Block Title & Delete */}
                    <div className="flex justify-between items-center border-b border-primary-50 pb-3">
                      <h4 className="font-heading font-bold text-base text-charcoal">
                        Child #{index + 1} Details
                      </h4>
                      {children.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveChild(index)}
                          className="text-red-400 hover:text-red-600 transition flex items-center space-x-1 text-xs font-semibold cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Student Name */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-charcoal">Child Name *</label>
                        <input
                          type="text"
                          placeholder="e.g. Rahul Sharma"
                          value={child.studentName}
                          onChange={(e) => handleChildFieldChange(index, 'studentName', e.target.value)}
                          className={`w-full bg-white border ${validationErrors[`child_${index}_name`] ? 'border-red-500' : 'border-primary-100'} focus:border-primary-400 focus:outline-none rounded-xl px-3.5 py-2.5 text-xs`}
                        />
                        {validationErrors[`child_${index}_name`] && (
                          <p className="text-[10px] text-red-500 font-medium">{validationErrors[`child_${index}_name`]}</p>
                        )}
                      </div>

                      {/* Class */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-charcoal">Class *</label>
                        <select
                          value={child.studentClass}
                          onChange={(e) => handleChildFieldChange(index, 'studentClass', e.target.value)}
                          className={`w-full bg-white border ${validationErrors[`child_${index}_class`] ? 'border-red-500' : 'border-primary-100'} focus:border-primary-400 focus:outline-none rounded-xl px-3.5 py-2.5 text-xs`}
                        >
                          <option value="">-- Select Class --</option>
                          {CLASSES.map((c, i) => (
                            <option key={i} value={c}>{c}</option>
                          ))}
                        </select>
                        {validationErrors[`child_${index}_class`] && (
                          <p className="text-[10px] text-red-500 font-medium">{validationErrors[`child_${index}_class`]}</p>
                        )}
                      </div>

                      {/* Board */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-charcoal">Educational Board *</label>
                        <select
                          value={child.board}
                          onChange={(e) => handleChildFieldChange(index, 'board', e.target.value)}
                          className={`w-full bg-white border ${validationErrors[`child_${index}_board`] ? 'border-red-500' : 'border-primary-100'} focus:border-primary-400 focus:outline-none rounded-xl px-3.5 py-2.5 text-xs`}
                        >
                          <option value="">-- Select Board --</option>
                          {BOARDS.map((b, i) => (
                            <option key={i} value={b}>{b}</option>
                          ))}
                        </select>
                        {validationErrors[`child_${index}_board`] && (
                          <p className="text-[10px] text-red-500 font-medium">{validationErrors[`child_${index}_board`]}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Tuition Type */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-charcoal flex items-center space-x-1">
                          <BookOpen className="h-4 w-4 text-primary-400" />
                          <span>Preferred Tuition Type *</span>
                        </label>
                        <select
                          value={child.tuitionType}
                          onChange={(e) => handleChildFieldChange(index, 'tuitionType', e.target.value)}
                          className={`w-full bg-white border ${validationErrors[`child_${index}_type`] ? 'border-red-500' : 'border-primary-100'} focus:border-primary-400 focus:outline-none rounded-xl px-3.5 py-2.5 text-xs`}
                        >
                          <option value="">-- Choose Format --</option>
                          {TUITION_TYPES.map((t, i) => (
                            <option key={i} value={t}>{t}</option>
                          ))}
                        </select>
                        {validationErrors[`child_${index}_type`] && (
                          <p className="text-[10px] text-red-500 font-medium">{validationErrors[`child_${index}_type`]}</p>
                        )}
                      </div>

                      {/* Timing */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-charcoal flex items-center space-x-1">
                          <Calendar className="h-4 w-4 text-primary-400" />
                          <span>Preferred Class Timing *</span>
                        </label>
                        <select
                          value={child.preferredTiming}
                          onChange={(e) => handleChildFieldChange(index, 'preferredTiming', e.target.value)}
                          className={`w-full bg-white border ${validationErrors[`child_${index}_timing`] ? 'border-red-500' : 'border-primary-100'} focus:border-primary-400 focus:outline-none rounded-xl px-3.5 py-2.5 text-xs`}
                        >
                          <option value="">-- Choose Preferred Time --</option>
                          {TIMINGS.map((t, i) => (
                            <option key={i} value={t}>{t}</option>
                          ))}
                        </select>
                        {validationErrors[`child_${index}_timing`] && (
                          <p className="text-[10px] text-red-500 font-medium">{validationErrors[`child_${index}_timing`]}</p>
                        )}
                      </div>
                    </div>

                    {/* Subjects Checkbox */}
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-charcoal">Select Subjects *</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {SUBJECTS.map((sub, idx) => (
                          <label
                            key={idx}
                            className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition ${
                              child.subjects.includes(sub)
                                ? 'bg-primary-50 border-primary-300 text-primary-700'
                                : 'bg-white border-primary-100 text-charcoal/80 hover:bg-primary-50/30'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={child.subjects.includes(sub)}
                              onChange={() => handleSubjectCheckbox(index, sub)}
                              className="rounded text-primary-400 focus:ring-primary-400 h-3.5 w-3.5"
                            />
                            <span>{sub}</span>
                          </label>
                        ))}
                      </div>
                      {validationErrors[`child_${index}_subjects`] && (
                        <p className="text-[10px] text-red-500 font-medium">{validationErrors[`child_${index}_subjects`]}</p>
                      )}
                    </div>

                  </div>
                ))}

                {/* Add Child button */}
                <button
                  type="button"
                  onClick={handleAddChild}
                  className="w-full border-2 border-dashed border-primary-300 hover:border-primary-400 text-primary-400 hover:text-primary-500 hover:bg-primary-50/20 py-3.5 rounded-2xl flex items-center justify-center space-x-2 text-sm font-semibold transition cursor-pointer"
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Another Child</span>
                </button>

                {/* Controls */}
                <div className="pt-4 flex justify-between border-t border-primary-100">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="border border-primary-200 hover:bg-primary-50/50 text-charcoal font-heading font-semibold px-6 py-3 rounded-full transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Back</span>
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-primary-400 hover:bg-primary-500 text-white font-heading font-semibold px-8 py-3.5 rounded-full transition flex items-center space-x-2 shadow-md shadow-primary-400/10 disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Submit Application</span>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
