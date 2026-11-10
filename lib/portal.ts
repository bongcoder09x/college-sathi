/** Demo data for the student portal (LMS-lite, attendance, fees, library, hostel, transport, helpdesk). */

export const student = {
  name: "Ananya Dasgupta",
  rollNo: "CS2201",
  program: "B.Tech in Computer Science & Engineering",
  campus: "Main Campus",
  semester: "Semester 5",
  section: "A",
  cgpa: "8.41",
  creditsEarned: 96,
  creditsTotal: 160,
  mentor: "Dr. A. Sengupta",
  email: "ananya.dasgupta@example.com",
  phone: "98300 12345",
  dob: "14/05/2003",
  bloodGroup: "B+",
  address: "23/1 Ballygunge Place, Kolkata 700019",
  guardian: "Subrata Dasgupta (Father) · 98300 98765",
  category: "General",
  idCardNo: "CS-STU-2022-0417",
  hostelRoom: "B-214",
  transportRoute: "R-7",
};

export const todayClasses = [
  { time: "09:00", subject: "Machine Learning", room: "CS-204", faculty: "Dr. A. Sengupta", status: "done" },
  { time: "10:15", subject: "Compiler Design", room: "CS-108", faculty: "Prof. R. Mitra", status: "live" },
  { time: "11:30", subject: "Information Security", room: "CS-301", faculty: "Dr. S. Kar", status: "next" },
  { time: "14:00", subject: "Lab: Networks", room: "Lab 2", faculty: "Prof. M. Bose", status: "next" },
];

const PERIODS = ["09:00 – 10:00", "10:15 – 11:15", "11:30 – 12:30", "14:00 – 16:00"];

export const timetable: Record<string, { subject: string; room: string; kind: "theory" | "lab" | "free" }[]> = {
  Mon: [
    { subject: "Machine Learning", room: "CS-204", kind: "theory" },
    { subject: "Compiler Design", room: "CS-108", kind: "theory" },
    { subject: "Information Security", room: "CS-301", kind: "theory" },
    { subject: "Lab: Networks", room: "Lab 2", kind: "lab" },
  ],
  Tue: [
    { subject: "Compiler Design", room: "CS-108", kind: "theory" },
    { subject: "Machine Learning", room: "CS-204", kind: "theory" },
    { subject: "Capstone Studio", room: "Studio A", kind: "lab" },
    { subject: "Lab: ML", room: "Lab 1", kind: "lab" },
  ],
  Wed: [
    { subject: "Information Security", room: "CS-301", kind: "theory" },
    { subject: "Capstone Studio", room: "Studio A", kind: "lab" },
    { subject: "Machine Learning", room: "CS-204", kind: "theory" },
    { subject: "Library / mentor hour", room: "Library", kind: "free" },
  ],
  Thu: [
    { subject: "Machine Learning", room: "CS-204", kind: "theory" },
    { subject: "Compiler Design", room: "CS-108", kind: "theory" },
    { subject: "Elective: NLP", room: "CS-402", kind: "theory" },
    { subject: "Lab: Security", room: "Lab 3", kind: "lab" },
  ],
  Fri: [
    { subject: "Elective: NLP", room: "CS-402", kind: "theory" },
    { subject: "Information Security", room: "CS-301", kind: "theory" },
    { subject: "Capstone Studio", room: "Studio A", kind: "lab" },
    { subject: "Sports", room: "Ground", kind: "free" },
  ],
};

export const periods = PERIODS;

export const attendance = [
  { code: "CSE501", subject: "Machine Learning", held: 42, attended: 38, faculty: "Dr. A. Sengupta" },
  { code: "CSE502", subject: "Compiler Design", held: 40, attended: 31, faculty: "Prof. R. Mitra" },
  { code: "CSE503", subject: "Information Security", held: 38, attended: 27, faculty: "Dr. S. Kar" },
  { code: "CSE504", subject: "Elective: NLP", held: 24, attended: 22, faculty: "Dr. P. Ghosh" },
  { code: "CSE505", subject: "Capstone Studio", held: 20, attended: 19, faculty: "Prof. M. Bose" },
  { code: "CSE506", subject: "Lab: Networks", held: 18, attended: 12, faculty: "Prof. M. Bose" },
];

