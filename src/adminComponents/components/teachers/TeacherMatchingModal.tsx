import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { useCRM } from "../../context/CRMContext";
import { Lead, Teacher } from "../../types/crm";
import { matchTeachersForLead } from "../../utils/matching";
import { Badge } from "../common/Badge";
import {
  Check,
  Calendar,
  Sparkles,
  MapPin,
  BookOpen,
  GraduationCap,
  Clock,
  UserCheck,
  Phone,
} from "lucide-react";

interface TeacherMatchingModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
  onScheduleDemoWithTeacher?: (teacherId: string) => void;
  onSelectTeacherProfile?: (teacher: Teacher) => void;
}

export const TeacherMatchingModal: React.FC<TeacherMatchingModalProps> = ({
  isOpen,
  onClose,
  lead,
  onScheduleDemoWithTeacher,
  onSelectTeacherProfile,
}) => {
  const { teachers, assignTeacherToLead } = useCRM();
  const [filterOnlyAvailable, setFilterOnlyAvailable] = useState(false);
  const [assignedSuccessId, setAssignedSuccessId] = useState<string | null>(null);

  const matchedList = matchTeachersForLead(lead, teachers);

  const displayedMatches = filterOnlyAvailable
    ? matchedList.filter((m) => m.teacher.status === "Available")
    : matchedList;

  const handleAssign = (teacherId: string) => {
    assignTeacherToLead(lead.id, teacherId);
    setAssignedSuccessId(teacherId);
    setTimeout(() => {
      setAssignedSuccessId(null);
      onClose();
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Intelligent Tutor Matching"
      subtitle={`Finding suitable home tutors for ${lead.studentName} (${lead.studentClass}, ${lead.subjectRequired}) in ${lead.location}`}
      maxWidth="3xl"
    >
      <div className="space-y-4">
        {/* Lead requirement summary strip */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-slate-800 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              {lead.location}
            </span>
            <span className="font-semibold text-slate-800 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-blue-500" />
              {lead.subjectRequired}
            </span>
            <span className="font-semibold text-slate-800 flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
              {lead.studentClass}
            </span>
            <span className="font-semibold text-slate-800 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              {lead.preferredTiming}
            </span>
          </div>

          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-600 select-none">
            <input
              type="checkbox"
              checked={filterOnlyAvailable}
              onChange={(e) => setFilterOnlyAvailable(e.target.checked)}
              className="rounded text-blue-600 w-3.5 h-3.5"
            />
            <span>Show Only Available</span>
          </label>
        </div>

        {/* Shortlist list */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {displayedMatches.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p className="text-sm font-medium">No matching tutors found with these filters.</p>
              <p className="text-xs mt-1">Try unchecking &quot;Show Only Available&quot; or add a new teacher.</p>
            </div>
          ) : (
            displayedMatches.map(({ teacher, score, matches, partialMatches, mismatches }) => {
              const isCurrentlyAssigned = lead.assignedTeacherId === teacher.id;
              const isJustAssigned = assignedSuccessId === teacher.id;

              return (
                <div
                  key={teacher.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isCurrentlyAssigned
                      ? "bg-blue-50/40 border-blue-300 ring-2 ring-blue-100"
                      : "bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-bold text-slate-900">{teacher.name}</h4>
                        <span className="text-xs text-slate-400">({teacher.id})</span>
                        <Badge
                          variant={
                            teacher.status === "Available"
                              ? "green"
                              : teacher.status === "Demo"
                              ? "blue"
                              : "yellow"
                          }
                          size="sm"
                          dot
                        >
                          {teacher.status}
                        </Badge>
                        <Badge
                          variant={score >= 80 ? "green" : score >= 60 ? "blue" : "yellow"}
                          size="sm"
                        >
                          <Sparkles className="w-3 h-3 mr-0.5" />
                          {score}% Match
                        </Badge>
                      </div>

                      <p className="text-xs text-slate-600 font-medium">
                        {teacher.gender} • {teacher.qualification} • {teacher.teachingExperienceYears} yrs experience
                      </p>

                      <p className="text-xs text-slate-500">
                        <span className="font-semibold text-slate-600">Areas:</span>{" "}
                        {teacher.areasCovered.join(", ")} |{" "}
                        <span className="font-semibold text-slate-600">Subjects:</span>{" "}
                        {teacher.subjects.join(", ")}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0 pt-2 sm:pt-0">
                      {onSelectTeacherProfile && (
                        <button
                          type="button"
                          onClick={() => onSelectTeacherProfile(teacher)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                          title="View complete credentials, tuitions, and finance"
                        >
                          Profile
                        </button>
                      )}

                      {isJustAssigned ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                          <Check className="w-4 h-4" /> Assigned!
                        </span>
                      ) : isCurrentlyAssigned ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-100 px-3 py-1.5 rounded-lg">
                          <UserCheck className="w-4 h-4" /> Assigned Tutor
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAssign(teacher.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          Assign Tutor
                        </button>
                      )}

                      {onScheduleDemoWithTeacher && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onScheduleDemoWithTeacher(teacher.id);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          Book 3-Day Demo
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Matching reasons pills */}
                  <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {matches.map((m, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1 font-medium"
                      >
                        <Check className="w-3 h-3 text-emerald-600" />
                        {m}
                      </span>
                    ))}
                    {mismatches.slice(0, 1).map((mm, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md"
                      >
                        {mm}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
