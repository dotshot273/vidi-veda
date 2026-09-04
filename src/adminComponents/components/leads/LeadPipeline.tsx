import React, { useState } from "react";
import { useCRM } from "../../context/CRMContext";
import { Lead, LeadStatus, Teacher } from "../../types/crm";
import { Badge, getStatusBadgeProps } from "../common/Badge";
import { formatDisplayDate } from "../../utils/dateUtils";
import {
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  UserCheck,
  Search,
  Filter,
  Columns,
  List,
  ChevronRight,
  MoreVertical,
  Plus,
} from "lucide-react";

interface LeadPipelineProps {
  onOpenNewLead: () => void;
  onSelectLeadProfile: (lead: Lead) => void;
  onOpenTeacherMatching: (lead: Lead) => void;
  onScheduleDemoForLead: (lead: Lead) => void;
  onOpenWhatsApp: (phone: string, name: string, context?: any) => void;
  onSelectTeacherProfile?: (teacher: Teacher) => void;
}

const PIPELINE_STAGES: { id: LeadStatus; label: string; color: string }[] = [
  { id: "New Lead", label: "1. New Lead", color: "border-blue-300 bg-blue-50/30 text-blue-900" },
  { id: "Contacted", label: "2. Contacted", color: "border-slate-300 bg-slate-50/50 text-slate-800" },
  { id: "Teacher Searching", label: "3. Teacher Searching", color: "border-amber-300 bg-amber-50/30 text-amber-900" },
  { id: "Teacher Shortlisted", label: "4. Teacher Shortlisted", color: "border-purple-300 bg-purple-50/30 text-purple-900" },
  { id: "Demo Scheduled", label: "5. Demo Scheduled", color: "border-indigo-300 bg-indigo-50/30 text-indigo-900" },
  { id: "Demo Running", label: "6. Demo Running", color: "border-blue-400 bg-blue-50/50 text-blue-950" },
  { id: "Demo Completed", label: "7. Demo Completed", color: "border-teal-300 bg-teal-50/30 text-teal-900" },
  { id: "Parent Decision Pending", label: "8. Decision Pending", color: "border-amber-400 bg-amber-50/50 text-amber-950" },
  { id: "Confirmed", label: "9. Confirmed", color: "border-emerald-400 bg-emerald-50/40 text-emerald-950" },
  { id: "Registration Pending", label: "10. Reg. Fee Pending", color: "border-rose-300 bg-rose-50/30 text-rose-900" },
  { id: "Tuition Started", label: "11. Tuition Started", color: "border-emerald-500 bg-emerald-50/60 text-emerald-950" },
  { id: "Not Interested", label: "12. Not Interested", color: "border-slate-200 bg-slate-100/60 text-slate-600" },
  { id: "Cancelled", label: "13. Cancelled", color: "border-slate-200 bg-slate-100/60 text-slate-600" },
];

