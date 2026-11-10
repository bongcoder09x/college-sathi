export type Level = "UG" | "PG" | "Diploma";
export type Mode = "On-campus" | "Hybrid" | "Online";

export interface Campus {
  slug: string;
  name: string;
  shortName: string;
  city: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  established: number;
  facilities: string[];
  gallery: { title: string; tone: string }[];
  stats: { label: string; value: string }[];
}

export interface Program {
  slug: string;
  name: string;
  shortName: string;
  level: Level;
  department: string;
  campuses: string[];
  mode: Mode;
  duration: string;
  feesPerYear: number;
  seats: number;
  eligibility: string;
  about: string;
  highlights: string[];
  syllabus: { term: string; papers: string[] }[];
  faqs: { q: string; a: string }[];
}

export interface Notice {
  id: string;
  title: string;
  category: "Admission" | "Examination" | "Result" | "Event" | "General";
  date: string;
  summary: string;
  body: string;
  attachment?: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  time: string;
  venue: string;
  campusSlug: string;
  category: "Cultural" | "Academic" | "Sports" | "Career";
  description: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  program: string;
  campus: string;
  message: string;
  createdAt: string;
  source: string;
  stage: "New" | "Contacted" | "Converted";
}

export interface DocumentItem {
  id: string;
  kind: string;
  fileName: string;
  size: number;
  mime: string;
  status: "uploaded" | "verified";
}

export type AppStatus =
  | "draft"
  | "submitted"
  | "verified"
  | "merit"
  | "offered"
  | "enrolled"
  | "rejected";

export interface PaymentRecord {
  paid: boolean;
  amount: number;
  txnId: string;
  paidAt: string;
  receiptNo: string;
  mode: string;
}

export interface Application {
  id: string;
  createdAt: string;
  updatedAt: string;
  step: number;
  status: AppStatus;
  applicant: { email: string; phone: string; otpVerified: boolean };
  preferences: { programSlug: string; campusSlug: string }[];
  personal: {
    fullName: string;
    dob: string;
    gender: string;
    category: string;
    idType: string;
    idNumber: string;
    address: string;
    city: string;
    state: string;
    pin: string;
    photoName: string;
  };
  guardian: {
    name: string;
    relation: string;
    phone: string;
    email: string;
    occupation: string;
    annualIncome: string;
  };
  academics: {
    level: string;
    board: string;
    school: string;
    yearOfPassing: string;
    marksObtained: string;
    maxMarks: string;
    percentage: string;
  }[];
  documents: DocumentItem[];
  declaration: boolean;
  applicationFee: PaymentRecord | null;
  admissionFee: PaymentRecord | null;
  hallTicketNo: string | null;
  rollNo: string | null;
  offer: {
    status: "none" | "issued" | "accepted";
    programSlug?: string;
    campusSlug?: string;
    issuedAt?: string;
    deadline?: string;
  };
  timeline: { stage: string; label: string; at: string; note?: string }[];
}
