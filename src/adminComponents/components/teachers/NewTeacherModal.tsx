import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { useCRM } from "../../context/CRMContext";
import { TeacherStatus, Teacher } from "../../types/crm";
import { UserPlus, BookOpen, MapPin, Clock, DollarSign } from "lucide-react";

interface NewTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (teacher: Teacher) => void;
}

export const NewTeacherModal: React.FC<NewTeacherModalProps> = ({ isOpen, onClose, onCreated }) => {
  const { addTeacher } = useCRM();

  const [name, setName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Female");
  const [qualification, setQualification] = useState("M.Sc Mathematics, B.Ed");
  const [subjectsStr, setSubjectsStr] = useState("Mathematics, Science, Physics");
  const [classesStr, setClassesStr] = useState("Class 8, Class 9, Class 10, Class 11");
  const [areasStr, setAreasStr] = useState("Civil Lines, Model Town, Ashok Vihar");
  const [preferredTiming, setPreferredTiming] = useState("4:00 PM - 8:00 PM");
  const [expectedFee, setExpectedFee] = useState(4500);
  const [experience, setExperience] = useState(4);
  const [demoReadiness, setDemoReadiness] = useState<"Ready" | "Needs Notice">("Ready");
  const [status, setStatus] = useState<TeacherStatus>("Available");
  const [rating, setRating] = useState(4.8);
  const [notes, setNotes] = useState("Punctual and very strong in CBSE board concepts.");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contactNumber) return;

    const subjectsArr = subjectsStr.split(",").map((s) => s.trim()).filter(Boolean);
    const classesArr = classesStr.split(",").map((s) => s.trim()).filter(Boolean);
    const areasArr = areasStr.split(",").map((s) => s.trim()).filter(Boolean);

    const created = await addTeacher({
      name,
      contact: contactNumber,
      contactNumber,
      email,
      gender,
      qualification,
      graduation: qualification,
      board: "CBSE, ICSE",
      subjects: subjectsArr,
      classes: classesArr,
      classesTaught: classesArr,
      areasCovered: areasArr,
      preferredTimings: preferredTiming,
      preferredTiming,
      expectedNegotiatedFee: Number(expectedFee),
      expectedFee: Number(expectedFee),
      teachingExperienceYears: Number(experience),
      experience: `${experience} years tutoring experience`,
      availability: "Available for new tuitions",
      demoReadiness,
      status,
      rating: Number(rating),
      notes,
      remarks: notes,
    });

    if (onCreated && created) {
      onCreated(created);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Home Tutor to Roster"
      subtitle="The system generates a unique Teacher ID and prepares tutor for intelligent matching."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tutor Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Anjali Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contact / WhatsApp Phone *
            </label>
            <input
              type="tel"
              required
              placeholder="10-digit mobile number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Gender *</label>
            <select
              value={gender}
              onChange={(e: any) => setGender(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Qualification *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. M.Sc, B.Ed, B.Tech"
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Experience (Years) *
            </label>
            <input
              type="number"
              min={0}
              max={40}
              value={experience}
              onChange={(e) => setExperience(Number(e.target.value))}
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Subjects Taught (comma separated) *
          </label>
          <input
            type="text"
            required
            placeholder="Mathematics, Physics, Chemistry, English"
            value={subjectsStr}
            onChange={(e) => setSubjectsStr(e.target.value)}
            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Classes Taught (comma separated) *
            </label>
            <input
              type="text"
              required
              placeholder="Class 8, Class 9, Class 10, Class 11"
              value={classesStr}
              onChange={(e) => setClassesStr(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Locations / Areas Covered (comma separated) *
            </label>
            <input
              type="text"
              required
              placeholder="Civil Lines, Model Town, Rohini"
              value={areasStr}
              onChange={(e) => setAreasStr(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Preferred Timing
            </label>
            <input
              type="text"
              placeholder="4:00 PM - 8:00 PM"
              value={preferredTiming}
              onChange={(e) => setPreferredTiming(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
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
              value={expectedFee}
              onChange={(e) => setExpectedFee(Number(e.target.value))}
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Current Availability
            </label>
            <select
              value={status}
              onChange={(e: any) => setStatus(e.target.value)}
              className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="Available">Available for New Demos</option>
              <option value="Demo">Currently in Demo</option>
              <option value="Running Tuition">Running Tuition</option>
              <option value="Inactive">Inactive / On Leave</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Teacher Performance Notes
          </label>
          <input
            type="text"
            placeholder="Special strengths, behavior, reliability notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
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
            <UserPlus className="w-4 h-4" />
            Add Teacher to Database
          </button>
        </div>
      </form>
    </Modal>
  );
};
