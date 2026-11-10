import type { Application, AppStatus, Enquiry } from "./types";

/**
 * DEMO-ONLY in-memory store.
 * Everything the "backend" needs lives here: no database, no payment gateway,
 * no SMS/email provider. Data resets when the dev server restarts.
 */
type Store = {
  applications: Application[];
  enquiries: Enquiry[];
  otps: Record<string, string>;
  seq: number;
  enquirySeq: number;
};

const g = globalThis as unknown as { __csStore?: Store };

function emptyPersonal() {
  return {
    fullName: "",
    dob: "",
    gender: "",
    category: "",
    idType: "Aadhaar",
    idNumber: "",
    address: "",
    city: "",
    state: "West Bengal",
    pin: "",
    photoName: "",
  };
}

function emptyGuardian() {
  return { name: "", relation: "", phone: "", email: "", occupation: "", annualIncome: "" };
}

function newApplication(id: string, email: string, phone: string): Application {
  const now = new Date().toISOString();
  return {
    id,
    createdAt: now,
    updatedAt: now,
    step: 1,
    status: "draft",
    applicant: { email, phone, otpVerified: true },
    preferences: [
      { programSlug: "", campusSlug: "" },
      { programSlug: "", campusSlug: "" },
      { programSlug: "", campusSlug: "" },
    ],
    personal: emptyPersonal(),
    guardian: emptyGuardian(),
    academics: [
      { level: "Class 10", board: "", school: "", yearOfPassing: "", marksObtained: "", maxMarks: "", percentage: "" },
      { level: "Class 12", board: "", school: "", yearOfPassing: "", marksObtained: "", maxMarks: "", percentage: "" },
    ],
    documents: [],
    declaration: false,
    applicationFee: null,
    admissionFee: null,
    hallTicketNo: null,
    rollNo: null,
    offer: { status: "none" },
    timeline: [{ stage: "draft", label: "Application started", at: now, note: "OTP verified" }],
  };
}

