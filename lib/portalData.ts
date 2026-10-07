// lib/portalData.ts
// Single source of truth for MY SMARTFIX Customer Portal

export interface CustomerProfile {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  businessType: string;
  industry: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  preferredChannel: "WhatsApp" | "Email" | "Phone" | "In-App";
  sites: { id: string; name: string; location: string; isPrimary: boolean }[];
  activeSiteId: string;
}

export interface PortalProject {
  id: string;
  name: string;
  type: "Generator Conversion" | "CNG Vehicle Conversion" | "Solar & Battery" | "Bulk Fuel Supply" | "Hybrid Energy";
  location: string;
  siteId: string;
  startDate: string;
  expectedCompletion: string;
  stage:
    | "REQUEST RECEIVED"
    | "ASSESSMENT"
    | "ENGINEERING"
    | "APPROVAL"
    | "PROCUREMENT"
    | "SITE PREPARATION"
    | "INSTALLATION"
    | "TESTING"
    | "COMMISSIONING"
    | "HANDOVER"
    | "SERVICE"
    | "COMPLETED";
  progressPercent: number;
  assignedTeam: string[];
  projectManager: string;
  materialsStatus: string;
  bomCount: { allocated: number; total: number };
  cost: number;
  paidAmount: number;
  isDelayed?: boolean;
  delayNotice?: {
    reason: string;
    impact: string;
    newExpectedDate: string;
    smartfixAction: string;
    customerAction?: string;
  };
  documents: { name: string; size: string; date: string; type: string }[];
  milestones: { step: string; status: "completed" | "current" | "pending"; date?: string }[];
}

export interface PortalOrder {
  id: string;
  date: string;
  type: "CNG Fuel" | "Diesel (AGO)" | "Equipment" | "Parts" | "Maintenance" | "Solar System" | "Battery";
  items: string;
  quantity: string;
  totalPrice: number;
  status:
    | "ORDER RECEIVED"
    | "CONFIRMED"
    | "PROCESSING"
    | "PREPARING"
    | "DISPATCHED"
    | "ON THE WAY"
    | "DELIVERED"
    | "COMPLETED"
    | "CANCELLED";
  paymentStatus: "PAID" | "PENDING" | "PROCESSING" | "FAILED";
  deliveryAddress: string;
  driverName?: string;
  driverPhone?: string;
  tankerReg?: string;
  estimatedArrival?: string;
  receiptUrl?: string;
}

export interface RecurringSupply {
  id: string;
  fuelType: "Diesel (AGO)" | "Virtual Pipeline CNG";
  quantity: string;
  frequency: "Daily" | "Weekly" | "Bi-Weekly" | "Monthly";
  siteName: string;
  preferredTime: string;
  contactPerson: string;
  contactPhone: string;
  status: "ACTIVE" | "PAUSED" | "CANCELLED";
  nextDeliveryDate: string;
  estimatedMonthlySpend: number;
}

export interface CustomerAsset {
  id: string; // e.g. SFE-GEN-LAG-00021
  name: string;
  category: "Generators" | "Vehicles" | "Solar & Battery" | "Fuel Infrastructure";
  manufacturer: string;
  model: string;
  serialNumber: string;
  capacity: string; // e.g. 500 kVA, 50kWp, 2.5L V6
  fuelType: "Dual-Fuel (CNG + Diesel)" | "Dedicated CNG" | "Diesel" | "Solar PV / LiFePO4";
  location: string;
  installationDate: string;
  status: "Operational" | "Maintenance Due" | "Under Repair" | "Standby";
  warrantyExpiry: string;
  warrantyStatus: "Active" | "Expiring Soon" | "Expired";
  servicePlan: "Basic Care" | "Business Enterprise 24/7" | "Standard Maintenance";
  runningHours: number;
  lastServiceDate: string;
  nextServiceDate: string;
  recentRepairsCount: number;
}

