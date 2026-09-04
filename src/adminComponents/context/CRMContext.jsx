import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { apiUrl } from "../../config";

const CRMContext = createContext(null);

const emptyState = {
  teachers: [],
  leads: [],
  demos: [],
  tuitions: [],
  payments: [],
  commissions: [],
  followUps: [],
  auditLogs: [],
};

function parseCsv(text) {
  const lines = String(text || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return [];
  const start = lines[0].toLowerCase().includes("parent") || lines[0].toLowerCase().includes("name") ? 1 : 0;
  return lines.slice(start).map((line) => line.split(",").map((c) => c.trim().replace(/^"|"$/g, "")));
}

function downloadCsv(filename, rows) {
  const csv = rows.map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function authHeaders() {
  const token = localStorage.getItem("vv_admin_token") || "";
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

async function crmRequest(action, { method = "GET", body } = {}) {
  const url = apiUrl(`/api/admin.php?action=${action}`);
  const response = await fetch(url, {
    method,
    headers: authHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await response.json().catch(() => null);
  if (!json) {
    throw new Error("The admin API did not return JSON. Upload admin.php and crm.inc.php to /api/.");
  }
  if (!json.success) {
    throw new Error(json.message || "CRM request failed");
  }
  return json;
}

export function CRMProvider({ children }) {
  const [state, setState] = useState(emptyState);
  const [loading, setLoading] = useState(true);
  const [crmError, setCrmError] = useState("");

  const applySnapshot = (data) => {
    if (!data) return;
    setState({
      teachers: data.teachers || [],
      leads: data.leads || [],
      demos: data.demos || [],
      tuitions: data.tuitions || [],
      payments: data.payments || [],
      commissions: data.commissions || [],
      followUps: data.followUps || [],
      auditLogs: data.auditLogs || [],
    });
  };

  const refresh = useCallback(async () => {
    const json = await crmRequest("get_crm");
    applySnapshot(json.data);
    return json.data;
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setCrmError("");
      try {
        const json = await crmRequest("get_crm");
        if (!cancelled) applySnapshot(json.data);
      } catch (err) {
        if (!cancelled) setCrmError(err.message || "Could not load CRM data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const mutate = async (action, body) => {
    setCrmError("");
    const json = await crmRequest(action, { method: "POST", body });
    applySnapshot(json.data);
    return json;
  };

  const api = useMemo(() => {
    const addLead = async (payload) => {
      const json = await mutate("add_lead", payload);
      return json.lead;
    };

    const updateLeadStatus = async (id, status) => {
      await mutate("update_lead_status", { id, status });
    };

    const addTeacher = async (payload) => {
      const json = await mutate("add_teacher", payload);
      return json.teacher;
    };

    const updateTeacher = async (id, patch) => {
      await mutate("update_teacher", { id, patch });
    };

    const assignTeacherToLead = async (leadId, teacherId) => {
      await mutate("assign_teacher", { leadId, teacherId });
    };

    const scheduleDemo = async ({ leadId, teacherId, startDate, timing, remarks }) => {
      const json = await mutate("schedule_demo", { leadId, teacherId, startDate, timing, remarks });
      return json.demo;
    };

    const updateDemoDayStatus = async (demoId, day, status) => {
      await mutate("update_demo_day", { demoId, day, status });
    };

    const submitDemoFeedback = async (demoId, payload) => {
      await mutate("submit_demo_feedback", { demoId, ...payload });
    };

    const recordPayment = async (id, payload) => {
      await mutate("record_payment", { id, ...payload });
    };

    const recordCommissionPayment = async (id, payload) => {
      await mutate("record_commission", { id, ...payload });
    };

    const sendPaymentReminder = async (kind, id) => {
      await mutate("send_reminder", { kind, id });
    };

    const addFollowUp = async (payload) => {
      const json = await mutate("add_followup", payload);
      return json.followUp;
    };

    const updateFollowUp = async (id, patch) => {
      await mutate("update_followup", { id, patch });
    };

    const exportDataAsCSV = (kind) => {
      if (kind === "leads") {
        downloadCsv("leads.csv", [
          ["ID", "Parent", "Contact", "Student", "Class", "Subject", "Location", "Status", "Fee"],
          ...state.leads.map((l) => [l.id, l.parentName, l.parentContact, l.studentName, l.studentClass, l.subjectRequired, l.location, l.status, l.expectedMonthlyFee]),
        ]);
      } else if (kind === "teachers") {
        downloadCsv("teachers.csv", [
          ["ID", "Name", "Contact", "Subjects", "Areas", "Status"],
          ...state.teachers.map((t) => [t.id, t.name, t.contact, (t.subjects || []).join("; "), (t.areasCovered || []).join("; "), t.status]),
        ]);
      } else if (kind === "tuitions") {
        downloadCsv("tuitions.csv", [
          ["ID", "Student", "Teacher", "Fee", "Status"],
          ...state.tuitions.map((t) => [t.id, t.studentName, t.teacherName, t.monthlyTuitionFee, t.tuitionStatus]),
        ]);
      } else if (kind === "payments") {
        downloadCsv("payments.csv", [
          ["ID", "Student", "Due", "Paid", "Balance", "Status"],
          ...state.payments.map((p) => [p.id, p.studentName, p.amountDue, p.amountPaid, p.balance, p.status]),
        ]);
      } else if (kind === "commissions") {
        downloadCsv("commissions.csv", [
          ["ID", "Teacher", "Student", "Amount", "Paid", "Balance", "Status"],
          ...state.commissions.map((c) => [c.id, c.teacherName, c.studentName, c.commissionAmount, c.amountPaid, c.balance, c.status]),
        ]);
      }
    };

    const importLeadsFromCSV = async (text) => {
      const rows = parseCsv(text);
      const leads = rows
        .filter((cols) => cols[0])
        .map((cols) => ({
          parentName: cols[0],
          parentContact: cols[1] || "",
          studentName: cols[2] || cols[0],
          studentClass: cols[3] || "Class 10",
          subjectRequired: cols[4] || "",
          location: cols[5] || "",
          expectedMonthlyFee: Number(cols[6]) || 4000,
        }));
      const json = await mutate("import_leads", { leads });
      return { imported: json.imported || 0, skipped: json.skipped || 0 };
    };

    const importTeachersFromCSV = async (text) => {
      const rows = parseCsv(text);
      const teachers = rows
        .filter((cols) => cols[0])
        .map((cols) => ({
          name: cols[0],
          contact: cols[1] || "",
          subjects: (cols[2] || "Mathematics").split(";").map((s) => s.trim()),
          areasCovered: (cols[3] || "").split(";").map((s) => s.trim()).filter(Boolean),
          qualification: cols[4] || "",
        }));
      const json = await mutate("import_teachers", { teachers });
      return { imported: json.imported || 0, skipped: json.skipped || 0 };
    };

    const resetToSampleData = async () => {
      await mutate("reset_crm", {});
    };

    return {
      ...state,
      loading,
      crmError,
      refresh,
      addLead,
      updateLeadStatus,
      addTeacher,
      updateTeacher,
      assignTeacherToLead,
      scheduleDemo,
      updateDemoDayStatus,
      submitDemoFeedback,
      recordPayment,
      recordCommissionPayment,
      sendPaymentReminder,
      addFollowUp,
      updateFollowUp,
      exportDataAsCSV,
      importLeadsFromCSV,
      importTeachersFromCSV,
      resetToSampleData,
    };
  }, [state, loading, crmError, refresh]);

  return <CRMContext.Provider value={api}>{children}</CRMContext.Provider>;
}

export function useCRM() {
  const ctx = useContext(CRMContext);
  if (!ctx) throw new Error("useCRM must be used inside CRMProvider");
  return ctx;
}