export const LeadPipeline: React.FC<LeadPipelineProps> = ({
  onOpenNewLead,
  onSelectLeadProfile,
  onOpenTeacherMatching,
  onScheduleDemoForLead,
  onOpenWhatsApp,
  onSelectTeacherProfile,
}) => {
  const { leads, updateLeadStatus, teachers } = useCRM();

  const [viewMode, setViewMode] = useState<"board" | "list">("board");
  const [filterStage, setFilterStage] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLeads = leads.filter((lead) => {
    if (filterStage !== "All" && lead.status !== filterStage) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      lead.id.toLowerCase().includes(q) ||
      lead.parentName.toLowerCase().includes(q) ||
      lead.studentName.toLowerCase().includes(q) ||
      lead.parentContact.includes(q) ||
      lead.location.toLowerCase().includes(q) ||
      lead.studentClass.toLowerCase().includes(q) ||
      lead.subjectRequired.toLowerCase().includes(q) ||
      (lead.assignedTeacherName && lead.assignedTeacherName.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Lead Pipeline & Progression Board
            </h2>
            <p className="text-xs text-slate-500">
              Parent Enquiry → Teacher Matching → 3-Day Demo → Confirmation → Active Tuition
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode("board")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  viewMode === "board"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                Pipeline Board
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  viewMode === "list"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <List className="w-3.5 h-3.5" />
                List View
              </button>
            </div>

            <button
              type="button"
              onClick={onOpenNewLead}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              + Add Lead
            </button>
          </div>
        </div>

        {/* Search & Stage Filter */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by Parent, Student, Phone, Area, Class, or Tutor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="All">All Pipeline Stages ({leads.length})</option>
              {PIPELINE_STAGES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label} ({leads.filter((l) => l.status === s.id).length})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === "board" ? (
        <div className="flex gap-3 overflow-x-auto pb-4 pt-1 snap-x">
          {PIPELINE_STAGES.map((stage) => {
            const stageLeads = filteredLeads.filter((l) => l.status === stage.id);

            return (
              <div
                key={stage.id}
                className="w-72 sm:w-80 flex-shrink-0 bg-slate-100/70 rounded-2xl border border-slate-200/80 flex flex-col max-h-[75vh]"
              >
                {/* Column Header */}
                <div
                  className={`p-3 border-b rounded-t-2xl font-bold text-xs flex items-center justify-between ${stage.color}`}
                >
                  <span className="truncate pr-1">{stage.label}</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/80 text-slate-800 text-[11px] font-mono shadow-2xs font-bold">
                    {stageLeads.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="p-2.5 overflow-y-auto space-y-2.5 flex-1">
                  {stageLeads.length === 0 ? (
                    <div className="p-4 text-center text-slate-400 text-xs italic">
                      No leads in this stage
                    </div>
                  ) : (
                    stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:shadow-sm transition-all space-y-2.5"
                      >
                        {/* Student Name & ID */}
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <button
                              type="button"
                              onClick={() => onSelectLeadProfile(lead)}
                              className="text-xs font-bold text-slate-900 hover:text-blue-600 text-left line-clamp-1"
                            >
                              {lead.studentName}
                            </button>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {lead.id} • {lead.studentClass}
                            </span>
                          </div>

                          <span className="text-[11px] font-bold text-emerald-700 font-mono flex-shrink-0">
                            ₹{lead.expectedMonthlyFee}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="space-y-1 text-[11px] text-slate-600">
                          <p className="flex items-center gap-1">
                            <span className="text-slate-400">Subject:</span>
                            <span className="font-medium text-slate-800">{lead.subjectRequired}</span>
                          </p>
                          <p className="flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 text-rose-500 flex-shrink-0" />
                            <span>{lead.location}</span>
                          </p>
                          <p className="text-slate-500">
                            Parent: <span className="text-slate-700 font-medium">{lead.parentName}</span>
                          </p>
                          {lead.assignedTeacherName && (
                            <button
                              type="button"
                              onClick={() => {
                                if (onSelectTeacherProfile && lead.assignedTeacherId) {
                                  const t = teachers.find((item) => item.id === lead.assignedTeacherId);
                                  if (t) onSelectTeacherProfile(t);
                                }
                              }}
                              className="text-indigo-700 hover:text-indigo-900 font-medium bg-indigo-50/70 hover:bg-indigo-100 px-2 py-0.5 rounded text-[10px] flex items-center gap-1 transition-colors text-left"
                              title="Click to view full tutor profile"
                            >
                              <UserCheck className="w-3 h-3 text-indigo-500" />
                              <span>Tutor: {lead.assignedTeacherName}</span>
                            </button>
                          )}
                        </div>

                        {/* Move Stage Selector (No manual copying!) */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                          <select
                            value={lead.status}
                            onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                            className="text-[11px] font-medium py-1 px-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 max-w-[130px]"
                          >
                            {PIPELINE_STAGES.map((s) => (
                              <option key={s.id} value={s.id}>
                                Move: {s.label}
                              </option>
                            ))}
                          </select>

                          {/* Action Quick Buttons */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <a
                              href={`tel:${lead.parentContact.replace(/\D/g, "")}`}
                              title="Call Parent"
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                            >
                              <Phone className="w-3 h-3 text-emerald-600" />
                            </a>
                            <button
                              type="button"
                              title="WhatsApp"
                              onClick={() =>
                                onOpenWhatsApp(lead.parentContact, lead.parentName, {
                                  studentName: lead.studentName,
                                  subject: lead.subjectRequired,
                                })
                              }
                              className="p-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-md transition-colors"
                            >
                              <MessageCircle className="w-3 h-3 text-emerald-600" />
                            </button>
                            <button
                              type="button"
                              title="Match Tutor"
                              onClick={() => onOpenTeacherMatching(lead)}
                              className="p-1.5 bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 rounded-md transition-colors"
                            >
                              <UserCheck className="w-3 h-3 text-purple-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* DETAILED LIST TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Lead ID</th>
                  <th className="py-3 px-4">Student / Class</th>
                  <th className="py-3 px-4">Parent & Contact</th>
                  <th className="py-3 px-4">Subject & Location</th>
                  <th className="py-3 px-4">Assigned Tutor</th>
                  <th className="py-3 px-4">Expected Fee</th>
                  <th className="py-3 px-4">Pipeline Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {lead.id}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        {formatDisplayDate(lead.enquiryDate)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => onSelectLeadProfile(lead)}
                        className="font-bold text-slate-900 hover:text-blue-600 text-left"
                      >
                        {lead.studentName}
                      </button>
                      <span className="block text-[11px] text-slate-500">{lead.studentClass}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800">{lead.parentName}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-slate-500">{lead.parentContact}</span>
                        <a
                          href={`tel:${lead.parentContact.replace(/\D/g, "")}`}
                          className="text-emerald-600 hover:underline"
                          title="Call"
                        >
                          <Phone className="w-3 h-3" />
                        </a>
                        <button
                          type="button"
                          onClick={() => onOpenWhatsApp(lead.parentContact, lead.parentName)}
                          className="text-emerald-600 hover:text-emerald-700"
                          title="WhatsApp"
                        >
                          <MessageCircle className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800">{lead.subjectRequired}</span>
                      <span className="block text-[11px] text-slate-500 flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-rose-500" />
                        {lead.location}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {lead.assignedTeacherName ? (
                        <button
                          type="button"
                          onClick={() => {
                            if (onSelectTeacherProfile && lead.assignedTeacherId) {
                              const t = teachers.find((item) => item.id === lead.assignedTeacherId);
                              if (t) onSelectTeacherProfile(t);
                            }
                          }}
                          className="font-semibold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded transition-colors text-left"
                          title="Click to view full tutor profile"
                        >
                          {lead.assignedTeacherName}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onOpenTeacherMatching(lead)}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          + Match Tutor
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      ₹{lead.expectedMonthlyFee}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                        className="text-xs font-medium py-1 px-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {PIPELINE_STAGES.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectLeadProfile(lead)}
                        className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        Profile →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