export interface ServiceTicket {
  id: string;
  ticketNumber: string;
  assetId?: string;
  assetName?: string;
  issueCategory:
    | "Not working"
    | "Poor performance"
    | "Noise"
    | "Leak"
    | "Error code"
    | "Fuel issue"
    | "Electrical issue"
    | "Physical damage"
    | "Other";
  urgency: "CRITICAL / EMERGENCY" | "HIGH" | "MEDIUM" | "ROUTINE";
  description: string;
  status:
    | "TICKET CREATED"
    | "AI TRIAGE COMPLETED"
    | "TECHNICIAN ASSIGNED"
    | "EN ROUTE"
    | "DIAGNOSING"
    | "REPAIR IN PROGRESS"
    | "TESTING"
    | "RESOLVED"
    | "CLOSED";
  assignedTechnician?: {
    name: string;
    role: string;
    arrivalWindow: string;
  };
  potentialParts: string[];
  createdAt: string;
  resolutionSummary?: string;
}

export interface PortalInvoice {
  id: string;
  invoiceNumber: string;
  category: "Project Milestone" | "Fuel Supply" | "Maintenance" | "Equipment & Spares";
  description: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: "PAID" | "PENDING" | "OVERDUE" | "PROCESSING";
  paidDate?: string;
}

export interface PortalQuote {
  id: string;
  quoteNumber: string;
  scope: string;
  items: { description: string; qty: number; unitPrice: number }[];
  totalAmount: number;
  validUntil: string;
  status: "PENDING_REVIEW" | "ACCEPTED" | "REVISION_REQUESTED" | "DECLINED";
  terms: string;
}

export interface PortalContract {
  id: string;
  contractNumber: string;
  title: string;
  type: "Fuel Procurement Agreement" | "Dual-Fuel Maintenance SLA" | "Energy-as-a-Service";
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "PENDING_RENEWAL" | "EXPIRED";
  monthlyCommitment: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: "Project" | "Payment" | "Fuel" | "Service" | "Security";
  timestamp: string;
  read: boolean;
  linkTab?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Account Admin" | "Finance & Billing" | "Operations Lead" | "Fleet Manager" | "Maintenance Tech";
  status: "Active" | "Invited";
}

/* ------------------------------------------------------------------ */
/*  INITIAL SEED DATA GROUNDED IN CUSTOMER REPOSITORY RECORDS         */
/* ------------------------------------------------------------------ */

export const INITIAL_CUSTOMER: CustomerProfile = {
  id: "CUST-LJ-8821",
  name: "Olalekan Jimoh",
  company: "LJ Entertainment Records & Facilities",
  email: "ljentertainmentmusic@gmail.com",
  phone: "0813 978 4331",
  businessType: "Entertainment, Media & Production Hub",
  industry: "Creative Industries & Corporate Logistics",
  address: "9 Lawani Oduloye Street, Victoria Island / Oniru, Lagos",
  emergencyContact: {
    name: "Engr. Kunle (Head of Facilities)",
    phone: "0813 978 4331",
    relationship: "Facility Chief Engineer",
  },
  preferredChannel: "WhatsApp",
  sites: [
    { id: "SITE-01", name: "Main Studio & Production Complex", location: "Victoria Island / Oniru, Lagos", isPrimary: true },
    { id: "SITE-02", name: "Media & Event Warehouse Hub", location: "Ikeja Industrial Estate, Lagos", isPrimary: false },
    { id: "SITE-03", name: "Regional Broadcast Branch", location: "Central Business District, Abuja", isPrimary: false },
  ],
  activeSiteId: "SITE-01",
};