function seed(): Store {
  const a1: Application = newApplication("CS-APP-1042", "ananya.dasgupta@example.com", "9830012345");
  a1.step = 7;
  a1.status = "submitted";
  a1.createdAt = "2026-11-04T06:12:00.000Z";
  a1.updatedAt = "2026-11-05T11:40:00.000Z";
  a1.preferences = [
    { programSlug: "btech-cse", campusSlug: "main" },
    { programSlug: "bsc-data-science", campusSlug: "main" },
    { programSlug: "bca", campusSlug: "polytechnic" },
  ];
  a1.personal = {
    fullName: "Ananya Dasgupta",
    dob: "2007-05-14",
    gender: "Female",
    category: "General",
    idType: "Aadhaar",
    idNumber: "XXXX XXXX 4412",
    address: "23/1 Ballygunge Place",
    city: "Kolkata",
    state: "West Bengal",
    pin: "700019",
    photoName: "ananya-photo.jpg",
  };
  a1.guardian = {
    name: "Subrata Dasgupta",
    relation: "Father",
    phone: "9830098765",
    email: "subrata.d@example.com",
    occupation: "Service",
    annualIncome: "6-10 lakh",
  };
  a1.academics = [
    { level: "Class 10", board: "WBBSE", school: "Ballygunge Govt. High School", yearOfPassing: "2023", marksObtained: "668", maxMarks: "700", percentage: "95.4" },
    { level: "Class 12", board: "WBCHSE", school: "South Point High School", yearOfPassing: "2025", marksObtained: "552", maxMarks: "600", percentage: "92.0" },
  ];
  a1.documents = [
    { id: "DOC-1", kind: "Photograph", fileName: "ananya-photo.jpg", size: 184320, mime: "image/jpeg", status: "verified" },
    { id: "DOC-2", kind: "Class 10 marksheet", fileName: "class10-marksheet.pdf", size: 512000, mime: "application/pdf", status: "verified" },
    { id: "DOC-3", kind: "Class 12 marksheet", fileName: "class12-marksheet.pdf", size: 486000, mime: "application/pdf", status: "verified" },
    { id: "DOC-4", kind: "Aadhaar / ID proof", fileName: "aadhaar-masked.pdf", size: 240000, mime: "application/pdf", status: "verified" },
  ];
  a1.declaration = true;
  a1.applicationFee = {
    paid: true,
    amount: 750,
    txnId: "pay_DEMO7H2K91",
    paidAt: "2026-11-05T11:38:00.000Z",
    receiptNo: "RCPT-2026-000142",
    mode: "UPI (demo)",
  };
  a1.rollNo = "CS2201";
  a1.hallTicketNo = "CSAT-26-1042";
  a1.timeline = [
    { stage: "draft", label: "Application started", at: "2026-11-04T06:12:00.000Z", note: "OTP verified" },
    { stage: "submitted", label: "Application submitted", at: "2026-11-05T11:40:00.000Z", note: "7 steps completed" },
    { stage: "verified", label: "Documents verified", at: "2026-11-06T09:20:00.000Z", note: "All 4 documents accepted" },
  ];
  a1.status = "verified";

  const a2: Application = newApplication("CS-APP-1078", "ritwik.mondal@example.com", "9831122334");
  a2.step = 7;
  a2.status = "merit";
  a2.createdAt = "2026-11-02T04:30:00.000Z";
  a2.updatedAt = "2026-11-07T10:05:00.000Z";
  a2.preferences = [
    { programSlug: "bca", campusSlug: "polytechnic" },
    { programSlug: "btech-cse", campusSlug: "main" },
    { programSlug: "bsc-data-science", campusSlug: "south" },
  ];
  a2.personal = {
    fullName: "Ritwik Mondal",
    dob: "2007-09-02",
    gender: "Male",
    category: "OBC-B",
    idType: "Aadhaar",
    idNumber: "XXXX XXXX 7781",
    address: "18 Kalyani Station Road",
    city: "Kalyani",
    state: "West Bengal",
    pin: "741235",
    photoName: "ritwik-photo.jpg",
  };
  a2.guardian = {
    name: "Kaberi Mondal",
    relation: "Mother",
    phone: "9830077665",
    email: "kaberi.m@example.com",
    occupation: "Teacher",
    annualIncome: "3-6 lakh",
  };
  a2.academics = [
    { level: "Class 10", board: "WBBSE", school: "Kalyani High School", yearOfPassing: "2023", marksObtained: "612", maxMarks: "700", percentage: "87.4" },
    { level: "Class 12", board: "WBCHSE", school: "Kalyani Jnan Chandra Ghosh", yearOfPassing: "2025", marksObtained: "488", maxMarks: "600", percentage: "81.3" },
  ];
  a2.documents = [
    { id: "DOC-1", kind: "Photograph", fileName: "ritwik-photo.jpg", size: 176000, mime: "image/jpeg", status: "verified" },
    { id: "DOC-2", kind: "Class 10 marksheet", fileName: "class10.pdf", size: 430000, mime: "application/pdf", status: "verified" },
    { id: "DOC-3", kind: "Class 12 marksheet", fileName: "class12.pdf", size: 412000, mime: "application/pdf", status: "verified" },
    { id: "DOC-4", kind: "Caste certificate", fileName: "obc-b-certificate.pdf", size: 298000, mime: "application/pdf", status: "verified" },
  ];
  a2.declaration = true;
  a2.applicationFee = {
    paid: true,
    amount: 750,
    txnId: "pay_DEMO4K8L33",
    paidAt: "2026-11-03T07:15:00.000Z",
    receiptNo: "RCPT-2026-000178",
    mode: "Card (demo)",
  };
  a2.rollNo = "BCA2304";
  a2.hallTicketNo = "CSAT-26-1078";
  a2.timeline = [
    { stage: "draft", label: "Application started", at: "2026-11-02T04:30:00.000Z", note: "OTP verified" },
    { stage: "submitted", label: "Application submitted", at: "2026-11-02T06:00:00.000Z", note: "7 steps completed" },
    { stage: "verified", label: "Documents verified", at: "2026-11-03T08:10:00.000Z", note: "All 4 documents accepted" },
    { stage: "merit", label: "Merit rank published", at: "2026-11-07T10:05:00.000Z", note: "Rank 12 in BCA (Polytechnic)" },
  ];

  const a3: Application = newApplication("CS-APP-1103", "sohini.roy@example.com", "9832244556");
  a3.step = 7;
  a3.status = "offered";
  a3.createdAt = "2026-10-28T05:00:00.000Z";
  a3.updatedAt = "2026-11-08T06:45:00.000Z";
  a3.preferences = [
    { programSlug: "mba", campusSlug: "north" },
    { programSlug: "mba", campusSlug: "main" },
    { programSlug: "msc-physics", campusSlug: "south" },
  ];
  a3.personal = {
    fullName: "Sohini Roy",
    dob: "2001-02-19",
    gender: "Female",
    category: "General",
    idType: "Passport",
    idNumber: "XXXXXX 8821",
    address: "5 Sevoke Road, Near City Centre",
    city: "Siliguri",
    state: "West Bengal",
    pin: "734001",
    photoName: "sohini-photo.jpg",
  };
  a3.guardian = {
    name: "Amit Roy",
    relation: "Father",
    phone: "9830055443",
    email: "amit.roy@example.com",
    occupation: "Business",
    annualIncome: "10-15 lakh",
  };
  a3.academics = [
    { level: "Class 12", board: "CBSE", school: "Delhi Public School Siliguri", yearOfPassing: "2019", marksObtained: "441", maxMarks: "500", percentage: "88.2" },
    { level: "Graduation", board: "University of North Bengal", school: "Siliguri College", yearOfPassing: "2022", marksObtained: "1680", maxMarks: "2400", percentage: "70.0" },
  ];
  a3.documents = [
    { id: "DOC-1", kind: "Photograph", fileName: "sohini-photo.jpg", size: 192000, mime: "image/jpeg", status: "verified" },
    { id: "DOC-2", kind: "Graduation marksheet", fileName: "bcom-marksheet.pdf", size: 520000, mime: "application/pdf", status: "verified" },
    { id: "DOC-3", kind: "Aadhaar / ID proof", fileName: "passport.pdf", size: 310000, mime: "application/pdf", status: "verified" },
  ];
  a3.declaration = true;
  a3.applicationFee = {
    paid: true,
    amount: 1200,
    txnId: "pay_DEMO9M1X44",
    paidAt: "2026-10-29T09:30:00.000Z",
    receiptNo: "RCPT-2026-000091",
    mode: "Netbanking (demo)",
  };
  a3.offer = {
    status: "issued",
    programSlug: "mba",
    campusSlug: "north",
    issuedAt: "2026-11-08T06:45:00.000Z",
    deadline: "2026-11-25T18:29:00.000Z",
  };
  a3.timeline = [
    { stage: "draft", label: "Application started", at: "2026-10-28T05:00:00.000Z", note: "OTP verified" },
    { stage: "submitted", label: "Application submitted", at: "2026-10-28T07:20:00.000Z", note: "7 steps completed" },
    { stage: "verified", label: "Documents verified", at: "2026-10-29T10:00:00.000Z", note: "All documents accepted" },
    { stage: "merit", label: "Merit rank published", at: "2026-11-04T06:00:00.000Z", note: "Rank 4 in MBA (North)" },
    { stage: "offered", label: "Offer letter issued", at: "2026-11-08T06:45:00.000Z", note: "Accept by 25/11/2026" },
  ];

  const a4: Application = newApplication("CS-APP-1150", "arafat.hossain@example.com", "9833366778");
  a4.step = 3;
  a4.status = "draft";
  a4.createdAt = "2026-11-09T12:10:00.000Z";
  a4.updatedAt = "2026-11-09T12:44:00.000Z";
  a4.preferences = [
    { programSlug: "diploma-mechanical", campusSlug: "polytechnic" },
    { programSlug: "diploma-civil", campusSlug: "polytechnic" },
    { programSlug: "", campusSlug: "" },
  ];
  a4.personal = { ...emptyPersonal(), fullName: "Arafat Hossain", dob: "2009-03-08", gender: "Male", category: "General" };
  a4.timeline = [
    { stage: "draft", label: "Application started", at: "2026-11-09T12:10:00.000Z", note: "OTP verified" },
  ];

  const enquiries: Enquiry[] = [
    {
      id: "ENQ-1001",
      name: "Priyanka Ghosh",
      email: "priyanka.g@example.com",
      phone: "9830011122",
      program: "B.Tech in Computer Science & Engineering",
      campus: "Main Campus",
      message: "Do you accept WBJEE scores for the 2026 session? Also is hostel available for first-year girls?",
      createdAt: "2026-11-09T05:12:00.000Z",
      source: "Website contact form",
      stage: "New",
    },
    {
      id: "ENQ-1002",
      name: "Md. Imran Alam",
      email: "imran.alam@example.com",
      phone: "9830033344",
      program: "Diploma in Mechanical Engineering",
      campus: "Polytechnic",
      message: "I completed ITI fitter trade. Can I join the second semester directly?",
      createdAt: "2026-11-08T11:40:00.000Z",
      source: "Website contact form",
      stage: "Contacted",
    },
    {
      id: "ENQ-1003",
      name: "Tania Saha",
      email: "tania.saha@example.com",
      phone: "9830055566",
      program: "MBA",
      campus: "North Campus",
      message: "Please share the weekend class schedule and fee structure for the hybrid MBA.",
      createdAt: "2026-11-07T08:05:00.000Z",
      source: "Website contact form",
      stage: "Converted",
    },
  ];

  return { applications: [a1, a2, a3, a4], enquiries, otps: {}, seq: 1150, enquirySeq: 1003 };
}

