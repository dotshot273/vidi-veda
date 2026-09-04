import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { useCRM } from "../../context/CRMContext";
import { LeadSource } from "../../types/crm";
import { getTodayString } from "../../utils/dateUtils";
import { Sparkles, UserPlus } from "lucide-react";
import confetti from "canvas-confetti";

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadCreated?: (leadId: string) => void;
  onCreated?: (lead: any) => void;
}

const COMMON_CLASSES = [
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
];

const LEAD_SOURCES: LeadSource[] = [
  "WhatsApp",
  "Google",
  "Facebook",
  "Instagram",
  "Referral",
  "Existing Parent",
  "Walk-in",
  "Other",
];

export const NewLeadModal: React.FC<NewLeadModalProps> = ({
  isOpen,
  onClose,
  onLeadCreated,
  onCreated,
}) => {
  const { addLead } = useCRM();

  const [formData, setFormData] = useState({
    enquiryDate: getTodayString(),
    parentName: "",
    parentContact: "",
    studentName: "",
    studentClass: "Class 10",
    school: "",
    location: "",
    subjectRequired: "",
    preferredTiming: "5:00 PM - 7:00 PM",
    preferredDays: "5 days a week (Mon-Fri)",
    teacherPreference: "",
    expectedMonthlyFee: 4000,
    leadSource: "WhatsApp" as LeadSource,
    remarks: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const err: Record<string, string> = {};
    if (!formData.parentName.trim()) err.parentName = "Parent Name is required";
    if (!formData.parentContact.trim()) {
      err.parentContact = "Parent Contact Number is required";
    } else if (formData.parentContact.replace(/\D/g, "").length < 10) {
      err.parentContact = "Please enter a valid 10-digit phone number";
    }
    if (!formData.studentName.trim()) err.studentName = "Student Name is required";
    if (!formData.location.trim()) err.location = "Location is required";
    if (!formData.subjectRequired.trim()) err.subjectRequired = "Subject is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const formattedContact = formData.parentContact.startsWith("+91")
      ? formData.parentContact
      : `+91 ${formData.parentContact.replace(/\D/g, "").slice(-10)}`;

    try {
      const newLead = await addLead({
        ...formData,
        parentContact: formattedContact,
        status: "New Lead",
      });

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {}

      onClose();
      if (onLeadCreated && newLead?.id) {
        onLeadCreated(newLead.id);
      }
      if (onCreated && newLead) {
        onCreated(newLead);
      }
    } catch (err: any) {
      setErrors({ parentName: err.message || "Could not save lead" });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New Tuition Lead Enquiry"
      subtitle="Enter details quickly while talking to the parent. Lead ID & follow-up task are auto-generated."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Parent Details */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
            Parent Details
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Parent Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rajesh Malhotra"
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                className={`w-full text-sm px-3 py-2 rounded-lg border ${
                  errors.parentName ? "border-rose-400 bg-rose-50" : "border-slate-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white`}
              />
              {errors.parentName && (
                <p className="text-xs text-rose-600 mt-0.5">{errors.parentName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Parent Contact Number *
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 9811122334"
                value={formData.parentContact}
                onChange={(e) => setFormData({ ...formData, parentContact: e.target.value })}
                className={`w-full text-sm px-3 py-2 rounded-lg border ${
                  errors.parentContact ? "border-rose-400 bg-rose-50" : "border-slate-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white`}
              />
              {errors.parentContact && (
                <p className="text-xs text-rose-600 mt-0.5">{errors.parentContact}</p>
              )}
            </div>
          </div>
        </div>

        {/* Student & Academic Info */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
            Student & Requirements
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Aarav Malhotra"
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
              {errors.studentName && (
                <p className="text-xs text-rose-600 mt-0.5">{errors.studentName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Student Class *
              </label>
              <select
                value={formData.studentClass}
                onChange={(e) => setFormData({ ...formData, studentClass: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {COMMON_CLASSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                School Name
              </label>
              <input
                type="text"
                placeholder="e.g. Delhi Public School"
                value={formData.school}
                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Location / Area *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Civil Lines, Moradabad"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
              {errors.location && (
                <p className="text-xs text-rose-600 mt-0.5">{errors.location}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subject Required *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mathematics & Science"
                value={formData.subjectRequired}
                onChange={(e) => setFormData({ ...formData, subjectRequired: e.target.value })}
                className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
              {errors.subjectRequired && (
                <p className="text-xs text-rose-600 mt-0.5">{errors.subjectRequired}</p>
              )}
            </div>
          </div>
        </div>

        {/* Preferences & Fee */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Preferred Timing
            </label>
            <input
              type="text"
              placeholder="e.g. 5:00 PM - 7:00 PM"
              value={formData.preferredTiming}
              onChange={(e) => setFormData({ ...formData, preferredTiming: e.target.value })}
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Preferred Days
            </label>
            <input
              type="text"
              placeholder="e.g. Mon-Fri or Alternate"
              value={formData.preferredDays}
              onChange={(e) => setFormData({ ...formData, preferredDays: e.target.value })}
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Expected Monthly Fee (₹)
            </label>
            <input
              type="number"
              min={500}
              step={100}
              value={formData.expectedMonthlyFee}
              onChange={(e) =>
                setFormData({ ...formData, expectedMonthlyFee: Number(e.target.value) })
              }
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Teacher Preference
            </label>
            <input
              type="text"
              placeholder="e.g. Female teacher preferred, experienced"
              value={formData.teacherPreference}
              onChange={(e) => setFormData({ ...formData, teacherPreference: e.target.value })}
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Lead Source
            </label>
            <select
              value={formData.leadSource}
              onChange={(e) =>
                setFormData({ ...formData, leadSource: e.target.value as LeadSource })
              }
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {LEAD_SOURCES.map((src) => (
                <option key={src} value={src}>
                  {src}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Enquiry Remarks / Notes
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Parent wants demo class this Saturday. Board exam focus."
            value={formData.remarks}
            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        {/* Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Save & Add Lead
          </button>
        </div>
      </form>
    </Modal>
  );
};