export const INITIAL_PROJECTS: PortalProject[] = [
  {
    id: "SFE-FUL-6078",
    name: "Bulk Diesel Supply & Recurring Procurement Contract",
    type: "Bulk Fuel Supply",
    location: "Victoria Island / Oniru, Lagos",
    siteId: "SITE-01",
    startDate: "2026-10-01",
    expectedCompletion: "2026-10-31",
    stage: "ENGINEERING",
    progressPercent: 65,
    assignedTeam: ["Engr. Sarah D. (Fuel Logistics)", "Capt. Ibrahim (Fleet Dispatch)"],
    projectManager: "Engr. Sarah D.",
    materialsStatus: "Tanker & Logistics Allocated (10,000 Litres Dedicated Staging)",
    bomCount: { allocated: 12, total: 12 },
    cost: 12000000,
    paidAmount: 6000000,
    milestones: [
      { step: "REQUEST RECEIVED", status: "completed", date: "Oct 1, 2026" },
      { step: "ASSESSMENT", status: "completed", date: "Oct 3, 2026" },
      { step: "ENGINEERING", status: "current", date: "Oct 6, 2026" },
      { step: "APPROVAL", status: "pending" },
      { step: "PROCUREMENT", status: "pending" },
      { step: "SITE PREPARATION", status: "pending" },
      { step: "INSTALLATION", status: "pending" },
      { step: "TESTING", status: "pending" },
      { step: "COMMISSIONING", status: "pending" },
      { step: "HANDOVER", status: "pending" },
      { step: "SERVICE", status: "pending" },
    ],
    documents: [
      { name: "Bulk Fuel Supply Framework Agreement.pdf", size: "1.4 MB", date: "Oct 3, 2026", type: "PDF" },
      { name: "AGO Density & Flashpoint Quality Certificate.pdf", size: "840 KB", date: "Oct 5, 2026", type: "Certificate" },
    ],
  },
  {
    id: "SFE-GEN-6A6C",
    name: "Perkins 250 kVA Prime Dual-Fuel Gas Conversion",
    type: "Generator Conversion",
    location: "Victoria Island Studio, Lagos",
    siteId: "SITE-01",
    startDate: "2026-09-20",
    expectedCompletion: "2026-10-18",
    stage: "PROCUREMENT",
    progressPercent: 48,
    assignedTeam: ["Engr. Tunde A. (Power Lead)", "Engr. David K. (Calibration)"],
    projectManager: "Engr. Tunde A.",
    materialsStatus: "200-Bar Gas Train, ECU & Zero-Governor Regulators Staged",
    bomCount: { allocated: 18, total: 18 },
    cost: 8500000,
    paidAmount: 5100000,
    milestones: [
      { step: "REQUEST RECEIVED", status: "completed", date: "Sep 20, 2026" },
      { step: "ASSESSMENT", status: "completed", date: "Sep 22, 2026" },
      { step: "ENGINEERING", status: "completed", date: "Sep 28, 2026" },
      { step: "APPROVAL", status: "completed", date: "Oct 2, 2026" },
      { step: "PROCUREMENT", status: "current", date: "Oct 5, 2026" },
      { step: "SITE PREPARATION", status: "pending" },
      { step: "INSTALLATION", status: "pending" },
      { step: "TESTING", status: "pending" },
      { step: "COMMISSIONING", status: "pending" },
      { step: "HANDOVER", status: "pending" },
      { step: "SERVICE", status: "pending" },
    ],
    documents: [
      { name: "Perkins 250kVA Dual-Fuel Sizing Report.pdf", size: "3.2 MB", date: "Sep 28, 2026", type: "Engineering" },
      { name: "Pneumatic Line Pressure Test Checklist.pdf", size: "620 KB", date: "Oct 2, 2026", type: "Safety" },
    ],
  },
  {
    id: "SFE-SOL-LEK-00042",
    name: "50 kWp Commercial Solar PV + 120 kWh LiFePO4 Microgrid",
    type: "Solar & Battery",
    location: "Ikeja Media Warehouse Hub",
    siteId: "SITE-02",
    startDate: "2026-08-15",
    expectedCompletion: "2026-09-30",
    stage: "SERVICE",
    progressPercent: 100,
    assignedTeam: ["Engr. Michael O. (Renewables)", "Engr. Frank E."],
    projectManager: "Engr. Michael O.",
    materialsStatus: "Fully Commissioned · Grid-Tied & Islanded Backup Operating",
    bomCount: { allocated: 34, total: 34 },
    cost: 28500000,
    paidAmount: 28500000,
    milestones: [
      { step: "REQUEST RECEIVED", status: "completed" },
      { step: "ASSESSMENT", status: "completed" },
      { step: "ENGINEERING", status: "completed" },
      { step: "APPROVAL", status: "completed" },
      { step: "PROCUREMENT", status: "completed" },
      { step: "SITE PREPARATION", status: "completed" },
      { step: "INSTALLATION", status: "completed" },
      { step: "TESTING", status: "completed" },
      { step: "COMMISSIONING", status: "completed" },
      { step: "HANDOVER", status: "completed" },
      { step: "SERVICE", status: "completed" },
    ],
    documents: [
      { name: "Solar PV Commissioning & Yield Report.pdf", size: "4.8 MB", date: "Sep 29, 2026", type: "Report" },
      { name: "LiFePO4 10-Year Factory Warranty Certificate.pdf", size: "1.1 MB", date: "Sep 30, 2026", type: "Warranty" },
    ],
  },
];

