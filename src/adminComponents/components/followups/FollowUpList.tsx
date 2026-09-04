import React, { useState } from "react";
import { useCRM } from "../../context/CRMContext";
import { FollowUp, FollowUpType } from "../../types/crm";
import { Badge } from "../common/Badge";
import { formatDisplayDate, isToday, isOverdue, getTodayString } from "../../utils/dateUtils";
import {
  Clock,
  Phone,
  MessageCircle,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Plus,
  Search,
  Filter,
} from "lucide-react";
import { Modal } from "../common/Modal";

interface FollowUpListProps {
  onOpenWhatsApp: (phone: string, name: string, context?: any) => void;
}

export const FollowUpList: React.FC<FollowUpListProps> = ({ onOpenWhatsApp }) => {
  const { followUps, updateFollowUp, addFollowUp, leads } = useCRM();

  const [filterTab, setFilterTab] = useState<"Pending" | "Today" | "Overdue" | "Completed">("Pending");
  const [search, setSearch] = useState("");
  const [newFollowUpOpen, setNewFollowUpOpen] = useState(false);

  // New follow up state
  const [selectedLeadId, setSelectedLeadId] = useState(leads[0]?.id || "");
  const [fType, setFType] = useState<FollowUpType>("Parent Decision Follow-up");
  const [fDueDate, setFDueDate] = useState(getTodayString());
  const [fAction, setFAction] = useState("");

  const handleCreateFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    const l = leads.find((lead) => lead.id === selectedLeadId);
    if (!l) return;

    addFollowUp({
      leadId: l.id,
      studentName: l.studentName,
      parentName: l.parentName,
      contactNumber: l.parentContact,
      assignedTeacherName: l.assignedTeacherName,
      followUpType: fType,
      dueDate: fDueDate,
      nextAction: fAction || `Call ${l.parentName} regarding ${fType}`,
    });

    setNewFollowUpOpen(false);
    setFAction("");
  };

  const filteredFollowUps = followUps.filter((f) => {
    if (filterTab === "Pending" && f.status !== "Pending") return false;
    if (filterTab === "Today" && !(f.status === "Pending" && isToday(f.dueDate))) return false;
    if (filterTab === "Overdue" && !(f.status === "Pending" && isOverdue(f.dueDate))) return false;
    if (filterTab === "Completed" && f.status !== "Completed") return false;

    if (!search) return true;
    const q = search.toLowerCase();
    return (
      f.studentName?.toLowerCase().includes(q) ||
      f.parentName?.toLowerCase().includes(q) ||
      (f.contactNumber || "").includes(q) ||
      f.followUpType?.toLowerCase().includes(q) ||
      (f.nextAction || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Follow-ups & Communication Cadence
            </h2>
            <p className="text-xs text-slate-500">
              Automated reminders for demo checkpoints, parent decisions, registration, and satisfaction reviews.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setNewFollowUpOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            + Schedule Custom Follow-up
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search follow-ups by Parent, Student, Action, Phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-medium">
            <button
              type="button"
              onClick={() => setFilterTab("Pending")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                filterTab === "Pending" ? "bg-white text-slate-900 font-bold shadow-2xs" : "text-slate-600"
              }`}
            >
              All Pending ({followUps.filter((f) => f.status === "Pending").length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab("Today")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                filterTab === "Today" ? "bg-white text-slate-900 font-bold shadow-2xs" : "text-slate-600"
              }`}
            >
              Due Today
            </button>
            <button
              type="button"
              onClick={() => setFilterTab("Overdue")}
              className={`px-3 py-1.5 rounded-md transition-all ${
                filterTab === "Overdue" ? "bg-white text-rose-700 font-bold shadow-2xs" : "text-slate-600"
              }`}
            >
              Overdue
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

      {/* List */}
      <div className="space-y-2.5">
        {filteredFollowUps.map((item) => {
          const overdue = item.status === "Pending" && isOverdue(item.dueDate);
          const today = item.status === "Pending" && isToday(item.dueDate);

          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all bg-white ${
                overdue
                  ? "border-rose-300 bg-rose-50/20 shadow-2xs"
                  : today
                  ? "border-amber-300 bg-amber-50/20 shadow-2xs"
                  : "border-slate-200 shadow-2xs"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-slate-900">{item.parentName}</h3>
                    <span className="text-xs text-slate-500">(Student: {item.studentName})</span>
                    <Badge
                      variant={
                        item.status === "Completed"
                          ? "green"
                          : overdue
                          ? "red"
                          : today
                          ? "yellow"
                          : "blue"
                      }
                      size="sm"
                      dot
                    >
                      {item.followUpType}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-700 font-medium">{item.nextAction}</p>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-slate-600">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      Due: {formatDisplayDate(item.dueDate)}
                    </span>
                    {item.assignedTeacherName && (
                      <span>Tutor: {item.assignedTeacherName}</span>
                    )}
                    {item.remarks && <span className="italic">Note: {item.remarks}</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0 pt-2 sm:pt-0">
                  <a
                    href={`tel:${item.contactNumber.replace(/\D/g, "")}`}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                    title="Call"
                  >
                    <Phone className="w-4 h-4 text-emerald-600" />
                  </a>

                  <button
                    type="button"
                    onClick={() =>
                      onOpenWhatsApp(item.contactNumber, item.parentName, {
                        studentName: item.studentName,
                      })
                    }
                    className="p-2 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-xl transition-colors"
                    title="WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                  </button>

                  {item.status === "Pending" ? (
                    <button
                      type="button"
                      onClick={() =>
                        updateFollowUp(item.id, {
                          status: "Completed",
                          remarks: "Completed successfully via call/WhatsApp.",
                        })
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mark Done
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Done
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Schedule Custom Follow-up Modal */}
      {newFollowUpOpen && (
        <Modal
          isOpen={newFollowUpOpen}
          onClose={() => setNewFollowUpOpen(false)}
          title="Schedule New Follow-up Task"
          subtitle="Add an upcoming reminder for staff to contact parents or tutors."
          maxWidth="md"
        >
          <form onSubmit={handleCreateFollowUp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Student / Lead *
              </label>
              <select
                value={selectedLeadId}
                onChange={(e) => setSelectedLeadId(e.target.value)}
                required
                className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.studentName} — Parent: {l.parentName} ({l.parentContact})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Follow-up Purpose / Stage *
              </label>
              <select
                value={fType}
                onChange={(e: any) => setFType(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Demo Day 1 Check">Demo Day 1 Check</option>
                <option value="Demo Day 2 Check">Demo Day 2 Check</option>
                <option value="Demo Day 3 Completion">Demo Day 3 Completion Check</option>
                <option value="Parent Decision Follow-up">Parent Decision Follow-up</option>
                <option value="Registration Fee Collection">Registration Fee Collection</option>
                <option value="Tuition Start Confirmation">Tuition Start Confirmation</option>
                <option value="Week 1 Check-in">Week 1 Satisfaction Check-in</option>
                <option value="Teacher Commission Collection">Teacher Commission Collection</option>
                <option value="Monthly Satisfaction Review">Monthly Satisfaction Review</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Due Date *
              </label>
              <input
                type="date"
                required
                value={fDueDate}
                onChange={(e) => setFDueDate(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Action Description
              </label>
              <input
                type="text"
                placeholder="e.g. Call parent to get feedback on chemistry demo."
                value={fAction}
                onChange={(e) => setFAction(e.target.value)}
                className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setNewFollowUpOpen(false)}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors"
              >
                Schedule Task
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