export const attendanceHeatmap = (() => {
  // deterministic 12-week grid (0 = absent, 1 = present, 2 = holiday)
  let seed = 41;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  return Array.from({ length: 84 }, (_, i) => {
    const day = i % 7;
    if (day === 6) return 2;
    const r = rnd();
    return r > 0.17 ? 1 : 0;
  });
})();

export const fees = {
  ledger: [
    { date: "2026-07-12", head: "Semester 5 tuition", amount: 64000, status: "Paid", mode: "UPI", receipt: "RCPT-2026-000142" },
    { date: "2026-07-18", head: "Hostel — Block B (semester)", amount: 38000, status: "Paid", mode: "Netbanking", receipt: "RCPT-2026-000188" },
    { date: "2026-08-02", head: "Library & lab fee", amount: 9000, status: "Paid", mode: "Card", receipt: "RCPT-2026-000204" },
    { date: "2026-11-25", head: "Examination fee — Semester 5", amount: 2400, status: "Due", mode: "—", receipt: "—" },
    { date: "2026-12-10", head: "Semester 6 tuition (installment 1)", amount: 32000, status: "Upcoming", mode: "—", receipt: "—" },
  ],
  installments: [
    { name: "Semester 5 — installment 1", amount: 32000, due: "2026-07-10", status: "Paid" },
    { name: "Semester 5 — installment 2", amount: 32000, due: "2026-07-12", status: "Paid" },
    { name: "Semester 6 — installment 1", amount: 32000, due: "2026-12-10", status: "Upcoming" },
    { name: "Semester 6 — installment 2", amount: 32000, due: "2027-02-10", status: "Upcoming" },
  ],
  scholarships: [
    { name: "Swami Vivekananda Merit-cum-Means", amount: 18000, status: "Disbursed", session: "2025-26" },
    { name: "College merit scholarship (top 5%)", amount: 12000, status: "Applied", session: "2026-27" },
  ],
  due: 2400,
};