export const INITIAL_ORDERS: PortalOrder[] = [
  {
    id: "ORD-2026-9812",
    date: "2026-10-06",
    type: "Diesel (AGO)",
    items: "Certified Automotive Gas Oil (AGO) Bulk Delivery",
    quantity: "10,000 Litres",
    totalPrice: 12500000,
    status: "ON THE WAY",
    paymentStatus: "PAID",
    deliveryAddress: "9 Lawani Oduloye St, Victoria Island, Lagos",
    driverName: "Suleiman B.",
    driverPhone: "0803 881 2940",
    tankerReg: "LAG-782-KT (33,000L Compartment)",
    estimatedArrival: "Today, 15:45 - 16:30",
  },
  {
    id: "ORD-2026-9401",
    date: "2026-09-28",
    type: "CNG Fuel",
    items: "Virtual Pipeline Mobile Gas Skid (200 Bar)",
    quantity: "2,500 SCM",
    totalPrice: 2875000,
    status: "DELIVERED",
    paymentStatus: "PAID",
    deliveryAddress: "Ikeja Industrial Hub, Lagos",
    receiptUrl: "#receipt-9401",
  },
  {
    id: "ORD-2026-8840",
    date: "2026-09-14",
    type: "Parts",
    items: "Heavy-Duty Perkins Oil Filters & Dual-Fuel Spark Plugs (Set of 6)",
    quantity: "4 Kits",
    totalPrice: 420000,
    status: "DELIVERED",
    paymentStatus: "PAID",
    deliveryAddress: "Victoria Island Studio, Lagos",
    receiptUrl: "#receipt-8840",
  },
];

export const INITIAL_RECURRING: RecurringSupply[] = [
  {
    id: "REC-FUL-01",
    fuelType: "Diesel (AGO)",
    quantity: "10,000 Litres",
    frequency: "Bi-Weekly",
    siteName: "Main Studio & Production Complex (VI)",
    preferredTime: "Tuesdays 10:00 AM",
    contactPerson: "Olalekan Jimoh",
    contactPhone: "0813 978 4331",
    status: "ACTIVE",
    nextDeliveryDate: "2026-10-20",
    estimatedMonthlySpend: 25000000,
  },
  {
    id: "REC-CNG-02",
    fuelType: "Virtual Pipeline CNG",
    quantity: "3,000 SCM",
    frequency: "Monthly",
    siteName: "Media & Event Warehouse Hub (Ikeja)",
    preferredTime: "First Monday of the Month",
    contactPerson: "Engr. Kunle",
    contactPhone: "0813 978 4331",
    status: "ACTIVE",
    nextDeliveryDate: "2026-11-02",
    estimatedMonthlySpend: 3450000,
  },
];

