/** Demo data for the parent, faculty and HOD / academics portals. */

export const parent = {
  name: "Subrata Dasgupta",
  phone: "98300 98765",
  email: "subrata.d@example.com",
};

export const children = [
  {
    id: "ananya",
    name: "Ananya Dasgupta",
    rollNo: "CS2201",
    program: "B.Tech in Computer Science & Engineering",
    campus: "Main Campus",
    semester: "Semester 5",
    attendance: 81.9,
    attendanceToday: "Present · 3 of 4 classes",
    feeDue: 2400,
    busEta: "8 min",
    busStop: "Ballygunge Place",
    latestMarks: [
      { subject: "Machine Learning", type: "Class test 2", score: "18/20" },
      { subject: "Compiler Design", type: "Assignment 2", score: "17/20" },
      { subject: "Information Security", type: "Quiz 1", score: "9/10" },
    ],
    terms: [
      { term: "Sem 3", value: 8.12 },
      { term: "Sem 4", value: 8.62 },
      { term: "Sem 5 (internal)", value: 8.44 },
    ],
  },
  {
    id: "riddhi",
    name: "Riddhi Dasgupta",
    rollNo: "BBA2408",
    program: "Bachelor of Business Administration",
    campus: "North Campus",
    semester: "Semester 3",
    attendance: 92.4,
    attendanceToday: "Present · 2 of 2 classes",
    feeDue: 0,
    busEta: "18 min",
    busStop: "Sevoke Road",
    latestMarks: [
      { subject: "Marketing Management", type: "Case presentation", score: "22/25" },
      { subject: "Business Statistics", type: "Class test 1", score: "16/20" },
    ],
    terms: [
      { term: "Sem 1", value: 7.85 },
      { term: "Sem 2", value: 8.1 },
      { term: "Sem 3 (internal)", value: 8.36 },
    ],
  },
];

export const parentMessages = [
  { from: "Dr. A. Sengupta", role: "Class mentor", at: "Yesterday, 6:12 PM", text: "Ananya's capstone sprint review went well. She should revise ensemble methods before the quiz on Friday." },
  { from: "Accounts office", role: "Fees", at: "Mon, 11:04 AM", text: "The examination fee of ₹2,400 is due on 25 November. It can be paid from the parent portal." },
];

export const ptmSlots = [
  { date: "2026-11-16", slots: ["10:00", "10:20", "10:40", "11:00", "11:20"] },
  { date: "2026-11-17", slots: ["14:00", "14:20", "14:40", "15:00", "15:20"] },
];

export const faculty = {
  name: "Dr. A. Sengupta",
  code: "FAC-114",
  department: "Computer Science",
  campus: "Main Campus",
  designation: "Associate Professor",
  email: "a.sengupta@collegesathi.edu.in",
};

export const facultyLectures = [
  { time: "09:00", subject: "Machine Learning", section: "CSE-5A", room: "CS-204", attendance: "pending" },
  { time: "10:15", subject: "Machine Learning", section: "CSE-5B", room: "CS-205", attendance: "pending" },
  { time: "11:30", subject: "Capstone Studio", section: "CSE-5A", room: "Studio A", attendance: "marked" },
  { time: "14:00", subject: "Mentoring hour", section: "Mentees", room: "Cabin 12", attendance: "—" },
];

export const facultyTimetable = [
  { day: "Mon", slots: ["CSE-5A · ML", "CSE-5B · ML", "CSE-5A · Capstone", "Mentoring"] },
  { day: "Tue", slots: ["—", "CSE-5A · ML", "CSE-5B · Lab", "CSE-5B · ML"] },
  { day: "Wed", slots: ["CSE-5B · ML", "—", "CSE-5A · Capstone", "Department meeting"] },
  { day: "Thu", slots: ["CSE-5A · ML", "CSE-5B · ML", "CSE-5A · Lab", "—"] },
  { day: "Fri", slots: ["CSE-5B · ML", "CSE-5A · Capstone", "—", "Mentoring"] },
];

export const substitutions = [
  { id: "SUB-31", date: "2026-11-12", slot: "10:15 · CSE-5B", reason: "Department review meeting", status: "Requested" },
  { id: "SWP-09", date: "2026-11-13", slot: "09:00 · CSE-5A", reason: "Swap with Prof. Mitra", status: "Approved" },
];

export const sections = [
  { id: "CSE-5A", students: 58, sessions: 42, avgAttendance: 84 },
  { id: "CSE-5B", students: 56, sessions: 40, avgAttendance: 78 },
];

export const facultyCourses = [
  { code: "CSE501", title: "Machine Learning", sections: ["CSE-5A", "CSE-5B"], materials: 14, pendingGrading: 12 },
  { code: "CSE505", title: "Capstone Studio", sections: ["CSE-5A"], materials: 6, pendingGrading: 3 },
];

export const gradebookStudents = [
  { roll: "CS2201", name: "Ananya Dasgupta", ct1: 18, ct2: 17, assignment: 19, lab: 20 },
  { roll: "CS2202", name: "Ritwik Mondal", ct1: 15, ct2: 14, assignment: 16, lab: 17 },
  { roll: "CS2203", name: "Sohini Roy", ct1: 19, ct2: 20, assignment: 18, lab: 19 },
  { roll: "CS2204", name: "Arafat Hossain", ct1: 12, ct2: 13, assignment: 14, lab: 15 },
  { roll: "CS2205", name: "Priyanka Ghosh", ct1: 17, ct2: 18, assignment: 17, lab: 18 },
  { roll: "CS2206", name: "Tania Saha", ct1: 16, ct2: 15, assignment: 15, lab: 16 },
];

