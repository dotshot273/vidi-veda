import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { useCRM } from "../../context/CRMContext";
import { Demo, ParentFeedback, TeacherFeedback, FinalResult } from "../../types/crm";
import { CheckCircle2, MessageSquare, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";

interface DemoFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  demo: Demo;
}

const PARENT_FEEDBACK_OPTIONS: ParentFeedback[] = [
  "Very Satisfied",
  "Satisfied",
  "Average",
  "Not Satisfied",
  "Needs Discussion",
];

const TEACHER_FEEDBACK_OPTIONS: TeacherFeedback[] = [
  "Good",
  "Average",
  "Difficult",
  "Student Needs Support",
  "Other",
];

const FINAL_RESULT_OPTIONS: FinalResult[] = [
  "Confirmed",
  "Decision Pending",
  "Not Interested",
  "Wants Another Teacher",
  "Wants More Discussion",
];

export const DemoFeedbackModal: React.FC<DemoFeedbackModalProps> = ({
  isOpen,
  onClose,
  demo,
}) => {
  const { submitDemoFeedback } = useCRM();

  const [parentFeedback, setParentFeedback] = useState<ParentFeedback>(
    demo.parentFeedback || "Very Satisfied"
  );
  const [teacherFeedback, setTeacherFeedback] = useState<TeacherFeedback>(
    demo.teacherFeedback || "Good"
  );
  const [finalResult, setFinalResult] = useState<FinalResult>(
    demo.finalResult || "Confirmed"
  );
  const [remarks, setRemarks] = useState(demo.remarks || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    submitDemoFeedback(demo.id, {
      parentFeedback,
      teacherFeedback,
      finalResult,
      remarks,
    });

    if (finalResult === "Confirmed") {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record 3-Day Demo Feedback & Result"
      subtitle={`Student: ${demo.studentName} | Tutor: ${demo.teacherName}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Parent Feedback */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
            Parent Feedback *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PARENT_FEEDBACK_OPTIONS.map((opt) => (
              <button
                type="button"
                key={opt}
                onClick={() => setParentFeedback(opt)}
                className={`text-xs py-2 px-3 rounded-lg border font-medium text-left transition-all ${
                  parentFeedback === opt
                    ? "bg-blue-50 border-blue-500 text-blue-700 font-semibold shadow-2xs"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Teacher Feedback */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
            Teacher Feedback *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {TEACHER_FEEDBACK_OPTIONS.map((opt) => (
              <button
                type="button"
                key={opt}
                onClick={() => setTeacherFeedback(opt)}
                className={`text-xs py-2 px-3 rounded-lg border font-medium text-left transition-all ${
                  teacherFeedback === opt
                    ? "bg-purple-50 border-purple-500 text-purple-700 font-semibold shadow-2xs"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Final Result */}
        <div className="pt-2">
          <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Final Tuition Decision *
          </label>
          <div className="space-y-1.5">
            {FINAL_RESULT_OPTIONS.map((res) => (
              <label
                key={res}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  finalResult === res
                    ? res === "Confirmed"
                      ? "bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold shadow-2xs"
                      : "bg-blue-50 border-blue-500 text-blue-900 font-semibold shadow-2xs"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name="finalResult"
                  checked={finalResult === res}
                  onChange={() => setFinalResult(res)}
                  className="w-3.5 h-3.5 text-blue-600"
                />
                <span className="flex-1">{res}</span>
                {res === "Confirmed" && (
                  <span className="text-[10px] bg-emerald-200/80 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                    Auto ₹500 Reg & 50% Comm
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>

        {finalResult === "Confirmed" && (
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Automatic Action Trigger:</span>
              Marking as Confirmed will instantly generate:
              <ul className="list-disc ml-4 mt-1 space-y-0.5 text-emerald-700">
                <li>Parent ₹500 one-time registration fee due</li>
                <li>Teacher 50% first-month commission tracking</li>
                <li>Active tuition record with progress tracking</li>
              </ul>
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Discussion Remarks / Notes
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Parent confirmed. Classes start from Monday. Timing 5 PM fixed."
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
            <CheckCircle2 className="w-4 h-4" />
            Save Feedback & Update Lead
          </button>
        </div>
      </form>
    </Modal>
  );
};
