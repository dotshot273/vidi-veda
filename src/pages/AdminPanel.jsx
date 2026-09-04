/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { apiUrl } from "../config";
import { CRMProvider, useCRM } from "../adminComponents/context/CRMContext";
import { AdminDashboard } from "../adminComponents/components/dashboard/AdminDashboard";
import { LeadPipeline } from "../adminComponents/components/leads/LeadPipeline";
import { DemoList } from "../adminComponents/components/demos/DemoList";
import { TeacherList } from "../adminComponents/components/teachers/TeacherList";
import { FinancialLedger } from "../adminComponents/components/finance/FinancialLedger";
import { FollowUpList } from "../adminComponents/components/followups/FollowUpList";
import { ReportsView } from "../adminComponents/components/finance/ReportsView";
import { NewLeadModal } from "../adminComponents/components/leads/NewLeadModal";
import { ScheduleDemoModal } from "../adminComponents/components/demos/ScheduleDemoModal";
import { TeacherMatchingModal } from "../adminComponents/components/teachers/TeacherMatchingModal";
import { StudentProfileModal } from "../adminComponents/components/profile/StudentProfileModal";
import { WhatsAppModal } from "../adminComponents/components/whatsapp/WhatsAppModal";
import {
  RecordRegistrationModal,
  RecordCommissionModal,
} from "../adminComponents/components/finance/PaymentModals";
import { ImportExportModal } from "../adminComponents/components/common/ImportExportModal";
import { AuditHistoryModal } from "../adminComponents/components/common/AuditHistoryModal";
import { TeacherProfileModal } from "../adminComponents/components/teachers/TeacherProfileModal";
import { isToday, isOverdue } from "../adminComponents/utils/dateUtils";
import {
  LayoutDashboard,
  GitPullRequest,
  Calendar,
  GraduationCap,
  DollarSign,
  Clock,
  TrendingUp,
  Plus,
  FileSpreadsheet,
  ShieldCheck,
  Menu,
  X,
  LogOut,
} from "lucide-react";