export function store(): Store {
  if (!g.__csStore) g.__csStore = seed();
  return g.__csStore;
}

export function listApplications() {
  return store().applications.slice().sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export function getApplication(id: string) {
  return store().applications.find((a) => a.id === id);
}

export function createApplication(email: string, phone: string) {
  const s = store();
  s.seq += 1;
  const app = newApplication(`CS-APP-${s.seq}`, email, phone);
  s.applications.push(app);
  return app;
}

export function updateApplication(id: string, patch: Partial<Application>) {
  const app = getApplication(id);
  if (!app) return undefined;
  Object.assign(app, patch, { updatedAt: new Date().toISOString() });
  return app;
}

export function pushTimeline(id: string, stage: string, label: string, note?: string) {
  const app = getApplication(id);
  if (!app) return undefined;
  app.timeline.push({ stage, label, at: new Date().toISOString(), note });
  app.status = stage as AppStatus;
  app.updatedAt = new Date().toISOString();
  return app;
}

export function addEnquiry(data: Omit<Enquiry, "id" | "createdAt" | "stage">) {
  const s = store();
  s.enquirySeq += 1;
  const enquiry: Enquiry = {
    ...data,
    id: `ENQ-${s.enquirySeq}`,
    createdAt: new Date().toISOString(),
    stage: "New",
  };
  s.enquiries.unshift(enquiry);
  return enquiry;
}

export function issueOtp(contact: string) {
  const s = store();
  const otp = "482913"; // fixed demo OTP so the flow is predictable
  s.otps[contact.trim().toLowerCase()] = otp;
  return otp;
}

export function checkOtp(contact: string, otp: string) {
  const s = store();
  const key = contact.trim().toLowerCase();
  const expected = s.otps[key];
  if (otp === "482913") return true;
  return Boolean(expected && expected === otp);
}
