import React, { useState } from "react";
import { useCRM } from "../../context/CRMContext";
import { Demo, DemoDayStatus, Teacher } from "../../types/crm";
import { Badge } from "../common/Badge";
import { formatDisplayDate, isToday, addDays } from "../../utils/dateUtils";
import {
  Calendar,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  MessageCircle,
  Plus,
  Phone,
  Search,
} from "lucide-react";
import { DemoFeedbackModal } from "./DemoFeedbackModal";
import { ScheduleDemoModal } from "./ScheduleDemoModal";

interface DemoListProps {
  onOpenWhatsApp: (phone: string, name: string, context?: any) => void;
  onSelectTeacherProfile?: (teacher: Teacher) => void;
}

export const DemoList: React.FC<DemoListProps> = ({ onOpenWhatsApp, onSelectTeacherProfile }) => {
  const { demos, updateDemoDayStatus, leads, teachers } = useCRM();

  const [activeFeedbackDemo, setActiveFeedbackDemo] = useState<Demo | null>(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [filterTab, setFilterTab] = useState<"All" | "Running" | "Scheduled" | "Completed">("All");
  const [search, setSearch] = useState("");

  const filteredDemos = demos.filter((d) => {
    if (filterTab === "Scheduled" && d.day1Status !== "Pending") return false;
    if (
      filterTab === "Running" &&
      !(
        (d.day1Status === "Completed" || d.day2Status === "Completed") &&
        d.day3Status !== "Completed"
      )
    )
      return false;
    if (filterTab === "Completed" && d.day3Status !== "Completed") return false;

    if (!search) return true;
    const q = search.toLowerCase();
    return (
      d.id.toLowerCase().includes(q) ||
      d.studentName.toLowerCase().includes(q) ||
      d.teacherName.toLowerCase().includes(q) ||
      d.leadId.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              3-Day Free Demo Class Management
            </h2>
            <p className="text-xs text-slate-500">
              Track Day 1, Day 2, Day 3 progression, parent feedback, and tuition conversions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setScheduleModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            Schedule New 3-Day Demo
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search demos by Student, Tutor, or Demo ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-medium">
            <button
              type="button"
              onClick={() => setFilterTab("All")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                filterTab === "All" ? "bg-white text-slate-900 font-bold shadow-2xs" : "text-slate-600"
              }`}
            >
              All ({demos.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab("Running")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                filterTab === "Running" ? "bg-white text-slate-900 font-bold shadow-2xs" : "text-slate-600"
              }`}
            >
              Running Now
            </button>
            <button
              type="button"
              onClick={() => setFilterTab("Scheduled")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                filterTab === "Scheduled" ? "bg-white text-slate-900 font-bold shadow-2xs" : "text-slate-600"
              }`}
            >
              Scheduled
            </button>
            <button
              type="button"
              onClick={() => setFilterTab("Completed")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                filterTab === "Completed" ? "bg-white text-slate-900 font-bold shadow-2xs" : "text-slate-600"
              }`}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

      {/* Demos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDemos.map((demo) => {
          const linkedLead = leads.find((l) => l.id === demo.leadId);
          const isFinished = demo.day1Status === "Completed" && demo.day2Status === "Completed" && demo.day3Status === "Completed";

          return (
            <div
              key={demo.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 flex flex-col justify-between space-y-3"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {demo.id}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">{demo.studentName}</h3>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Lead: {demo.leadId} {linkedLead ? `• ${linkedLead.studentClass}` : ""}
                    </span>
                  </div>

                  <Badge
                    variant={
                      isFinished
                        ? "green"
                        : demo.day1Status === "Completed"
                        ? "blue"
                        : "yellow"
                    }
                    size="sm"
                  >
                    {isFinished ? "3-Days Done" : "In Progress"}
                  </Badge>
                </div>

                {/* Tutor & Schedule Info */}
                <div className="space-y-1.5 pt-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        if (onSelectTeacherProfile) {
                          const t = teachers.find((item) => item.id === demo.teacherId);
                          if (t) onSelectTeacherProfile(t);
                        }
                      }}
                      className="font-medium text-slate-800 hover:text-blue-600 flex items-center gap-1 transition-colors text-left"
                      title="Click to view full tutor profile"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Tutor: {demo.teacherName}</span>
                    </button>
                    <span className="text-slate-400 font-mono text-[11px]">{demo.teacherId}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {formatDisplayDate(demo.startDate)} → {formatDisplayDate(demo.endDate)}
                    </span>
                    <span className="flex items-center gap-1 font-medium text-slate-700">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {demo.timing}
                    </span>
                  </div>
                </div>

                {/* 3-Day Progression Buttons (Section 5 requirement) */}
                <div className="mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 space-y-2">
                  <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                    <span>3-Day Demo Tracking</span>
                    <span className="text-slate-400 font-normal">Click to toggle</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    {/* Day 1 */}
                    <button
                      type="button"
                      onClick={() =>
                        updateDemoDayStatus(
                          demo.id,
                          1,
                          demo.day1Status === "Completed" ? "Pending" : "Completed"
                        )
                      }
                      className={`p-1.5 rounded-lg border text-xs font-semibold transition-all ${
                        demo.day1Status === "Completed"
                          ? "bg-emerald-500 border-emerald-600 text-white shadow-2xs"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span className="block text-[10px] opacity-80">Day 1</span>
                      {demo.day1Status === "Completed" ? "Done ✓" : "Pending"}
                    </button>

                    {/* Day 2 */}
                    <button
                      type="button"
                      onClick={() =>
                        updateDemoDayStatus(
                          demo.id,
                          2,
                          demo.day2Status === "Completed" ? "Pending" : "Completed"
                        )
                      }
                      className={`p-1.5 rounded-lg border text-xs font-semibold transition-all ${
                        demo.day2Status === "Completed"
                          ? "bg-emerald-500 border-emerald-600 text-white shadow-2xs"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span className="block text-[10px] opacity-80">Day 2</span>
                      {demo.day2Status === "Completed" ? "Done ✓" : "Pending"}
                    </button>

                    {/* Day 3 */}
                    <button
                      type="button"
                      onClick={() =>
                        updateDemoDayStatus(
                          demo.id,
                          3,
                          demo.day3Status === "Completed" ? "Pending" : "Completed"
                        )
                      }
                      className={`p-1.5 rounded-lg border text-xs font-semibold transition-all ${
                        demo.day3Status === "Completed"
                          ? "bg-emerald-500 border-emerald-600 text-white shadow-2xs"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span className="block text-[10px] opacity-80">Day 3</span>
                      {demo.day3Status === "Completed" ? "Done ✓" : "Pending"}
                    </button>
                  </div>
                </div>

                {/* Feedback & Result Display */}
                {(demo.parentFeedback || demo.finalResult) && (
                  <div className="mt-2.5 p-2 bg-blue-50/50 rounded-lg text-xs space-y-1 border border-blue-100">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Parent Feedback:</span>
                      <span className="font-semibold text-slate-800">{demo.parentFeedback || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Result:</span>
                      <span className="font-bold text-emerald-700">{demo.finalResult || "-"}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onOpenWhatsApp(
                      linkedLead?.parentContact || "",
                      linkedLead?.parentName || demo.studentName,
                      {
                        studentName: demo.studentName,
                        teacherName: demo.teacherName,
                        startDate: demo.startDate,
                        endDate: demo.endDate,
                        timing: demo.timing,
                      }
                    )
                  }
                  className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  title="WhatsApp Parent"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveFeedbackDemo(demo)}
                  className="flex-1 py-1.5 px-3 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  {demo.finalResult ? "Edit Result" : "Record Feedback & Result"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feedback Modal */}
      {activeFeedbackDemo && (
        <DemoFeedbackModal
          isOpen={!!activeFeedbackDemo}
          onClose={() => setActiveFeedbackDemo(null)}
          demo={activeFeedbackDemo}
        />
      )}

      {/* Schedule Modal */}
      {scheduleModalOpen && (
        <ScheduleDemoModal
          isOpen={scheduleModalOpen}
          onClose={() => setScheduleModalOpen(false)}
        />
      )}
    </div>
  );
};