function CRMApp({ onLogout }) {
  const { leads, teachers, demos, followUps, payments, commissions, loading, crmError } = useCRM();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Global modals state
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [isScheduleDemoOpen, setIsScheduleDemoOpen] = useState(false);
  const [matchingLead, setMatchingLead] = useState(null);
  const [profileLead, setProfileLead] = useState(null);
  const [profileTeacher, setProfileTeacher] = useState(null);
  const [selectedRegPayment, setSelectedRegPayment] = useState(null);
  const [selectedCommission, setSelectedCommission] = useState(null);
  const [importExportOpen, setImportExportOpen] = useState(false);
  const [auditModalOpen, setAuditModalOpen] = useState(false);

  // Pre-configured demo modal from matching
  const [preselectedLeadId, setPreselectedLeadId] = useState(undefined);
  const [preselectedTeacherId, setPreselectedTeacherId] = useState(undefined);

  // WhatsApp modal state
  const [whatsAppModal, setWhatsAppModal] = useState({
    isOpen: false,
    phone: "",
    name: "",
  });

  const [headerSearch, setHeaderSearch] = useState("");

  // Calculate live badges
  const overdueFollowUps = followUps.filter(
    (f) => f.status === "Pending" && (isToday(f.dueDate) || isOverdue(f.dueDate))
  ).length;

  const runningDemosCount = demos.filter(
    (d) =>
      (d.day1Status === "Completed" || d.day2Status === "Completed") &&
      d.day3Status !== "Completed"
  ).length;

  const pendingMoneyCount =
    payments.filter((p) => p.balance > 0).length +
    commissions.filter((c) => c.balance > 0).length;

  const confirmedTuitionsCount = leads.filter(
    (l) =>
      l.status === "Confirmed" ||
      l.status === "Registration Pending" ||
      l.status === "Tuition Started"
  ).length;

  const conversionRate =
    leads.length > 0
      ? `${Math.round((confirmedTuitionsCount / leads.length) * 100)}%`
      : "0%";

  const handleOpenWhatsApp = (phone, name, contextData, template) => {
    setWhatsAppModal({
      isOpen: true,
      phone,
      name,
      contextData,
      defaultTemplate: template || "registration",
    });
  };

  const handleScheduleDemoWithTeacher = (lead, teacherId) => {
    setPreselectedLeadId(lead.id);
    setPreselectedTeacherId(teacherId);
    setIsScheduleDemoOpen(true);
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null },
    { id: "pipeline", label: "Leads & Pipeline", icon: GitPullRequest, badge: leads.length },
    { id: "demos", label: "Demo Tracking", icon: Calendar, badge: runningDemosCount > 0 ? `${runningDemosCount} live` : null, badgeColor: "bg-blue-500/20 text-blue-300 border border-blue-400/40" },
    { id: "teachers", label: "Teacher Base", icon: GraduationCap, badge: null },
    { id: "money", label: "Payments", icon: DollarSign, badge: pendingMoneyCount > 0 ? `${pendingMoneyCount}` : null, badgeColor: "bg-rose-500/20 text-rose-300 border border-rose-400/40" },
    { id: "followups", label: "Follow-ups", icon: Clock, badge: overdueFollowUps > 0 ? `${overdueFollowUps}` : null, badgeColor: "bg-amber-500/20 text-amber-300 border border-amber-400/40" },
    { id: "reports", label: "Analytics", icon: TrendingUp, badge: null },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600 text-sm font-medium">
        Loading CRM from server...
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar Navigation - Professional Polish Slate-900 */}
      <aside className="hidden lg:flex w-64 bg-slate-900 text-white flex-col flex-shrink-0 border-r border-slate-800 select-none">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              TP
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-blue-400 leading-none">
                TuitionPro CRM
              </h1>
              <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-semibold">
                Admin Console
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full p-3 rounded-lg flex items-center justify-between transition-colors text-xs font-medium cursor-pointer ${
                  isActive
                    ? "bg-blue-600/20 text-blue-400 font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                      isActive
                        ? "bg-blue-500/30 text-blue-300"
                        : item.badgeColor || "bg-slate-800 text-slate-300 border border-slate-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Quick Stats Footer */}
        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800 rounded-lg p-3 space-y-2 border border-slate-700/60">
            <p className="text-xs text-slate-500 uppercase font-bold">Quick Stats</p>
            <div className="flex justify-between text-xs text-slate-300">
              <span>Conversion</span>
              <span className="text-green-400 font-bold font-mono">{conversionRate}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-300">
              <span>Active Tuitions</span>
              <span className="text-blue-400 font-bold font-mono">{confirmedTuitionsCount}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-slate-50">
        {/* Header - Professional Polish Clean White */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 flex-shrink-0 z-20">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 lg:hidden rounded-lg hover:bg-slate-100 border border-slate-200"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-slate-400 text-xs">🔍</span>
              </div>
              <input
                type="text"
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md bg-slate-50 text-xs sm:text-sm focus:ring-blue-500 focus:border-blue-500 text-slate-800 placeholder-slate-400"
                placeholder="Search Parent, Tutor Profile, or Lead ID..."
              />

              {/* Instant Search Results Dropdown */}
              {headerSearch.trim().length >= 2 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs">
                  {/* Matching Tutors Section */}
                  <div className="p-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 block">
                      Tutors & Teacher Base
                    </span>
                    {teachers.filter((t) => {
                      const q = headerSearch.toLowerCase();
                      return (
                        t.name.toLowerCase().includes(q) ||
                        t.id.toLowerCase().includes(q) ||
                        (t.contact || t.contactNumber || "").includes(q) ||
                        (t.subjects || []).some((s) => s.toLowerCase().includes(q)) ||
                        (t.areasCovered || []).some((a) => a.toLowerCase().includes(q))
                      );
                    }).length === 0 ? (
                      <div className="px-2 py-1.5 text-slate-400 text-[11px] italic">No tutors match "{headerSearch}"</div>
                    ) : (
                      teachers
                        .filter((t) => {
                          const q = headerSearch.toLowerCase();
                          return (
                            t.name.toLowerCase().includes(q) ||
                            t.id.toLowerCase().includes(q) ||
                            (t.contact || t.contactNumber || "").includes(q) ||
                            (t.subjects || []).some((s) => s.toLowerCase().includes(q)) ||
                            (t.areasCovered || []).some((a) => a.toLowerCase().includes(q))
                          );
                        })
                        .slice(0, 4)
                        .map((t) => (
                          <div
                            key={t.id}
                            onClick={() => {
                              setProfileTeacher(t);
                              setHeaderSearch("");
                            }}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-md bg-blue-600 text-white font-bold font-mono text-[10px] flex items-center justify-center">
                                {t.name.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <span className="font-bold text-slate-900 block">{t.name}</span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  {t.id} • {(t.subjects || []).slice(0, 2).join(", ")}
                                </span>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-100/70 px-2 py-0.5 rounded">
                              View Profile →
                            </span>
                          </div>
                        ))
                    )}
                  </div>

                  {/* Matching Leads Section */}
                  <div className="p-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 block">
                      Students & Leads
                    </span>
                    {leads.filter((l) => {
                      const q = headerSearch.toLowerCase();
                      return (
                        l.studentName.toLowerCase().includes(q) ||
                        l.parentName.toLowerCase().includes(q) ||
                        l.id.toLowerCase().includes(q) ||
                        l.parentContact.includes(q)
                      );
                    }).length === 0 ? (
                      <div className="px-2 py-1.5 text-slate-400 text-[11px] italic">No students match "{headerSearch}"</div>
                    ) : (
                      leads
                        .filter((l) => {
                          const q = headerSearch.toLowerCase();
                          return (
                            l.studentName.toLowerCase().includes(q) ||
                            l.parentName.toLowerCase().includes(q) ||
                            l.id.toLowerCase().includes(q) ||
                            l.parentContact.includes(q)
                          );
                        })
                        .slice(0, 4)
                        .map((l) => (
                          <div
                            key={l.id}
                            onClick={() => {
                              setProfileLead(l);
                              setHeaderSearch("");
                            }}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                          >
                            <div>
                              <span className="font-bold text-slate-900 block">{l.studentName}</span>
                              <span className="text-[10px] text-slate-500">
                                {l.id} • {l.studentClass} • Parent: {l.parentName}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                              View Lead →
                            </span>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              type="button"
              onClick={() => setIsNewLeadOpen(true)}
              className="bg-blue-600 text-white px-3.5 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-semibold shadow-sm hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ New Lead</span>
            </button>

            <button
              type="button"
              onClick={() => setImportExportOpen(true)}
              title="CSV Import / Export"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setAuditModalOpen(true)}
              title="System Audit Log"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>

            <div className="w-8 h-8 rounded-full bg-slate-300 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
              AD
            </div>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                title="Logout"
                className="p-2 text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-md border border-slate-200 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </header>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-800 bg-slate-900 text-white px-4 pt-3 pb-4 space-y-1.5 shadow-lg z-30">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
              <span className="text-xs uppercase font-bold tracking-widest text-slate-400">
                Navigation Menu
              </span>
              <span className="text-xs text-green-400 font-mono font-bold">
                Conv: {conversionRate}
              </span>
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-md text-xs font-medium ${
                    isActive ? "bg-blue-600/20 text-blue-400 font-bold" : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Scrollable Main Content Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-6">
          {crmError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium rounded-xl px-4 py-3">
              {crmError}
            </div>
          )}
          {activeTab === "dashboard" && (
            <AdminDashboard
              onOpenNewLead={() => setIsNewLeadOpen(true)}
              onOpenScheduleDemo={() => {
                setPreselectedLeadId(undefined);
                setPreselectedTeacherId(undefined);
                setIsScheduleDemoOpen(true);
              }}
              onNavigateToTab={(tab) => setActiveTab(tab)}
              onSelectLeadProfile={(lead) => setProfileLead(lead)}
              onOpenWhatsApp={handleOpenWhatsApp}
              onRecordPayment={(payment) => setSelectedRegPayment(payment)}
              onRecordCommission={(comm) => setSelectedCommission(comm)}
            />
          )}

          {activeTab === "pipeline" && (
            <LeadPipeline
              onOpenNewLead={() => setIsNewLeadOpen(true)}
              onSelectLeadProfile={(lead) => setProfileLead(lead)}
              onOpenTeacherMatching={(lead) => setMatchingLead(lead)}
              onScheduleDemoForLead={(lead) => {
                setPreselectedLeadId(lead.id);
                setPreselectedTeacherId(lead.assignedTeacherId);
                setIsScheduleDemoOpen(true);
              }}
              onOpenWhatsApp={handleOpenWhatsApp}
              onSelectTeacherProfile={(teacher) => setProfileTeacher(teacher)}
            />
          )}

          {activeTab === "demos" && (
            <DemoList
              onOpenWhatsApp={handleOpenWhatsApp}
              onSelectTeacherProfile={(teacher) => setProfileTeacher(teacher)}
            />
          )}

          {activeTab === "teachers" && (
            <TeacherList
              onOpenWhatsApp={handleOpenWhatsApp}
              onSelectTeacherProfile={(teacher) => setProfileTeacher(teacher)}
              onScheduleDemo={(teacherId) => {
                setPreselectedLeadId(undefined);
                setPreselectedTeacherId(teacherId);
                setIsScheduleDemoOpen(true);
              }}
              onOpenStudentProfile={(lead) => setProfileLead(lead)}
            />
          )}

          {activeTab === "money" && (
            <FinancialLedger
              onOpenWhatsApp={handleOpenWhatsApp}
              onSelectLeadProfile={(leadId) => {
                const l = leads.find((item) => item.id === leadId);
                if (l) setProfileLead(l);
              }}
              onSelectTeacherProfile={(teacher) => setProfileTeacher(teacher)}
            />
          )}

          {activeTab === "followups" && <FollowUpList onOpenWhatsApp={handleOpenWhatsApp} />}

          {activeTab === "reports" && <ReportsView />}
        </div>

        {/* Status Bar Footer - Professional Polish Crisp Slate-200 */}
        <footer className="h-8 bg-slate-200 border-t border-slate-300 flex items-center px-4 justify-between text-[10px] text-slate-600 uppercase font-semibold tracking-widest flex-shrink-0 select-none">
          <div className="flex space-x-6">
            <span className="flex items-center">
              <span className="text-green-500 mr-1.5 text-xs">●</span> Database Connected
            </span>
            <span className="flex items-center">
              <span className="text-blue-500 mr-1.5 text-xs">●</span> {leads.length} Leads Active
            </span>
          </div>
          <div className="hidden sm:block">Session: Live Synced</div>
        </footer>
      </main>

      {/* Mobile Bottom Quick Bar */}
      <div className="lg:hidden fixed bottom-8 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-3 flex items-center justify-around z-20 shadow-md">
        <button
          type="button"
          onClick={() => setActiveTab("dashboard")}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
            activeTab === "dashboard" ? "text-blue-600" : "text-slate-500"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("pipeline")}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
            activeTab === "pipeline" ? "text-blue-600" : "text-slate-500"
          }`}
        >
          <GitPullRequest className="w-4 h-4" />
          <span>Pipeline</span>
        </button>
        <button
          type="button"
          onClick={() => setIsNewLeadOpen(true)}
          className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-white bg-blue-600 rounded-full w-9 h-9 -mt-3 shadow-md justify-center"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("demos")}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
            activeTab === "demos" ? "text-blue-600" : "text-slate-500"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Demos</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("money")}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
            activeTab === "money" ? "text-blue-600" : "text-slate-500"
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Money</span>
        </button>
      </div>

      {/* GLOBAL MODALS */}
      {/* 1. New Lead Modal */}
      {isNewLeadOpen && (
        <NewLeadModal
          isOpen={isNewLeadOpen}
          onClose={() => setIsNewLeadOpen(false)}
          onCreated={(newLead) => {
            setProfileLead(newLead);
          }}
        />
      )}

      {/* 2. Schedule 3-Day Demo Modal */}
      {isScheduleDemoOpen && (
        <ScheduleDemoModal
          isOpen={isScheduleDemoOpen}
          onClose={() => setIsScheduleDemoOpen(false)}
          preselectedLeadId={preselectedLeadId}
          preselectedTeacherId={preselectedTeacherId}
        />
      )}

      {/* 3. Teacher Matching Modal */}
      {matchingLead && (
        <TeacherMatchingModal
          isOpen={!!matchingLead}
          onClose={() => setMatchingLead(null)}
          lead={matchingLead}
          onScheduleDemoWithTeacher={(teacherId) => {
            handleScheduleDemoWithTeacher(matchingLead, teacherId);
          }}
          onSelectTeacherProfile={(teacher) => setProfileTeacher(teacher)}
        />
      )}

      {/* 4. Student & Parent Profile Modal */}
      {profileLead && (
        <StudentProfileModal
          isOpen={!!profileLead}
          onClose={() => setProfileLead(null)}
          lead={profileLead}
          onSelectTeacherProfile={(teacher) => setProfileTeacher(teacher)}
        />
      )}

      {/* 4b. Teacher Profile Modal (Full Dossier & Commission Tracker) */}
      {profileTeacher && (
        <TeacherProfileModal
          isOpen={!!profileTeacher}
          onClose={() => setProfileTeacher(null)}
          teacher={profileTeacher}
          onOpenWhatsApp={handleOpenWhatsApp}
          onScheduleDemo={(teacherId) => {
            setPreselectedLeadId(undefined);
            setPreselectedTeacherId(teacherId);
            setIsScheduleDemoOpen(true);
          }}
          onOpenStudentProfile={(lead) => setProfileLead(lead)}
        />
      )}

      {/* 5. WhatsApp Message Dispatch Modal */}
      {whatsAppModal.isOpen && (
        <WhatsAppModal
          isOpen={whatsAppModal.isOpen}
          onClose={() => setWhatsAppModal((prev) => ({ ...prev, isOpen: false }))}
          phone={whatsAppModal.phone}
          recipientName={whatsAppModal.name}
          defaultTemplate={whatsAppModal.defaultTemplate}
          contextData={whatsAppModal.contextData}
        />
      )}

      {/* 6. Record Registration Fee Payment Modal */}
      {selectedRegPayment && (
        <RecordRegistrationModal
          isOpen={!!selectedRegPayment}
          onClose={() => setSelectedRegPayment(null)}
          payment={selectedRegPayment}
        />
      )}

      {/* 7. Record Teacher 50% Commission Modal */}
      {selectedCommission && (
        <RecordCommissionModal
          isOpen={!!selectedCommission}
          onClose={() => setSelectedCommission(null)}
          commission={selectedCommission}
        />
      )}

      {/* 8. CSV Import / Export Modal */}
      {importExportOpen && (
        <ImportExportModal
          isOpen={importExportOpen}
          onClose={() => setImportExportOpen(false)}
        />
      )}

      {/* 9. Complete Audit Log History Modal */}
      {auditModalOpen && (
        <AuditHistoryModal
          isOpen={auditModalOpen}
          onClose={() => setAuditModalOpen(false)}
        />
      )}
    </div>
  );
}

export default function AdminPanel() {
  const [token, setToken] = useState(localStorage.getItem("vv_admin_token") || "");
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem("vv_admin_token")));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    if (token) setIsLoggedIn(true);
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setAuthError("Please fill all fields");
      return;
    }
    setAuthLoading(true);
    setAuthError("");
    try {
      const response = await fetch(apiUrl("/api/admin.php?action=login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem("vv_admin_token", data.token);
        setToken(data.token);
        setIsLoggedIn(true);
      } else {
        setAuthError(data.message || "Invalid credentials");
      }
    } catch {
      setAuthError("Could not reach the admin API. Check that /api/admin.php is uploaded.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("vv_admin_token");
    setToken("");
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full space-y-5">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold text-slate-900">Vidi Veda CRM</h1>
            <p className="text-xs uppercase tracking-widest text-blue-600 font-bold">Admin Login</p>
          </div>
          {authError && (
            <div className="bg-rose-50 border-l-4 border-rose-500 p-3 text-rose-700 text-xs font-semibold">{authError}</div>
          )}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm"
              placeholder="admin"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={authLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl disabled:opacity-50"
          >
            {authLoading ? "Signing in..." : "Log In"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <CRMProvider>
      <CRMApp onLogout={handleLogout} />
    </CRMProvider>
  );
}