export const INITIAL_ASSETS: CustomerAsset[] = [
  {
    id: "SFE-GEN-LAG-00021",
    name: "Studio Prime Generator (Perkins 250 kVA)",
    category: "Generators",
    manufacturer: "Perkins / FG Wilson",
    model: "1506A-E88TAG3",
    serialNumber: "PK-98319-V1",
    capacity: "250 kVA Prime",
    fuelType: "Dual-Fuel (CNG + Diesel)",
    location: "Victoria Island Studio Power Room",
    installationDate: "2024-03-12",
    status: "Operational",
    warrantyExpiry: "2027-03-12",
    warrantyStatus: "Active",
    servicePlan: "Business Enterprise 24/7",
    runningHours: 3420,
    lastServiceDate: "2026-08-15",
    nextServiceDate: "2026-10-25",
    recentRepairsCount: 1,
  },
  {
    id: "SFE-GEN-LAG-00088",
    name: "Standby Facility Generator (Cummins 150 kVA)",
    category: "Generators",
    manufacturer: "Cummins Power",
    model: "6BTAA5.9-G2",
    serialNumber: "CU-44109-IK",
    capacity: "150 kVA Standby",
    fuelType: "Diesel",
    location: "Ikeja Media Warehouse Hub",
    installationDate: "2023-11-05",
    status: "Maintenance Due",
    warrantyExpiry: "2026-11-05",
    warrantyStatus: "Expiring Soon",
    servicePlan: "Standard Maintenance",
    runningHours: 1890,
    lastServiceDate: "2026-05-10",
    nextServiceDate: "2026-10-12",
    recentRepairsCount: 0,
  },
  {
    id: "SFE-SOL-LEK-00042",
    name: "Commercial Solar PV Microgrid (50 kWp + 120 kWh)",
    category: "Solar & Battery",
    manufacturer: "Tier-1 TierOne Mono / Deye Inverters",
    model: "Deye SUN-50K-SG01HP3-EU",
    serialNumber: "DY-SOL-50K-992",
    capacity: "50 kWp Solar + 120 kWh LiFePO4",
    fuelType: "Solar PV / LiFePO4",
    location: "Ikeja Media Warehouse Rooftop",
    installationDate: "2026-09-30",
    status: "Operational",
    warrantyExpiry: "2036-09-30",
    warrantyStatus: "Active",
    servicePlan: "Business Enterprise 24/7",
    runningHours: 240,
    lastServiceDate: "2026-09-30",
    nextServiceDate: "2027-03-30",
    recentRepairsCount: 0,
  },
  {
    id: "SFE-VEH-LAG-00108",
    name: "Executive Logistics Van (Toyota HiAce CNG)",
    category: "Vehicles",
    manufacturer: "Toyota Motor Corp",
    model: "HiAce Commuter 2.7L VVT-i",
    serialNumber: "JT-499120-CNG",
    capacity: "2.7L Dual-Fuel Sequential Gas",
    fuelType: "Dedicated CNG",
    location: "Victoria Island Fleet Pool",
    installationDate: "2025-06-18",
    status: "Operational",
    warrantyExpiry: "2028-06-18",
    warrantyStatus: "Active",
    servicePlan: "Basic Care",
    runningHours: 42100,
    lastServiceDate: "2026-07-22",
    nextServiceDate: "2026-11-15",
    recentRepairsCount: 1,
  },
];

export const INITIAL_TICKETS: ServiceTicket[] = [
  {
    id: "TKT-8841",
    ticketNumber: "TKT-8841-GEN",
    assetId: "SFE-GEN-LAG-00088",
    assetName: "Standby Facility Generator (Cummins 150 kVA)",
    issueCategory: "Poor performance",
    urgency: "HIGH",
    description: "Generator experiencing slight RPM oscillation during heavy broadcast lighting loads. Suspected fuel injection filter saturation.",
    status: "TECHNICIAN ASSIGNED",
    assignedTechnician: {
      name: "Engr. Babatunde K.",
      role: "Senior Power Systems Diagnostician",
      arrivalWindow: "Tomorrow, 10:30 AM - 11:30 AM",
    },
    potentialParts: ["High-flow diesel fuel separator element", "Actuator linkage cleaner"],
    createdAt: "2026-10-06T11:20:00Z",
  },
];