export const mentees = [
  { roll: "CS2201", name: "Ananya Dasgupta", attendance: 81.9, cgpa: "8.41", alert: false },
  { roll: "CS2202", name: "Ritwik Mondal", attendance: 72.4, cgpa: "7.88", alert: true },
  { roll: "CS2204", name: "Arafat Hossain", attendance: 68.2, cgpa: "7.02", alert: true },
  { roll: "CS2205", name: "Priyanka Ghosh", attendance: 88.6, cgpa: "8.66", alert: false },
  { roll: "CS2206", name: "Tania Saha", attendance: 90.1, cgpa: "8.72", alert: false },
];

export const staffLeaves = {
  balance: { casual: 8, earned: 12, medical: 5 },
  history: [
    { id: "SL-42", from: "2026-09-22", to: "2026-09-24", type: "Casual", status: "Approved" },
    { id: "SL-51", from: "2026-11-19", to: "2026-11-19", type: "Casual", status: "Pending" },
  ],
};

export const payslips = [
  { month: "October 2026", gross: 118000, net: 104400, status: "Available" },
  { month: "September 2026", gross: 118000, net: 104400, status: "Available" },
  { month: "August 2026", gross: 118000, net: 103900, status: "Available" },
];

export const department = {
  name: "Computer Science & Engineering",
  hod: "Dr. S. Bhattacharya",
  faculty: 24,
  programmes: 3,
  students: 486,
  attendanceTrend: [
    { week: "W1", value: 86 },
    { week: "W2", value: 84 },
    { week: "W3", value: 81 },
    { week: "W4", value: 79 },
    { week: "W5", value: 82 },
    { week: "W6", value: 80 },
  ],
  syllabus: [
    { code: "CSE501", subject: "Machine Learning", faculty: "Dr. A. Sengupta", coverage: 68 },
    { code: "CSE502", subject: "Compiler Design", faculty: "Prof. R. Mitra", coverage: 61 },
    { code: "CSE503", subject: "Information Security", faculty: "Dr. S. Kar", coverage: 54 },
    { code: "CSE504", subject: "Elective: NLP", faculty: "Dr. P. Ghosh", coverage: 72 },
    { code: "CSE505", subject: "Capstone Studio", faculty: "Prof. M. Bose", coverage: 45 },
  ],
  facultyLoad: [
    { name: "Dr. A. Sengupta", hours: 16, sections: 2, max: 20 },
    { name: "Prof. R. Mitra", hours: 18, sections: 3, max: 20 },
    { name: "Dr. S. Kar", hours: 14, sections: 2, max: 20 },
    { name: "Dr. P. Ghosh", hours: 12, sections: 2, max: 18 },
    { name: "Prof. M. Bose", hours: 19, sections: 3, max: 20 },
  ],
};

export const allocations = [
  { code: "CSE501", subject: "Machine Learning", faculty: "Dr. A. Sengupta", section: "CSE-5A", hours: 4 },
  { code: "CSE501", subject: "Machine Learning", faculty: "Dr. A. Sengupta", section: "CSE-5B", hours: 4 },
  { code: "CSE502", subject: "Compiler Design", faculty: "Prof. R. Mitra", section: "CSE-5A", hours: 3 },
  { code: "CSE503", subject: "Information Security", faculty: "Dr. S. Kar", section: "CSE-5A", hours: 3 },
  { code: "CSE504", subject: "Elective: NLP", faculty: "Dr. P. Ghosh", section: "CSE-5A", hours: 3 },
  { code: "CSE505", subject: "Capstone Studio", faculty: "Prof. M. Bose", section: "CSE-5A", hours: 4 },
];

export const marksApprovals = [
  { code: "CSE501", subject: "Machine Learning", faculty: "Dr. A. Sengupta", submitted: "2026-11-08", entries: 58, status: "Awaiting review" },
  { code: "CSE502", subject: "Compiler Design", faculty: "Prof. R. Mitra", submitted: "2026-11-07", entries: 58, status: "Awaiting review" },
  { code: "CSE503", subject: "Information Security", faculty: "Dr. S. Kar", submitted: "2026-11-05", entries: 57, status: "Approved" },
  { code: "CSE505", subject: "Capstone Studio", faculty: "Prof. M. Bose", submitted: "2026-11-02", entries: 58, status: "Returned" },
];

export const shortageList = [
  { roll: "CS2204", name: "Arafat Hossain", section: "CSE-5A", attendance: 68.2, guardian: "98300 55667" },
  { roll: "CS2202", name: "Ritwik Mondal", section: "CSE-5A", attendance: 72.4, guardian: "98311 22334" },
  { roll: "CS2211", name: "Md. Imran Alam", section: "CSE-5B", attendance: 66.8, guardian: "98333 66778" },
  { roll: "CS2217", name: "Sneha Barman", section: "CSE-5B", attendance: 73.9, guardian: "98355 88990" },
];

export const builderSlots = ["09:00", "10:15", "11:30", "14:00"];
export const builderDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export const publishedTimetable: Record<string, string[]> = {
  Mon: ["CSE501 · 5A · CS-204", "CSE502 · 5A · CS-108", "CSE503 · 5A · CS-301", "Lab: Networks · 5A"],
  Tue: ["CSE502 · 5B · CS-108", "CSE501 · 5B · CS-205", "CSE505 · 5A · Studio A", "—"],
  Wed: ["CSE503 · 5B · CS-302", "CSE504 · 5A · CS-402", "CSE501 · 5A · CS-204", "Library"],
  Thu: ["CSE501 · 5B · CS-205", "CSE502 · 5A · CS-108", "CSE504 · 5B · CS-402", "Lab: Security · 5A"],
  Fri: ["CSE504 · 5A · CS-402", "CSE503 · 5A · CS-301", "CSE505 · 5A · Studio A", "Sports"],
};
