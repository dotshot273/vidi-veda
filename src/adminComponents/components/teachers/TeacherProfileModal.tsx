import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { useCRM } from "../../context/CRMContext";
import { Teacher, TeacherStatus, Lead } from "../../types/crm";
import { Badge } from "../common/Badge";
import {
  Phone,
  MessageCircle,
  MapPin,
  BookOpen,
  GraduationCap,
  Clock,
  DollarSign,
  Calendar,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Edit3,
  Award,
  Star,
  Users,
  Briefcase,
  Layers,
  Save,
  X,
} from "lucide-react";

interface TeacherProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: Teacher;
  onOpenWhatsApp: (phone: string, name: string, context?: any) => void;
  onScheduleDemo?: (teacherId: string) => void;
  onOpenStudentProfile?: (lead: Lead) => void;
}

type TabKey = "overview" | "tuitions" | "demos" | "finance" | "edit";

export const TeacherProfileModal: React.FC<TeacherProfileModalProps> = ({
  isOpen,
  onClose,
  teacher,
  onOpenWhatsApp,
  onScheduleDemo,
  onOpenStudentProfile,
}) => {
  const {
    leads,
    demos,
    commissions,
    tuitions,
    updateTeacher,
  } = useCRM();

  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [isEditing, setIsEditing] = useState(false);

  // Edit form states initialized from current teacher
  const [editName, setEditName] = useState(teacher.name);
  const [editContact, setEditContact] = useState(teacher.contact || teacher.contactNumber || "");
  const [editEmail, setEditEmail] = useState(teacher.email || "");
  const [editGender, setEditGender] = useState<"Male" | "Female" | "Other">(teacher.gender || "Female");
  const [editQualification, setEditQualification] = useState(teacher.qualification || "");
  const [editBoard, setEditBoard] = useState(teacher.board || "CBSE, ICSE");
  const [editExpYears, setEditExpYears] = useState(teacher.teachingExperienceYears || 0);
  const [editSubjectsStr, setEditSubjectsStr] = useState((teacher.subjects || []).join(", "));
  const [editClassesStr, setEditClassesStr] = useState((teacher.classes || teacher.classesTaught || []).join(", "));
  const [editAreasStr, setEditAreasStr] = useState((teacher.areasCovered || []).join(", "));
  const [editTiming, setEditTiming] = useState(teacher.preferredTimings || teacher.preferredTiming || "");
  const [editFee, setEditFee] = useState(teacher.expectedNegotiatedFee || teacher.expectedFee || 3500);
  const [editStatus, setEditStatus] = useState<TeacherStatus>(teacher.status || "Available");
  const [editRemarks, setEditRemarks] = useState(teacher.remarks || teacher.notes || "");

  // Real linked data calculations
  const tutorDemos = demos.filter((d) => d.teacherId === teacher.id);
  const completedDemos = tutorDemos.filter(
    (d) => d.day1Status === "Completed" && d.day2Status === "Completed" && d.day3Status === "Completed"
  );
  const confirmedDemos = tutorDemos.filter((d) => d.finalResult === "Confirmed");
  const demoSuccessRate = tutorDemos.length > 0
    ? Math.round((confirmedDemos.length / tutorDemos.length) * 100)
    : 0;

  const tutorCommissions = commissions.filter((c) => c.teacherId === teacher.id);
  const totalCommissionBalance = tutorCommissions.reduce((sum, c) => sum + (c.balance || 0), 0);
  const totalCommissionPaid = tutorCommissions.reduce((sum, c) => sum + (c.amountPaid || 0), 0);
  const totalCommissionAmount = tutorCommissions.reduce((sum, c) => sum + (c.commissionAmount || 0), 0);

  // Active tuitions associated with this teacher
  const assignedLeads = leads.filter((l) => l.assignedTeacherId === teacher.id);
  const runningLeads = assignedLeads.filter(
    (l) => l.status === "Confirmed" || l.status === "Registration Pending" || l.status === "Tuition Started"
  );
  const tutorActiveTuitions = tuitions.filter(
    (t) => t.teacherId === teacher.id || assignedLeads.some((l) => l.id === t.leadId)
  );

  const cleanPhone = (teacher.contact || teacher.contactNumber || "").replace(/\D/g, "");

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const subjectsArr = editSubjectsStr.split(",").map((s) => s.trim()).filter(Boolean);
    const classesArr = editClassesStr.split(",").map((s) => s.trim()).filter(Boolean);
    const areasArr = editAreasStr.split(",").map((s) => s.trim()).filter(Boolean);

    updateTeacher(teacher.id, {
      name: editName,
      contact: editContact,
      contactNumber: editContact,
      email: editEmail,
      gender: editGender,
      qualification: editQualification,
      board: editBoard,
      teachingExperienceYears: Number(editExpYears),
      subjects: subjectsArr,
      classes: classesArr,
      classesTaught: classesArr,
      areasCovered: areasArr,
      preferredTimings: editTiming,
      preferredTiming: editTiming,
      expectedNegotiatedFee: Number(editFee),
      expectedFee: Number(editFee),
      status: editStatus,
      remarks: editRemarks,
      notes: editRemarks,
    });

    setIsEditing(false);
    setActiveTab("overview");
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Available":
        return "green";
      case "Demo":
        return "blue";
      case "Active Tuition":
      case "Running Tuition":
        return "yellow";
      case "Shortlisted":
        return "purple";
      case "Inactive":
      case "Temporarily Unavailable":
      default:
        return "gray";
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${teacher.name} — Tutor Profile`}
      subtitle={`Tutor ID: ${teacher.id} | Capacity & Commission Management`}
      maxWidth="4xl"
    >
      <div className="space-y-4 text-xs">
        {/* Top Header Card */}
        <div className="p-4 bg-slate-900 text-white rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg font-mono flex-shrink-0 shadow-inner">
              {teacher.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-white tracking-tight">{teacher.name}</h2>
                <span className="font-mono text-[11px] font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  {teacher.id}
                </span>
                <Badge variant={getStatusBadgeVariant(teacher.status)} size="sm" dot>
                  {teacher.status}
                </Badge>
              </div>
              <p className="text-slate-400 text-xs mt-1 flex items-center gap-2 flex-wrap">
                <span>{teacher.gender}</span>
                <span>•</span>
                <span className="text-slate-200 font-medium">{teacher.qualification}</span>
                <span>•</span>
                <span>{teacher.teachingExperienceYears} Years Experience</span>
              </p>
            </div>
          </div>

          {/* Header Quick Action Triggers */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {cleanPhone && (
              <a
                href={`tel:${cleanPhone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors border border-slate-700"
                title="Direct Phone Call"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Call</span>
              </a>
            )}

            <button
              type="button"
              onClick={() =>
                onOpenWhatsApp(
                  teacher.contact || teacher.contactNumber || "",
                  teacher.name,
                  { teacherId: teacher.id }
                )
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors"
              title="Message on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            {onScheduleDemo && (
              <button
                type="button"
                onClick={() => {
                  onScheduleDemo(teacher.id);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors shadow-xs"
                title="Schedule 3-Day Demo with Tutor"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule Demo</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setIsEditing(!isEditing);
                setActiveTab(isEditing ? "overview" : "edit");
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold transition-colors border border-slate-700"
              title="Edit Tutor Profile"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? "Cancel" : "Edit"}</span>
            </button>
          </div>
        </div>

        {/* Mini Performance Counters Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block font-medium">Active Tuitions</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-bold text-slate-900 font-mono">
                {runningLeads.length || teacher.activeStudentsCount || 0}
              </span>
              <span className="text-[11px] text-slate-500">students</span>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block font-medium">3-Day Demos Done</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-lg font-bold text-slate-900 font-mono">
                {tutorDemos.length || teacher.totalDemosDone || 0}
              </span>
              <span className="text-[11px] text-emerald-700 font-semibold">
                ({demoSuccessRate}% win rate)
              </span>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block font-medium">Expected Monthly Fee</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-bold text-slate-900 font-mono">
                ₹{teacher.expectedNegotiatedFee || teacher.expectedFee || 0}
              </span>
              <span className="text-[11px] text-slate-500">/mo</span>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block font-medium">Agency Commission</span>
            <div className="flex items-baseline justify-between mt-0.5">
              <span className="text-lg font-bold text-emerald-700 font-mono">
                ₹{totalCommissionPaid || teacher.totalCommissionsPaid || 0}
              </span>
              {totalCommissionBalance > 0 && (
                <span className="text-[11px] text-rose-700 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                  ₹{totalCommissionBalance} due
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 gap-1 pt-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab("overview");
              setIsEditing(false);
            }}
            className={`px-3 py-2 font-semibold text-xs border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === "overview" && !isEditing
                ? "border-blue-600 text-blue-600 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Overview & Credentials</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("tuitions");
              setIsEditing(false);
            }}
            className={`px-3 py-2 font-semibold text-xs border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === "tuitions"
                ? "border-blue-600 text-blue-600 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Assigned Tuitions ({runningLeads.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("demos");
              setIsEditing(false);
            }}
            className={`px-3 py-2 font-semibold text-xs border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === "demos"
                ? "border-blue-600 text-blue-600 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Demo Track Record ({tutorDemos.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("finance");
              setIsEditing(false);
            }}
            className={`px-3 py-2 font-semibold text-xs border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === "finance"
                ? "border-blue-600 text-blue-600 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>50% Commission Ledger ({tutorCommissions.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("edit");
              setIsEditing(true);
            }}
            className={`px-3 py-2 font-semibold text-xs border-b-2 transition-colors flex items-center gap-1.5 ml-auto ${
              activeTab === "edit" || isEditing
                ? "border-blue-600 text-blue-600 font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Tab 1: Overview & Credentials */}
        {activeTab === "overview" && !isEditing && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Academic & Pedagogical Qualifications */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  Academic Qualifications & Board Mastery
                </h4>

                <div className="space-y-2">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Highest Degree / Qualification</span>
                    <span className="font-semibold text-slate-900 text-sm">{teacher.qualification}</span>
                  </div>

                  {teacher.graduation && (
                    <div>
                      <span className="text-slate-400 block text-[11px]">Graduation</span>
                      <span className="text-slate-800 font-medium">{teacher.graduation}</span>
                    </div>
                  )}

                  {teacher.postGraduation && (
                    <div>
                      <span className="text-slate-400 block text-[11px]">Post-Graduation</span>
                      <span className="text-slate-800 font-medium">{teacher.postGraduation}</span>
                    </div>
                  )}

                  <div>
                    <span className="text-slate-400 block text-[11px]">Affiliated Boards</span>
                    <span className="text-slate-800 font-medium">{teacher.board || "CBSE, ICSE, State Board"}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px] mb-1">Teaching Classes</span>
                    <div className="flex flex-wrap gap-1">
                      {(teacher.classes || teacher.classesTaught || ["Class 6 to 10"]).map((c, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-white rounded border border-slate-200 text-slate-800 font-medium text-[11px]"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px] mb-1">Subjects Handled</span>
                    <div className="flex flex-wrap gap-1">
                      {(teacher.subjects || []).map((s, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded border border-blue-200 font-semibold text-[11px]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Logistical & Operational Info */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-500" />
                  Service Areas & Availability
                </h4>

                <div className="space-y-2">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Contact Number / WhatsApp</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {teacher.contact || teacher.contactNumber || "Not recorded"}
                    </span>
                  </div>

                  {teacher.email && (
                    <div>
                      <span className="text-slate-400 block text-[11px]">Email Address</span>
                      <span className="text-slate-800">{teacher.email}</span>
                    </div>
                  )}

                  <div>
                    <span className="text-slate-400 block text-[11px] mb-1">Localities & Areas Covered</span>
                    <div className="flex flex-wrap gap-1">
                      {(teacher.areasCovered || []).map((area, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-rose-50 text-rose-800 rounded border border-rose-200 text-[11px] flex items-center gap-1"
                        >
                          <MapPin className="w-3 h-3 text-rose-500" />
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Preferred Timing Slots</span>
                    <span className="text-slate-800 font-medium flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {teacher.preferredTimings || teacher.preferredTiming || "Flexible Hours"}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Expected Monthly Fee</span>
                    <span className="font-mono font-bold text-slate-900 text-sm text-emerald-800">
                      ₹{teacher.expectedNegotiatedFee || teacher.expectedFee || 0} / month
                    </span>
                  </div>

                  {teacher.availability && (
                    <div>
                      <span className="text-slate-400 block text-[11px]">Availability Status</span>
                      <span className="text-slate-800">{teacher.availability}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Coordinator Remarks & Observations */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Agency Coordinator Observations & Remarks
              </h4>
              <p className="text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 leading-relaxed">
                {teacher.remarks || teacher.notes || "No coordinator notes recorded yet. Click Edit Profile to add observations about tutor punctuality, parent feedback, or special preferences."}
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Assigned Tuitions */}
        {activeTab === "tuitions" && !isEditing && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800">
                Currently Assigned Students ({runningLeads.length})
              </h4>
              <span className="text-slate-500 text-[11px]">
                Showing confirmed and running tuitions for {teacher.name}
              </span>
            </div>

            {runningLeads.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No active students right now</p>
                <p className="text-xs text-slate-500 mt-1">
                  This tutor is currently available for new parent enquiries and 3-day demos.
                </p>
              </div>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100/75 text-slate-600 text-[11px] font-bold border-b border-slate-200 uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Student & Class</th>
                      <th className="py-2.5 px-3">Parent & Contact</th>
                      <th className="py-2.5 px-3">Subject Required</th>
                      <th className="py-2.5 px-3">Location</th>
                      <th className="py-2.5 px-3">Monthly Fee</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {runningLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          {lead.studentName}
                          <span className="block text-[11px] font-normal text-slate-500">
                            {lead.studentClass} ({lead.school || "School not specified"})
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="font-medium text-slate-800">{lead.parentName}</span>
                          <span className="block font-mono text-[11px] text-slate-500">
                            {lead.parentContact}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-medium text-blue-700">
                          {lead.subjectRequired}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">{lead.location}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                          ₹{lead.expectedMonthlyFee}
                        </td>
                        <td className="py-2.5 px-3">
                          <Badge variant="green" size="sm">
                            {lead.status}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          {onOpenStudentProfile && (
                            <button
                              type="button"
                              onClick={() => {
                                onOpenStudentProfile(lead);
                                onClose();
                              }}
                              className="px-2 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded font-semibold text-[11px] transition-colors"
                            >
                              View Student
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Demo Track Record */}
        {activeTab === "demos" && !isEditing && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800">
                All 3-Day Demos Conducted ({tutorDemos.length})
              </h4>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-slate-500">Win Rate:</span>
                <span className="font-bold text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {demoSuccessRate}% Confirmed
                </span>
              </div>
            </div>

            {tutorDemos.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No demos scheduled yet</p>
                <p className="text-xs text-slate-500 mt-1">
                  Click &quot;Schedule Demo&quot; in the header to assign a 3-day demo to this tutor.
                </p>
              </div>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100/75 text-slate-600 text-[11px] font-bold border-b border-slate-200 uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Demo ID</th>
                      <th className="py-2.5 px-3">Student & Parent</th>
                      <th className="py-2.5 px-3">Demo Dates & Timing</th>
                      <th className="py-2.5 px-3 text-center">Day 1 / 2 / 3</th>
                      <th className="py-2.5 px-3">Parent Feedback</th>
                      <th className="py-2.5 px-3">Final Outcome</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {tutorDemos.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-600">{d.id}</td>
                        <td className="py-2.5 px-3">
                          <span className="font-semibold text-slate-900 block">{d.studentName}</span>
                          <span className="text-[11px] text-slate-500">Parent: {d.parentName}</span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="font-mono text-slate-700 block">{d.startDate}</span>
                          <span className="text-[11px] text-slate-500">{d.timing}</span>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center justify-center gap-1 font-mono text-[11px]">
                            <span
                              className={`w-5 h-5 rounded flex items-center justify-center font-bold ${
                                d.day1Status === "Completed"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-slate-100 text-slate-400"
                              }`}
                              title={`Day 1: ${d.day1Status}`}
                            >
                              1
                            </span>
                            <span
                              className={`w-5 h-5 rounded flex items-center justify-center font-bold ${
                                d.day2Status === "Completed"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-slate-100 text-slate-400"
                              }`}
                              title={`Day 2: ${d.day2Status}`}
                            >
                              2
                            </span>
                            <span
                              className={`w-5 h-5 rounded flex items-center justify-center font-bold ${
                                d.day3Status === "Completed"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-slate-100 text-slate-400"
                              }`}
                              title={`Day 3: ${d.day3Status}`}
                            >
                              3
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3">
                          {d.parentFeedback ? (
                            <span className="font-medium text-slate-800">{d.parentFeedback}</span>
                          ) : (
                            <span className="text-slate-400 italic">Pending feedback</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3">
                          {d.finalResult === "Confirmed" ? (
                            <Badge variant="green" size="sm">
                              Confirmed
                            </Badge>
                          ) : d.finalResult ? (
                            <Badge variant="yellow" size="sm">
                              {d.finalResult}
                            </Badge>
                          ) : (
                            <Badge variant="gray" size="sm">
                              In Progress
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: 50% Commission Ledger */}
        {activeTab === "finance" && !isEditing && (
          <div className="space-y-3">
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-blue-900 block">Agency 50% Commission Policy</span>
                <span className="text-blue-700 text-[11px]">
                  Tutor remits 50% of the first month&apos;s tuition fee directly to the agency upon successful placement.
                </span>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-[11px] text-blue-600 block">Total Due Balance</span>
                <span className="text-base font-black font-mono text-rose-700">
                  ₹{totalCommissionBalance}
                </span>
              </div>
            </div>

            {tutorCommissions.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <DollarSign className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No commissions recorded yet</p>
                <p className="text-xs text-slate-500 mt-1">
                  Commission records are automatically generated when a demo successfully converts to a confirmed tuition.
                </p>
              </div>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100/75 text-slate-600 text-[11px] font-bold border-b border-slate-200 uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Commission ID</th>
                      <th className="py-2.5 px-3">Student Placement</th>
                      <th className="py-2.5 px-3">1st Month Fee</th>
                      <th className="py-2.5 px-3">50% Agency Share</th>
                      <th className="py-2.5 px-3">Amount Paid</th>
                      <th className="py-2.5 px-3">Balance Due</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {tutorCommissions.map((comm) => (
                      <tr key={comm.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-600">{comm.id}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          {comm.studentName}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-700">
                          ₹{comm.firstMonthFee}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-blue-800">
                          ₹{comm.commissionAmount}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">
                          ₹{comm.amountPaid}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-rose-700">
                          ₹{comm.balance}
                        </td>
                        <td className="py-2.5 px-3">
                          <Badge
                            variant={
                              comm.status === "Paid"
                                ? "green"
                                : comm.status === "Partially Paid"
                                ? "yellow"
                                : "red"
                            }
                            size="sm"
                          >
                            {comm.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 5 / Edit Mode: In-Place Profile Editing */}
        {(activeTab === "edit" || isEditing) && (
          <form onSubmit={handleSaveEdit} className="space-y-4 pt-1">
            <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-200 text-blue-900 text-xs">
              <span className="font-bold block">Edit Tutor Profile Details</span>
              <span className="text-blue-700 text-[11px]">
                Update tutor contact, qualifications, subject mastery, locations, and status. Changes are saved immediately.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Tutor Name *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact / WhatsApp Number *
                </label>
                <input
                  type="text"
                  required
                  value={editContact}
                  onChange={(e) => setEditContact(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                <select
                  value={editGender}
                  onChange={(e: any) => setEditGender(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Highest Qualification *
                </label>
                <input
                  type="text"
                  required
                  value={editQualification}
                  onChange={(e) => setEditQualification(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Experience (Years)
                </label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={editExpYears}
                  onChange={(e) => setEditExpYears(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subjects Taught (comma separated)
                </label>
                <input
                  type="text"
                  value={editSubjectsStr}
                  onChange={(e) => setEditSubjectsStr(e.target.value)}
                  placeholder="e.g. Mathematics, Science, Physics"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Classes Taught (comma separated)
                </label>
                <input
                  type="text"
                  value={editClassesStr}
                  onChange={(e) => setEditClassesStr(e.target.value)}
                  placeholder="e.g. Class 8, Class 9, Class 10"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Areas Covered (comma separated)
                </label>
                <input
                  type="text"
                  value={editAreasStr}
                  onChange={(e) => setEditAreasStr(e.target.value)}
                  placeholder="e.g. Civil Lines, Model Town, Ashok Vihar"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Timings
                </label>
                <input
                  type="text"
                  value={editTiming}
                  onChange={(e) => setEditTiming(e.target.value)}
                  placeholder="e.g. 4:00 PM - 7:30 PM"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Expected Monthly Fee (₹)
                </label>
                <input
                  type="number"
                  min="500"
                  step="250"
                  value={editFee}
                  onChange={(e) => setEditFee(Number(e.target.value))}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tutor Availability Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e: any) => setEditStatus(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Available">Available for Tuitions</option>
                  <option value="Demo">Currently in Demo</option>
                  <option value="Running Tuition">Running Tuition</option>
                  <option value="Active Tuition">Active Tuition</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Temporarily Unavailable">Temporarily Unavailable</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Board Affiliations
                </label>
                <input
                  type="text"
                  value={editBoard}
                  onChange={(e) => setEditBoard(e.target.value)}
                  placeholder="e.g. CBSE, ICSE"
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Agency Coordinator Remarks & Notes
              </label>
              <textarea
                rows={3}
                value={editRemarks}
                onChange={(e) => setEditRemarks(e.target.value)}
                placeholder="Notes on communication, punctuality, parent feedback..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setActiveTab("overview");
                }}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                Save Profile Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