export const INITIAL_INVOICES: PortalInvoice[] = [
  {
    id: "INV-2026-1049",
    invoiceNumber: "SFE-INV-1049",
    category: "Fuel Supply",
    description: "10,000 Litres Certified AGO Bulk Delivery (Victoria Island)",
    amount: 12500000,
    issueDate: "2026-10-06",
    dueDate: "2026-10-20",
    status: "PENDING",
  },
  {
    id: "INV-2026-0982",
    invoiceNumber: "SFE-INV-0982",
    category: "Project Milestone",
    description: "Milestone 2 (Engineering & Procurement Pack) — Perkins 250kVA Dual-Fuel",
    amount: 5100000,
    issueDate: "2026-10-02",
    dueDate: "2026-10-16",
    status: "PAID",
    paidDate: "2026-10-03",
  },
  {
    id: "INV-2026-0811",
    invoiceNumber: "SFE-INV-0811",
    category: "Equipment & Spares",
    description: "50kWp Solar Microgrid Final Commissioning Balance",
    amount: 14250000,
    issueDate: "2026-09-28",
    dueDate: "2026-10-12",
    status: "PAID",
    paidDate: "2026-09-30",
  },
];

export const INITIAL_QUOTES: PortalQuote[] = [
  {
    id: "QTE-2026-7731",
    quoteNumber: "SFE-QTE-7731",
    scope: "Secondary 150 kVA Cummins Generator Petrol-to-CNG Dual-Fuel Conversion Kit & 400 SCM Gas Line Link",
    items: [
      { description: "Microprocessor Dual-Fuel CNG Engine Management ECU", qty: 1, unitPrice: 2200000 },
      { description: "Pneumatic Safety Shut-off Train & Zero-Governor Regulators", qty: 1, unitPrice: 1650000 },
      { description: "Site Fitting, Calibration & Certified 250-Bar Pressure Hold Test", qty: 1, unitPrice: 850000 },
    ],
    totalAmount: 4700000,
    validUntil: "2026-10-31",
    status: "PENDING_REVIEW",
    terms: "Payment terms: 60% upon kit allocation, 40% upon commissioning and full dual-fuel handover. Includes 24-month SmartFix warranty.",
  },
];

export const INITIAL_CONTRACTS: PortalContract[] = [
  {
    id: "CNT-2026-004",
    contractNumber: "SFE-CNT-004",
    title: "Annual Fuel Supply & Strategic AGO Price-Hedging Master Agreement",
    type: "Fuel Procurement Agreement",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    status: "ACTIVE",
    monthlyCommitment: "20,000 Litres Minimum Guarantee with Priority Tanker Dispatch",
  },
  {
    id: "CNT-2026-019",
    contractNumber: "SFE-CNT-019",
    title: "Enterprise 24/7 Power Systems Maintenance SLA",
    type: "Dual-Fuel Maintenance SLA",
    startDate: "2026-03-01",
    endDate: "2027-02-28",
    status: "ACTIVE",
    monthlyCommitment: "4 Hours Emergency SLA, Bi-monthly Scheduled Filter & Valve Overhauls",
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "NOTIF-01",
    title: "Fuel Delivery En Route",
    message: "Tanker LAG-782-KT carrying 10,000L of AGO has departed the depot. Expected arrival 15:45 - 16:30.",
    category: "Fuel",
    timestamp: "10 mins ago",
    read: false,
    linkTab: "orders",
  },
  {
    id: "NOTIF-02",
    title: "Project Milestone Staged",
    message: "Materials for Perkins 250kVA Dual-Fuel conversion (SFE-GEN-6A6C) are 100% allocated in warehouse.",
    category: "Project",
    timestamp: "2 hours ago",
    read: false,
    linkTab: "projects",
  },
  {
    id: "NOTIF-03",
    title: "Routine Maintenance Due Soon",
    message: "Standby Generator (Cummins 150 kVA) is due for 250-hour oil & filter inspection on Oct 12.",
    category: "Service",
    timestamp: "Yesterday",
    read: true,
    linkTab: "assets",
  },
  {
    id: "NOTIF-04",
    title: "Payment Receipt Verified",
    message: "₦5,100,000 for Invoice SFE-INV-0982 has been confirmed and credited to your account.",
    category: "Payment",
    timestamp: "3 days ago",
    read: true,
    linkTab: "billing",
  },
];

