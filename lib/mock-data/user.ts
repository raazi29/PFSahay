import type { DocumentItem } from "@/lib/types";

export interface MockUser {
  uan: string;
  name: string;
  aadhaar_name: string;
  uan_name: string;
  pan: string;
  aadhaar_last4: string;
  bank: { name: string; account: string; ifsc: string; type: string; linked: boolean };
  balance: number;
  current_employer: string;
  date_of_exit: string;
  employment_history: { employer: string; memberId: string; from: string; to: string; duration: string }[];
  kyc: { aadhaar: boolean; pan: boolean; bank: boolean; mobile: boolean; email: boolean };
  shares: { employee: number; employer: number; pension: number };
  lastUpdated: string;
  dob: string;
  mobile: string;
  email: string;
  address: string;
}

// Deterministic golden-path user. The UAN name intentionally differs from the
// Aadhaar name so the hero mismatch demo is stable.
export const MOCK_USER: MockUser = {
  uan: "100000000001",
  name: "Arjun Mehta",
  aadhaar_name: "Arjun Mehta",
  uan_name: "Arjun M.",
  pan: "ABCDE1234F",
  aadhaar_last4: "4821",
  bank: { name: "HDFC Bank", account: "XXXX7824", ifsc: "HDFC0001234", type: "Savings", linked: true },
  balance: 284650,
  current_employer: "Acme Technologies",
  date_of_exit: "10 Aug 2025",
  employment_history: [
    { employer: "Acme Technologies Pvt. Ltd.", memberId: "KDMAS1234567000", from: "May 2023", to: "Present", duration: "2 yrs 3 mos" },
    { employer: "XYZ Pvt. Ltd.", memberId: "KDKOL9876543000", from: "Jan 2021", to: "Apr 2023", duration: "2 yrs 3 mos" },
  ],
  shares: { employee: 168320, employer: 116330, pension: 15820 },
  lastUpdated: "24 Aug 2025 • 9:30 AM",
  kyc: { aadhaar: true, pan: true, bank: true, mobile: true, email: true },
  dob: "15 Feb 1996",
  mobile: "+91 98765 43210",
  email: "arjun.mehta@email.com",
  address: "Bangalore, Karnataka - 560001",
};

export function defaultDocuments(): DocumentItem[] {
  return [
    { id: "identity", label: "Identity proof (Aadhaar)", required: true, uploaded: false },
    { id: "cancelled_cheque", label: "Cancelled cheque / bank proof", required: true, uploaded: false },
    { id: "supporting", label: "Reason supporting document", required: false, uploaded: false },
  ];
}
