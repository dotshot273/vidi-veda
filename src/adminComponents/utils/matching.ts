function includesLoose(haystack, needle) {
  const h = String(haystack || "").toLowerCase();
  const n = String(needle || "").toLowerCase().trim();
  if (!n) return false;
  return h.includes(n) || n.split(/[\s&,/]+/).some((part) => part.length > 2 && h.includes(part));
}

export function matchTeachersForLead(lead, teachers) {
  return (teachers || [])
    .map((teacher) => {
      const matches = [];
      const partialMatches = [];
      const mismatches = [];
      let score = 0;

      const subjects = teacher.subjects || [];
      if (subjects.some((s) => includesLoose(s, lead.subjectRequired) || includesLoose(lead.subjectRequired, s))) {
        score += 40;
        matches.push("Subject match");
      } else {
        mismatches.push("Subject not listed");
      }

      const areas = teacher.areasCovered || [];
      if (areas.some((a) => includesLoose(a, lead.location) || includesLoose(lead.location, a))) {
        score += 30;
        matches.push("Area coverage");
      } else {
        mismatches.push("Area not listed");
      }

      const classes = teacher.classes || teacher.classesTaught || [];
      if (classes.includes(lead.studentClass)) {
        score += 20;
        matches.push("Class match");
      } else {
        partialMatches.push("Class not explicitly listed");
      }

      if (teacher.status === "Available") {
        score += 10;
        matches.push("Currently available");
      }

      return { teacher, score: Math.min(score, 99), matches, partialMatches, mismatches };
    })
    .sort((a, b) => b.score - a.score);
}
