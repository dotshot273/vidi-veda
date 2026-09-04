export function openWhatsApp(phone, text) {
  const digits = String(phone || "").replace(/\D/g, "");
  const withCountry = digits.length === 10 ? `91${digits}` : digits;
  const url = `https://wa.me/${withCountry}?text=${encodeURIComponent(text || "")}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

export const WhatsAppTemplates = {
  demoScheduled(parent, student, teacher, startDate, endDate, timing, subject) {
    return `Hello ${parent}, this is Vidi Veda. A 3-day demo is scheduled for ${student} with ${teacher} (${subject}). Dates: ${startDate} to ${endDate}, time: ${timing}. Please confirm.`;
  },
  demoFeedback(parent, student, teacher) {
    return `Hello ${parent}, the demo for ${student} with ${teacher} is complete. Please share your feedback and whether you would like to start regular tuition.`;
  },
  registrationReminder(parent, student, balance) {
    return `Hello ${parent}, a registration balance of ₹${balance} is pending for ${student}. Please complete payment to confirm the tuition.`;
  },
  teacherCommissionReminder(teacher, student, balance, dueDate) {
    return `Hello ${teacher}, a commission of ₹${balance} for ${student} is due (${dueDate}). Please share the transfer update.`;
  },
};