export const INITIAL_TEAM: TeamMember[] = [
  { id: "TM-01", name: "Olalekan Jimoh", email: "ljentertainmentmusic@gmail.com", role: "Account Admin", status: "Active" },
  { id: "TM-02", name: "Engr. Kunle Alabi", email: "facilities@ljentertainment.ng", role: "Operations Lead", status: "Active" },
  { id: "TM-03", name: "Mrs. Folashade Adeyemi", email: "finance@ljentertainment.ng", role: "Finance & Billing", status: "Active" },
  { id: "TM-04", name: "Dayo Oladipo", email: "fleet@ljentertainment.ng", role: "Fleet Manager", status: "Invited" },
];

/* ------------------------------------------------------------------ */
/*  PERSISTENT STORAGE MANAGER                                        */
/* ------------------------------------------------------------------ */

const STORAGE_KEYS = {
  profile: "smartfix_portal_profile",
  projects: "smartfix_portal_projects",
  orders: "smartfix_portal_orders",
  recurring: "smartfix_portal_recurring",
  assets: "smartfix_portal_assets",
  tickets: "smartfix_portal_tickets",
  invoices: "smartfix_portal_invoices",
  quotes: "smartfix_portal_quotes",
  contracts: "smartfix_portal_contracts",
  notifications: "smartfix_portal_notifications",
  team: "smartfix_portal_team",
  session: "smartfix_customer_session",
};

