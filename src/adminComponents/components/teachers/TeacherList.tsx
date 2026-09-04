import React, { useState, useMemo } from "react";
import { useCRM } from "../../context/CRMContext";
import { Teacher, TeacherStatus, Lead } from "../../types/crm";
import { Badge } from "../common/Badge";
import {
  Users,
  Search,
  Plus,
  Phone,
  MessageCircle,
  MapPin,
  BookOpen,
  GraduationCap,
  Clock,
  DollarSign,
  Star,
  CheckCircle2,
  Calendar,
  LayoutGrid,
  List,
  UserCheck,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { NewTeacherModal } from "./NewTeacherModal";
import { TeacherProfileModal } from "./TeacherProfileModal";

interface TeacherListProps {
  onOpenWhatsApp: (phone: string, name: string, context?: any) => void;
  onSelectTeacherProfile?: (teacher: Teacher) => void;
  onScheduleDemo?: (teacherId: string) => void;
  onOpenStudentProfile?: (lead: Lead) => void;
}

export const TeacherList: React.FC<TeacherListProps> = ({
  onOpenWhatsApp,
  onSelectTeacherProfile,
  onScheduleDemo,
  onOpenStudentProfile,
}) => {
  const { teachers, demos, leads, commissions, updateTeacher } = useCRM();

  const [isNewTeacherOpen, setIsNewTeacherOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [areaFilter, setAreaFilter] = useState<string>("All");
  const [subjectFilter, setSubjectFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Extract unique areas and subjects for intelligent quick filtering
  const allAreas = useMemo(() => {
    const set = new Set<string>();
    teachers.forEach((t) => (t.areasCovered || []).forEach((a) => set.add(a.trim())));
    return Array.from(set).sort();
  }, [teachers]);

  const allSubjects = useMemo(() => {
    const set = new Set<string>();
    teachers.forEach((t) => (t.subjects || []).forEach((s) => set.add(s.trim())));
    return Array.from(set).sort();
  }, [teachers]);

  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      // Status filter
      if (statusFilter !== "All") {
        if (statusFilter === "Running Tuition" || statusFilter === "Active Tuition") {
          if (t.status !== "Running Tuition" && t.status !== "Active Tuition") return false;
        } else if (t.status !== statusFilter) {
          return false;
        }
      }

      // Area filter
      if (areaFilter !== "All") {
        if (!t.areasCovered?.some((a) => a.toLowerCase().includes(areaFilter.toLowerCase()))) {
          return false;
        }
      }

      // Subject filter
      if (subjectFilter !== "All") {
        if (!t.subjects?.some((s) => s.toLowerCase().includes(subjectFilter.toLowerCase()))) {
          return false;
        }
      }

      // Search query
      if (!search) return true;
      const q = search.toLowerCase();
      const contactStr = t.contact || t.contactNumber || "";
      return (
        t.id.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        contactStr.includes(q) ||
        (t.qualification || "").toLowerCase().includes(q) ||
        (t.board || "").toLowerCase().includes(q) ||
        (t.subjects || []).some((s) => s.toLowerCase().includes(q)) ||
        (t.areasCovered || []).some((a) => a.toLowerCase().includes(q))
      );
    });
  }, [teachers, statusFilter, areaFilter, subjectFilter, search]);

  const availableCount = teachers.filter((t) => t.status === "Available").length;
  const demoCount = teachers.filter((t) => t.status === "Demo").length;
  const runningCount = teachers.filter(
    (t) => t.status === "Running Tuition" || t.status === "Active Tuition"
  ).length;

  const totalCommissionsPaidSum = commissions.reduce((sum, c) => sum + (c.amountPaid || 0), 0);

  const handleOpenProfile = (teacher: Teacher) => {
    if (onSelectTeacherProfile) {
      onSelectTeacherProfile(teacher);
    } else {
      setSelectedTeacher(teacher);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Available":
        return "green";
      case "Demo":
        return "blue";
      case "Running Tuition":
      case "Active Tuition":
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
    <div className="space-y-4">
      {/* Top Header & Stats */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Tutor Roster & Capacity Database
              </h2>
              <span className="text-xs bg-slate-100 text-slate-700 font-mono font-bold px-2 py-0.5 rounded border border-slate-200">
                {teachers.length} Tutors
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage qualifications, subject mastery, locations, and 50% agency commission accounts. Click any tutor to view full profile.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-slate-600">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "grid"
                    ? "bg-white text-blue-600 shadow-xs font-bold"
                    : "hover:text-slate-900"
                }`}
                title="Card Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === "table"
                    ? "bg-white text-blue-600 shadow-xs font-bold"
                    : "hover:text-slate-900"
                }`}
                title="Dense Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsNewTeacherOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Tutor</span>
            </button>
          </div>
        </div>

        {/* Mini stats counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-slate-500 block font-medium">Total Registered</span>
            <span className="text-lg font-black text-slate-900 font-mono">{teachers.length}</span>
          </div>
          <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-200">
            <span className="text-emerald-700 block font-medium">Available for Demos</span>
            <span className="text-lg font-black text-emerald-800 font-mono">{availableCount}</span>
          </div>
          <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-200">
            <span className="text-blue-700 block font-medium">Currently on Demo</span>
            <span className="text-lg font-black text-blue-800 font-mono">{demoCount}</span>
          </div>
          <div className="p-2.5 bg-purple-50/70 rounded-xl border border-purple-200">
            <span className="text-purple-700 block font-medium">Running Tuitions</span>
            <span className="text-lg font-black text-purple-800 font-mono">{runningCount}</span>
          </div>
        </div>

        {/* Search & Multi-Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by Tutor Name, Subject, Area, Qualification, or Phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700 font-medium"
          >
            <option value="All">All Statuses ({teachers.length})</option>
            <option value="Available">Available ({availableCount})</option>
            <option value="Demo">In Demo ({demoCount})</option>
            <option value="Running Tuition">Running Tuition ({runningCount})</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700 font-medium max-w-[170px]"
          >
            <option value="All">All Areas ({allAreas.length})</option>
            {allAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>

          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700 font-medium max-w-[170px]"
          >
            <option value="All">All Subjects ({allSubjects.length})</option>
            {allSubjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* No results placeholder */}
      {filteredTeachers.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">No tutors found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No tutor profiles match your current search query or filter selection. Try clearing filters or register a new tutor.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setStatusFilter("All");
              setAreaFilter("All");
              setSubjectFilter("All");
            }}
            className="mt-3 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 rounded-lg"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* GRID VIEW */}
      {viewMode === "grid" && filteredTeachers.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeachers.map((teacher) => {
            const tutorDemos = demos.filter((d) => d.teacherId === teacher.id);
            const tutorCommissions = commissions.filter((c) => c.teacherId === teacher.id);
            const pendingCommissionTotal = tutorCommissions
              .filter((c) => c.status !== "Paid")
              .reduce((sum, c) => sum + (c.balance || 0), 0);

            const activeAssignedCount =
              leads.filter(
                (l) =>
                  l.assignedTeacherId === teacher.id &&
                  (l.status === "Confirmed" ||
                    l.status === "Registration Pending" ||
                    l.status === "Tuition Started")
              ).length || teacher.activeStudentsCount || 0;

            const contactPhone = teacher.contact || teacher.contactNumber || "";
            const cleanPhone = contactPhone.replace(/\D/g, "");

            return (
              <div
                key={teacher.id}
                className="bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div className="p-4 space-y-3">
                  {/* Card Header with Avatar & Status */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                    <div className="flex items-start gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleOpenProfile(teacher)}
                        className="w-9 h-9 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold font-mono text-xs flex items-center justify-center flex-shrink-0 transition-colors"
                        title="Click to view full tutor profile"
                      >
                        {teacher.name.substring(0, 2).toUpperCase()}
                      </button>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenProfile(teacher)}
                            className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors text-left"
                          >
                            {teacher.name}
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                          <span className="font-mono font-semibold text-slate-500">{teacher.id}</span>
                          <span>•</span>
                          <span>{teacher.gender}</span>
                          <span>•</span>
                          <span>{teacher.teachingExperienceYears} yrs exp</span>
                        </div>
                      </div>
                    </div>

                    <Badge variant={getStatusBadgeVariant(teacher.status)} size="sm" dot>
                      {teacher.status}
                    </Badge>
                  </div>

                  {/* Qualification */}
                  <div className="text-xs">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      Qualification
                    </span>
                    <span className="font-semibold text-slate-800 line-clamp-1">
                      {teacher.qualification}
                    </span>
                  </div>

                  {/* Subjects & Locations */}
                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex items-start gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                          Subjects & Classes
                        </span>
                        <span className="font-medium text-slate-800 line-clamp-2">
                          {(teacher.subjects || []).join(", ")}
                          {teacher.classes && teacher.classes.length > 0 && (
                            <span className="text-slate-500 font-normal text-[11px] block">
                              Classes: {teacher.classes.join(", ")}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                          Localities Handled
                        </span>
                        <span className="text-slate-700 line-clamp-1">
                          {(teacher.areasCovered || []).join(", ")}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {teacher.preferredTimings || teacher.preferredTiming || "Flexible"}
                      </span>
                      <span className="font-mono font-bold text-slate-900 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                        ₹{teacher.expectedNegotiatedFee || teacher.expectedFee || 0}/mo
                      </span>
                    </div>
                  </div>

                  {/* Operational Metrics (Tuitions, Demos, Commission) */}
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 grid grid-cols-3 gap-1 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Active Tuitions</span>
                      <span className="font-bold text-slate-800 font-mono">{activeAssignedCount}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Demos Done</span>
                      <span className="font-bold text-slate-800 font-mono">
                        {tutorDemos.length || teacher.totalDemosDone || 0}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">50% Comm.</span>
                      <span className="font-bold text-emerald-700 font-mono">
                        ₹{teacher.totalCommissionsPaid || 0}
                      </span>
                    </div>
                  </div>

                  {pendingCommissionTotal > 0 && (
                    <div className="p-1.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-[11px] font-semibold flex items-center justify-between">
                      <span>Pending Agency Comm:</span>
                      <span className="font-mono font-bold">₹{pendingCommissionTotal}</span>
                    </div>
                  )}
                </div>

                {/* Footer Action Bar */}
                <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 rounded-b-xl flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenProfile(teacher)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-blue-50 text-blue-700 border border-slate-200 hover:border-blue-300 rounded-lg text-xs font-bold transition-colors"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>View Profile</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {cleanPhone && (
                      <a
                        href={`tel:${cleanPhone}`}
                        className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg transition-colors"
                        title="Call Tutor"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => onOpenWhatsApp(contactPhone, teacher.name, { teacherId: teacher.id })}
                      className="p-1.5 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 rounded-lg transition-colors"
                      title="WhatsApp Tutor"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    </button>

                    <select
                      value={teacher.status}
                      onChange={(e) =>
                        updateTeacher(teacher.id, { status: e.target.value as TeacherStatus })
                      }
                      className="text-[11px] py-1 px-1.5 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Available">Available</option>
                      <option value="Demo">In Demo</option>
                      <option value="Running Tuition">Running Tuition</option>
                      <option value="Active Tuition">Active Tuition</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === "table" && filteredTeachers.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/75 text-slate-600 text-[11px] font-bold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3.5">Tutor</th>
                  <th className="py-3 px-3.5">Qualification & Exp</th>
                  <th className="py-3 px-3.5">Subjects & Classes</th>
                  <th className="py-3 px-3.5">Localities</th>
                  <th className="py-3 px-3.5">Timings & Fee</th>
                  <th className="py-3 px-3.5">Status</th>
                  <th className="py-3 px-3.5 text-center">Active Tuitions</th>
                  <th className="py-3 px-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTeachers.map((teacher) => {
                  const contactPhone = teacher.contact || teacher.contactNumber || "";
                  const cleanPhone = contactPhone.replace(/\D/g, "");
                  const activeAssignedCount =
                    leads.filter(
                      (l) =>
                        l.assignedTeacherId === teacher.id &&
                        (l.status === "Confirmed" ||
                          l.status === "Registration Pending" ||
                          l.status === "Tuition Started")
                    ).length || teacher.activeStudentsCount || 0;

                  return (
                    <tr key={teacher.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => handleOpenProfile(teacher)}
                            className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold font-mono text-xs flex items-center justify-center flex-shrink-0"
                          >
                            {teacher.name.substring(0, 2).toUpperCase()}
                          </button>
                          <div>
                            <button
                              type="button"
                              onClick={() => handleOpenProfile(teacher)}
                              className="font-bold text-slate-900 hover:text-blue-600 transition-colors text-left block"
                            >
                              {teacher.name}
                            </button>
                            <span className="font-mono text-[11px] text-slate-500">
                              {teacher.id} • {teacher.gender}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3.5">
                        <span className="font-semibold text-slate-800 block">
                          {teacher.qualification}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {teacher.teachingExperienceYears} yrs experience
                        </span>
                      </td>

                      <td className="py-3 px-3.5 max-w-[220px]">
                        <span className="font-medium text-slate-800 line-clamp-1 block">
                          {(teacher.subjects || []).join(", ")}
                        </span>
                        <span className="text-[11px] text-slate-500 line-clamp-1">
                          {(teacher.classes || ["Class 6 to 10"]).join(", ")}
                        </span>
                      </td>

                      <td className="py-3 px-3.5 max-w-[180px]">
                        <span className="text-slate-700 line-clamp-1">
                          {(teacher.areasCovered || []).join(", ")}
                        </span>
                      </td>

                      <td className="py-3 px-3.5">
                        <span className="font-mono font-bold text-slate-900 block">
                          ₹{teacher.expectedNegotiatedFee || teacher.expectedFee || 0}/mo
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {teacher.preferredTimings || teacher.preferredTiming || "Flexible"}
                        </span>
                      </td>

                      <td className="py-3 px-3.5">
                        <Badge variant={getStatusBadgeVariant(teacher.status)} size="sm" dot>
                          {teacher.status}
                        </Badge>
                      </td>

                      <td className="py-3 px-3.5 text-center font-mono font-bold text-slate-800">
                        {activeAssignedCount}
                      </td>

                      <td className="py-3 px-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenProfile(teacher)}
                            className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded text-xs transition-colors"
                          >
                            Profile
                          </button>
                          {cleanPhone && (
                            <a
                              href={`tel:${cleanPhone}`}
                              className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
                              title="Call Tutor"
                            >
                              <Phone className="w-3.5 h-3.5 text-emerald-600" />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              onOpenWhatsApp(contactPhone, teacher.name, { teacherId: teacher.id })
                            }
                            className="p-1 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded transition-colors"
                            title="WhatsApp Tutor"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Internal Teacher Profile Modal (if not opened via global parent) */}
      {selectedTeacher && (
        <TeacherProfileModal
          isOpen={!!selectedTeacher}
          onClose={() => setSelectedTeacher(null)}
          teacher={selectedTeacher}
          onOpenWhatsApp={onOpenWhatsApp}
          onScheduleDemo={onScheduleDemo}
          onOpenStudentProfile={onOpenStudentProfile}
        />
      )}

      {/* New Teacher Modal */}
      {isNewTeacherOpen && (
        <NewTeacherModal
          isOpen={isNewTeacherOpen}
          onClose={() => setIsNewTeacherOpen(false)}
          onCreated={(newTutor) => {
            handleOpenProfile(newTutor);
          }}
        />
      )}
    </div>
  );
};