export const courses = [
  {
    slug: "machine-learning",
    code: "CSE501",
    title: "Machine Learning",
    faculty: "Dr. A. Sengupta",
    credits: 4,
    progress: 68,
    color: "from-brand-500 to-brand-800",
    description: "Supervised and unsupervised learning with a weekly build sprint and a Kaggle-style leaderboard.",
    materials: [
      { title: "Unit 3 — Ensemble methods (slides)", type: "PDF", size: "2.4 MB" },
      { title: "Bias–variance tradeoff (recorded lecture)", type: "Video", size: "48 min" },
      { title: "Lab notebook — feature engineering", type: "Notebook", size: "1.1 MB" },
      { title: "Reference: ESL chapters 7–8", type: "Link", size: "—" },
    ],
    announcements: [
      { at: "2026-11-09", text: "Quiz 3 opens Friday 10 AM, 20 minutes, single attempt." },
      { at: "2026-11-04", text: "Assignment 4 deadline moved to 18 November after the campus festival." },
    ],
    assignments: [
      { id: "A1", title: "Linear regression from scratch", due: "2026-08-22", status: "Graded", score: "18/20", plagiarism: "2%" },
      { id: "A2", title: "Decision tree on campus dataset", due: "2026-09-19", status: "Graded", score: "17/20", plagiarism: "4%" },
      { id: "A3", title: "SVM kernels comparison", due: "2026-10-24", status: "Submitted", score: "—", plagiarism: "3%" },
      { id: "A4", title: "Ensemble pipeline + report", due: "2026-11-18", status: "Open", score: "—", plagiarism: "—" },
    ],
    quizzes: [
      { id: "Q3", title: "Quiz 3 — ensembles", duration: "20 min", questions: 5, status: "Open" },
      { id: "Q2", title: "Quiz 2 — SVM & kernels", duration: "15 min", questions: 4, status: "Completed · 8/10" },
    ],
  },
  {
    slug: "compiler-design",
    code: "CSE502",
    title: "Compiler Design",
    faculty: "Prof. R. Mitra",
    credits: 3,
    progress: 61,
    color: "from-accent-500 to-accent-800",
    description: "Lexing to code generation, with a mini-compiler built in teams of three.",
    materials: [
      { title: "Unit 2 — LL(1) parsing", type: "PDF", size: "1.8 MB" },
      { title: "Dragon book — chapter 4 notes", type: "PDF", size: "3.2 MB" },
      { title: "Mini-compiler starter repo", type: "Link", size: "—" },
    ],
    announcements: [{ at: "2026-11-06", text: "Mini-compiler demo slots are on the notice board — book by 15 November." }],
    assignments: [
      { id: "A1", title: "Lexer for a C subset", due: "2026-09-05", status: "Graded", score: "19/20", plagiarism: "1%" },
      { id: "A2", title: "Recursive descent parser", due: "2026-10-10", status: "Submitted", score: "—", plagiarism: "2%" },
      { id: "A3", title: "Three-address code generator", due: "2026-11-21", status: "Open", score: "—", plagiarism: "—" },
    ],
    quizzes: [{ id: "Q2", title: "Quiz 2 — parsing", duration: "15 min", questions: 4, status: "Completed · 7/10" }],
  },
  {
    slug: "information-security",
    code: "CSE503",
    title: "Information Security",
    faculty: "Dr. S. Kar",
    credits: 3,
    progress: 54,
    color: "from-slate-600 to-slate-900",
    description: "Threat modelling, applied cryptography and a capture-the-flag style lab.",
    materials: [
      { title: "Unit 4 — TLS handshake walkthrough", type: "PDF", size: "1.2 MB" },
      { title: "CTF lab setup guide", type: "PDF", size: "0.9 MB" },
    ],
    announcements: [{ at: "2026-11-02", text: "CTF lab machines reset every Monday 6 AM." }],
    assignments: [
      { id: "A1", title: "Threat model a campus app", due: "2026-09-28", status: "Graded", score: "16/20", plagiarism: "5%" },
      { id: "A2", title: "Padding oracle lab report", due: "2026-11-15", status: "Open", score: "—", plagiarism: "—" },
    ],
    quizzes: [{ id: "Q1", title: "Quiz 1 — cryptography basics", duration: "20 min", questions: 5, status: "Completed · 9/10" }],
  },
  {
    slug: "elective-nlp",
    code: "CSE504",
    title: "Elective: Natural Language Processing",
    faculty: "Dr. P. Ghosh",
    credits: 3,
    progress: 72,
    color: "from-emerald-600 to-teal-900",
    description: "Tokenisation to transformers, with Bengali and Hindi corpus projects.",
    materials: [{ title: "Bengali corpus starter kit", type: "Notebook", size: "4.6 MB" }],
    announcements: [{ at: "2026-11-08", text: "Guest lecture by an industry NLP engineer on 20 November." }],
    assignments: [{ id: "A1", title: "POS tagger for Bengali", due: "2026-11-12", status: "Submitted", score: "—", plagiarism: "3%" }],
    quizzes: [],
  },
  {
    slug: "capstone-studio",
    code: "CSE505",
    title: "Capstone Studio",
    faculty: "Prof. M. Bose",
    credits: 2,
    progress: 45,
    color: "from-rose-600 to-rose-900",
    description: "Team studio where the final-year product is designed, built and reviewed every fortnight.",
    materials: [{ title: "Studio review rubric", type: "PDF", size: "0.4 MB" }],
    announcements: [{ at: "2026-11-07", text: "Sprint 4 review on 21 November — 15 minutes per team." }],
    assignments: [{ id: "S4", title: "Sprint 4 demo + retrospective", due: "2026-11-21", status: "Open", score: "—", plagiarism: "—" }],
    quizzes: [],
  },
];

export const exams = [
  { code: "CSE501", subject: "Machine Learning", date: "2026-12-08", time: "10:00 AM – 1:00 PM", room: "Hall A", seat: "A-14", hallTicket: true },
  { code: "CSE502", subject: "Compiler Design", date: "2026-12-10", time: "10:00 AM – 1:00 PM", room: "Hall A", seat: "A-15", hallTicket: true },
  { code: "CSE503", subject: "Information Security", date: "2026-12-12", time: "2:00 PM – 5:00 PM", room: "Hall B", seat: "B-07", hallTicket: true },
  { code: "CSE504", subject: "Elective: NLP", date: "2026-12-15", time: "10:00 AM – 12:00 PM", room: "CS-402", seat: "C-21", hallTicket: false },
];

export const examResults = [
  { code: "CSE401", subject: "Software Engineering", credits: 4, grade: "A", points: 9 },
  { code: "CSE402", subject: "Web Technologies", credits: 4, grade: "A+", points: 10 },
  { code: "CSE403", subject: "Theory of Computation", credits: 3, grade: "B+", points: 8 },
  { code: "CSE404", subject: "Cloud Foundations", credits: 3, grade: "A", points: 9 },
  { code: "CSE405", subject: "Summer Internship Review", credits: 2, grade: "A+", points: 10 },
];