export const portalStorage = {
  getProfile(): CustomerProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.profile);
      return data ? JSON.parse(data) : INITIAL_CUSTOMER;
    } catch {
      return INITIAL_CUSTOMER;
    }
  },
  saveProfile(profile: CustomerProfile) {
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
  },

  getProjects(): PortalProject[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.projects);
      let localProjects = data ? JSON.parse(data) : INITIAL_PROJECTS;

      // Merge any projects created via wizard in local storage
      const wizardProjects = JSON.parse(localStorage.getItem("smartfix_projects") || "[]");
      wizardProjects.forEach((wp: any) => {
        if (!localProjects.some((p: PortalProject) => p.id === wp.id)) {
          localProjects.unshift({
            id: wp.id,
            name: wp.equipment || wp.objective || "Custom Energy Project",
            type: wp.id.includes("GEN")
              ? "Generator Conversion"
              : wp.id.includes("FUL")
              ? "Bulk Fuel Supply"
              : wp.id.includes("VEH")
              ? "CNG Vehicle Conversion"
              : "Hybrid Energy",
            location: wp.location || "Lagos, Nigeria",
            siteId: "SITE-01",
            startDate: new Date(wp.createdAt || Date.now()).toISOString().split("T")[0],
            expectedCompletion: "In Engineering Review",
            stage: "ENGINEERING",
            progressPercent: 35,
            assignedTeam: ["SmartFix Technical Operations Grid"],
            projectManager: "Engr. Tunde A.",
            materialsStatus: wp.materialsStatus || "BOM Staging in Progress",
            bomCount: { allocated: 12, total: 12 },
            cost: wp.id.includes("FUL") ? 12000000 : 8500000,
            paidAmount: 0,
            milestones: [
              { step: "REQUEST RECEIVED", status: "completed", date: "Just now" },
              { step: "ASSESSMENT", status: "completed", date: "Scheduled" },
              { step: "ENGINEERING", status: "current", date: "In Progress" },
              { step: "APPROVAL", status: "pending" },
              { step: "PROCUREMENT", status: "pending" },
              { step: "SITE PREPARATION", status: "pending" },
              { step: "INSTALLATION", status: "pending" },
              { step: "TESTING", status: "pending" },
              { step: "COMMISSIONING", status: "pending" },
              { step: "HANDOVER", status: "pending" },
              { step: "SERVICE", status: "pending" },
            ],
            documents: [{ name: "Intake Project Specification.pdf", size: "1.2 MB", date: "Today", type: "PDF" }],
          });
        }
      });

      return localProjects;
    } catch {
      return INITIAL_PROJECTS;
    }
  },
  saveProjects(projects: PortalProject[]) {
    localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(projects));
  },

  getOrders(): PortalOrder[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.orders);
      return data ? JSON.parse(data) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  },
  saveOrders(orders: PortalOrder[]) {
    localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
  },
  addOrder(order: Omit<PortalOrder, "id">) {
    const id = "ORD-2026-" + Math.floor(1000 + Math.random() * 9000);
    const newOrder: PortalOrder = { id, ...order };
    const all = this.getOrders();
    all.unshift(newOrder);
    this.saveOrders(all);
    return newOrder;
  },

  getRecurring(): RecurringSupply[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.recurring);
      return data ? JSON.parse(data) : INITIAL_RECURRING;
    } catch {
      return INITIAL_RECURRING;
    }
  },
  saveRecurring(recurring: RecurringSupply[]) {
    localStorage.setItem(STORAGE_KEYS.recurring, JSON.stringify(recurring));
  },

  getAssets(): CustomerAsset[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.assets);
      return data ? JSON.parse(data) : INITIAL_ASSETS;
    } catch {
      return INITIAL_ASSETS;
    }
  },
  saveAssets(assets: CustomerAsset[]) {
    localStorage.setItem(STORAGE_KEYS.assets, JSON.stringify(assets));
  },

  getTickets(): ServiceTicket[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.tickets);
      return data ? JSON.parse(data) : INITIAL_TICKETS;
    } catch {
      return INITIAL_TICKETS;
    }
  },
  saveTickets(tickets: ServiceTicket[]) {
    localStorage.setItem(STORAGE_KEYS.tickets, JSON.stringify(tickets));
  },
  addTicket(ticket: Omit<ServiceTicket, "id" | "ticketNumber" | "createdAt" | "status">) {
    const num = Math.floor(1000 + Math.random() * 9000);
    const newTicket: ServiceTicket = {
      id: `TKT-${num}`,
      ticketNumber: `TKT-${num}-${ticket.issueCategory.substring(0, 3).toUpperCase()}`,
      status: "TICKET CREATED",
      createdAt: new Date().toISOString(),
      ...ticket,
    };
    const all = this.getTickets();
    all.unshift(newTicket);
    this.saveTickets(all);
    return newTicket;
  },

  getInvoices(): PortalInvoice[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.invoices);
      return data ? JSON.parse(data) : INITIAL_INVOICES;
    } catch {
      return INITIAL_INVOICES;
    }
  },
  saveInvoices(invoices: PortalInvoice[]) {
    localStorage.setItem(STORAGE_KEYS.invoices, JSON.stringify(invoices));
  },

  getQuotes(): PortalQuote[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.quotes);
      return data ? JSON.parse(data) : INITIAL_QUOTES;
    } catch {
      return INITIAL_QUOTES;
    }
  },
  saveQuotes(quotes: PortalQuote[]) {
    localStorage.setItem(STORAGE_KEYS.quotes, JSON.stringify(quotes));
  },

  getContracts(): PortalContract[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.contracts);
      return data ? JSON.parse(data) : INITIAL_CONTRACTS;
    } catch {
      return INITIAL_CONTRACTS;
    }
  },

  getNotifications(): NotificationItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.notifications);
      return data ? JSON.parse(data) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  },
  saveNotifications(notifs: NotificationItem[]) {
    localStorage.setItem(STORAGE_KEYS.notifications, JSON.stringify(notifs));
  },

  getTeam(): TeamMember[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.team);
      return data ? JSON.parse(data) : INITIAL_TEAM;
    } catch {
      return INITIAL_TEAM;
    }
  },
  saveTeam(team: TeamMember[]) {
    localStorage.setItem(STORAGE_KEYS.team, JSON.stringify(team));
  },

  isLoggedIn(): boolean {
    return localStorage.getItem(STORAGE_KEYS.session) !== "logged_out";
  },
  login() {
    localStorage.setItem(STORAGE_KEYS.session, "logged_in");
  },
  logout() {
    localStorage.setItem(STORAGE_KEYS.session, "logged_out");
  },
};
