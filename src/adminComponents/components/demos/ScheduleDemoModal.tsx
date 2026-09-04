import React, { useState, useEffect } from "react";
import { Modal } from "../common/Modal";
import { useCRM } from "../../context/CRMContext";
import { getTodayString, addDays, formatDisplayDate } from "../../utils/dateUtils";
import { Calendar, Clock, UserCheck, AlertCircle } from "lucide-react";

interface ScheduleDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedLeadId?: string;
  preselectedTeacherId?: string;
}

export const ScheduleDemoModal: React.FC<ScheduleDemoModalProps> = ({
  isOpen,
  onClose,
  preselectedLeadId,
  preselectedTeacherId,
}) => {
  const { leads, teachers, scheduleDemo } = useCRM();

  const [leadId, setLeadId] = useState(preselectedLeadId || "");
  const [teacherId, setTeacherId] = useState(preselectedTeacherId || "");
  const [startDate, setStartDate] = useState(getTodayString());
  const [timing, setTiming] = useState("5:00 PM - 6:30 PM");
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (preselectedLeadId) setLeadId(preselectedLeadId);
    if (preselectedTeacherId) setTeacherId(preselectedTeacherId);
  }, [preselectedLeadId, preselectedTeacherId]);

  // When lead is selected, auto-suggest timing from lead preference
  useEffect(() => {
    if (leadId) {
      const selectedLead = leads.find((l) => l.id === leadId);
      if (selectedLead) {
        if (selectedLead.preferredTiming) setTiming(selectedLead.preferredTiming);
        if (selectedLead.assignedTeacherId && !teacherId) {
          setTeacherId(selectedLead.assignedTeacherId);
        }
      }
    }
  }, [leadId, leads]);

  // Auto-calculated 3-day demo dates
  const day1Date = startDate;
  const day2Date = addDays(startDate, 1);
  const day3Date = addDays(startDate, 2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadId) {
      setError("Please select a Lead/Student");
      return;
    }
    if (!teacherId) {
      setError("Please select a Teacher");
      return;
    }

    try {
      await scheduleDemo({
        leadId,
        teacherId,
        startDate,
        timing,
        remarks,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to schedule demo");
    }
  };

  const selectedLead = leads.find((l) => l.id === leadId);
  const selectedTeacher = teachers.find((t) => t.id === teacherId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule 3-Day Free Demo Class"
      subtitle="The system automatically calculates the 3-day window and schedules parent confirmation."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Lead selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Select Student / Lead *
          </label>
          <select
            value={leadId}
            onChange={(e) => setLeadId(e.target.value)}
            required
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">-- Choose Lead --</option>
            {leads.map((l) => (
              <option key={l.id} value={l.id}>
                {l.id} - {l.studentName} ({l.studentClass}, {l.subjectRequired}) — {l.location}
              </option>
            ))}
          </select>
          {selectedLead && (
            <p className="text-xs text-slate-500 mt-1">
              Parent: {selectedLead.parentName} ({selectedLead.parentContact}) | Fee: ₹
              {selectedLead.expectedMonthlyFee}/mo
            </p>
          )}
        </div>

        {/* Teacher selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Assign Tutor for Demo *
          </label>
          <select
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            required
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">-- Choose Teacher --</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.gender}, {t.qualification}) - Status: {t.status}
              </option>
            ))}
          </select>
          {selectedTeacher && (
            <p className="text-xs text-slate-500 mt-1">
              Subjects: {selectedTeacher.subjects.join(", ")} | Areas:{" "}
              {selectedTeacher.areasCovered.join(", ")}
            </p>
          )}
        </div>

        {/* Start Date & Timing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Demo Start Date (Day 1) *
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Class Timing *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. 5:00 PM - 6:30 PM"
                value={timing}
                onChange={(e) => setTiming(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
              />
              <Clock className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            </div>
          </div>
        </div>

        {/* 3-Day Demo Breakdown Display */}
        <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 mb-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>Automatic 3-Day Demo Schedule</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 bg-white rounded-lg border border-blue-200 shadow-2xs">
              <span className="block font-bold text-blue-800">Demo Day 1</span>
              <span className="text-slate-600 font-medium">{formatDisplayDate(day1Date)}</span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-blue-200 shadow-2xs">
              <span className="block font-bold text-blue-800">Demo Day 2</span>
              <span className="text-slate-600 font-medium">{formatDisplayDate(day2Date)}</span>
            </div>
            <div className="p-2 bg-white rounded-lg border border-blue-200 shadow-2xs">
              <span className="block font-bold text-blue-800">Demo Day 3</span>
              <span className="text-slate-600 font-medium">{formatDisplayDate(day3Date)}</span>
            </div>
          </div>
          <p className="text-xs text-blue-700 mt-2 font-medium">
            Demo End Date: {formatDisplayDate(day3Date)}. Upon Day 3 completion, a parent follow-up
            task will be auto-generated.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Demo Instructions / Remarks
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Focus on Class 10 trigonometry concepts in the first demo."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

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
            <UserCheck className="w-4 h-4" />
            Confirm & Schedule Demo
          </button>
        </div>
      </form>
    </Modal>
  );
};