export const library = {
  loans: [
    { title: "Introduction to Algorithms (CLRS)", author: "Cormen et al.", due: "2026-11-16", fine: 0 },
    { title: "Pattern Recognition and Machine Learning", author: "C. Bishop", due: "2026-11-02", fine: 40 },
    { title: "The Pragmatic Programmer", author: "Hunt & Thomas", due: "2026-11-28", fine: 0 },
  ],
  catalogue: [
    { title: "Deep Learning", author: "Goodfellow, Bengio, Courville", isbn: "978-0262035613", shelf: "CS-3/14", available: 2 },
    { title: "Computer Networks", author: "A. Tanenbaum", isbn: "978-0132126953", shelf: "CS-2/07", available: 0 },
    { title: "Compiler Design in C", author: "A. Holub", isbn: "978-0131550452", shelf: "CS-4/21", available: 3 },
    { title: "Designing Data-Intensive Applications", author: "M. Kleppmann", isbn: "978-1449373320", shelf: "CS-3/02", available: 1 },
    { title: "The Art of Statistics", author: "D. Spiegelhalter", isbn: "978-0241258767", shelf: "ST-1/11", available: 4 },
  ],
  fine: 40,
};

export const hostel = {
  block: "B",
  room: "B-214",
  bed: "Bed 2 (window)",
  roommates: ["Ritika Sen", "Fatima Khan"],
  warden: "Mrs. S. Dutta · +91 98300 55110",
  mess: [
    { day: "Monday", breakfast: "Luchi, alur dom, tea", lunch: "Rice, dal, aloo posto, fish", dinner: "Roti, paneer curry, salad" },
    { day: "Tuesday", breakfast: "Poha, banana, tea", lunch: "Rice, rajma, cabbage fry", dinner: "Roti, egg curry, dessert" },
    { day: "Wednesday", breakfast: "Idli, sambar, chutney", lunch: "Rice, dal, begun bhaja, chicken", dinner: "Roti, mixed veg, curd" },
    { day: "Thursday", breakfast: "Paratha, curd, tea", lunch: "Rice, chole, papad", dinner: "Fried rice, manchurian" },
    { day: "Friday", breakfast: "Upma, tea", lunch: "Rice, dal, fish curry", dinner: "Roti, soya chunk curry" },
    { day: "Saturday", breakfast: "Dosa, chutney", lunch: "Rice, sambar, poriyal", dinner: "Biryani (veg / chicken)" },
    { day: "Sunday", breakfast: "Chirer pulao, tea", lunch: "Special thali", dinner: "Roti, dal makhani, sweet" },
  ],
};

export const transport = {
  route: "R-7",
  bus: "WB 02 AC 4412",
  driver: "B. Mondal · +91 98311 22004",
  stop: "Lake Gardens (Prince Anwar Shah Rd)",
  pickup: "8:42 AM",
  drop: "5:20 PM",
  stops: [
    { name: "Lake Gardens", time: "8:42 AM", status: "done" },
    { name: "Rabindra Sarobar", time: "8:50 AM", status: "done" },
    { name: "Ballygunge Place", time: "8:58 AM", status: "next" },
    { name: "Elgin Road (Main Campus)", time: "9:12 AM", status: "pending" },
  ],
};

export const helpdeskTickets = [
  { id: "HD-1041", subject: "Bonafide certificate for bank", category: "Certificates", status: "In progress", updated: "2026-11-08" },
  { id: "HD-1022", subject: "Hostel water purifier on floor 2", category: "Hostel", status: "Resolved", updated: "2026-10-29" },
  { id: "HD-1008", subject: "Duplicate ID card", category: "Documents", status: "Resolved", updated: "2026-09-14" },
];

export const certificateRequests = [
  { type: "Bonafide certificate", status: "In progress", raised: "2026-11-08", eta: "2026-11-14" },
  { type: "Transfer certificate", status: "Not requested", raised: "—", eta: "—" },
  { type: "Character certificate", status: "Issued", raised: "2026-08-30", eta: "2026-09-04" },
];

export function attendancePercent(held: number, attended: number) {
  if (!held) return 0;
  return Math.round((attended / held) * 1000) / 10;
}
