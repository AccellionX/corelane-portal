import type {
  ActivityLog,
  AdminSettings,
  Booking,
  CmsContent,
  Invoice,
  Notification,
  NotificationPrefs,
  Order,
  PaymentMethod,
  PermissionId,
  Plan,
  RolePermissions,
  SubscriptionAddon,
  SupportTicket,
  Transaction,
  UploadedFile,
  UsageMeter,
  User,
} from "./types";

export const PERMISSION_META: { id: PermissionId; label: string }[] = [
  { id: "users.manage", label: "Manage users & roles" },
  { id: "users.suspend", label: "Suspend / reactivate" },
  { id: "billing.refund", label: "Refund payments" },
  { id: "plans.manage", label: "Manage plans" },
  { id: "tickets.assign", label: "Assign tickets" },
  { id: "tickets.resolve", label: "Resolve tickets" },
  { id: "content.publish", label: "Publish CMS" },
  { id: "settings.edit", label: "Edit settings" },
  { id: "logs.export", label: "Export activity logs" },
];

export function createDefaultRolePermissions(): RolePermissions {
  const allTrue = Object.fromEntries(
    PERMISSION_META.map((p) => [p.id, true])
  ) as RolePermissions["Admin"];
  const none = Object.fromEntries(
    PERMISSION_META.map((p) => [p.id, false])
  ) as RolePermissions["Admin"];

  return {
    Admin: { ...allTrue },
    Manager: {
      ...allTrue,
      "settings.edit": false,
      "logs.export": true,
    },
    Support: {
      ...none,
      "tickets.assign": true,
      "tickets.resolve": true,
    },
    User: { ...none },
  };
}

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  companyName: "Corelane Demo",
  supportEmail: "support@corelane.demo",
  timezone: "America/Los_Angeles",
  docsUrl: "https://docs.corelane.demo",
  lastDeployAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
  githubRepo: "hosted in your GitHub",
};

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 19,
    interval: "month",
    description: "For solo operators getting lanes under control.",
    features: [
      "Up to 3 team seats",
      "Core booking calendar",
      "Stripe-ready invoicing",
      "Email support (48h)",
      "Basic analytics",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    price: 49,
    interval: "month",
    description: "For growing teams that need shared ops visibility.",
    highlighted: true,
    features: [
      "Up to 15 team seats",
      "Shared booking & capacity",
      "Automated dunning & receipts",
      "Priority chat support",
      "Cohort & revenue reports",
      "Custom notification rules",
    ],
  },
  {
    id: "scale",
    name: "Scale",
    price: 129,
    interval: "month",
    description: "For multi-location ops with audit and admin needs.",
    features: [
      "Unlimited seats",
      "Multi-workspace admin",
      "SSO & role policies",
      "Dedicated success manager",
      "API + webhooks",
      "Audit log & exports",
      "Custom SLA",
    ],
  },
];

const FIRST_NAMES = [
  "Ava", "Noah", "Mia", "Liam", "Sofia", "Ethan", "Isla", "Mason", "Chloe", "Lucas",
  "Amelia", "Oliver", "Harper", "James", "Evelyn", "Henry", "Aria", "Benjamin", "Grace", "Jack",
  "Zoe", "Daniel", "Nora", "Samuel", "Elena", "Owen", "Layla", "Caleb", "Ruby", "Nathan",
  "Iris", "Leo", "Violet", "Adrian", "Maya", "Julian", "Stella", "Gabriel", "Luna", "Felix",
];

const LAST_NAMES = [
  "Chen", "Patel", "Nguyen", "Brooks", "Kim", "Garcia", "Walsh", "Singh", "Morales", "Reid",
  "Okoro", "Andersen", "Torres", "Blake", "Hassan", "Park", "Diaz", "Coleman", "Ibrahim", "Shaw",
  "Nakamura", "Foster", "Rivera", "Hughes", "Berg", "Lopez", "Quinn", "Sato", "Ellis", "Vargas",
  "Khan", "Powell", "Romero", "Hart", "Costa", "Bennett", "Ali", "Murray", "Cho", "West",
];

const COMPANIES = [
  "Northwind Labs", "Harbor & Co", "Brightline Media", "Cedar Ops", "Pulse Retail",
  "Atlas Freight", "Lumen Clinics", "Fieldnote", "Orbit Finance", "Summit Clinics",
  "Parcelwise", "Cobalt Studio", "Riverbank Legal", "Kinetic Gyms", "Aperture Health",
  "Stackyard", "Meridian Hotels", "Bluefinch", "Cascade Dental", "Vertex Mobility",
];

function daysAgo(n: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  d.setUTCHours(12, 0, 0, 0);
  return d.toISOString();
}

function hoursAgo(n: number): string {
  const d = new Date();
  d.setUTCHours(d.getUTCHours() - n);
  return d.toISOString();
}

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

function planForIndex(i: number): User["plan"] {
  if (i % 7 === 0) return "scale";
  if (i % 3 === 0) return "growth";
  return "starter";
}

function roleForIndex(i: number): User["role"] {
  if (i === 0) return "Admin";
  if (i === 1 || i === 2) return "Manager";
  if (i === 3 || i === 4 || i === 5) return "Support";
  return "User";
}

export function createSeedUsers(): User[] {
  return Array.from({ length: 40 }, (_, i) => {
    const first = FIRST_NAMES[i];
    const last = LAST_NAMES[i];
    const email = `${first.toLowerCase()}.${last.toLowerCase()}@${pick(
      ["corelane.io", "acmeops.com", "northwind.co", "harborhq.com"],
      i
    )}`;
    return {
      id: `usr_${String(i + 1).padStart(3, "0")}`,
      name: `${first} ${last}`,
      email,
      role: roleForIndex(i),
      status: i === 8 || i === 19 || i === 27 ? "suspended" : "active",
      plan: planForIndex(i),
      signupDate: daysAgo(420 - i * 9),
      company: pick(COMPANIES, i),
      lastActive: hoursAgo((i * 5) % 96),
      avatarHue: (i * 37) % 360,
    };
  });
}

const TX_METHODS = ["Visa ••4242", "Mastercard ••5512", "Amex ••1005", "ACH ••8821"];

export function createSeedTransactions(users: User[]): Transaction[] {
  const statuses: Transaction["status"][] = [
    "paid", "paid", "paid", "paid", "paid", "paid", "paid",
    "refunded", "failed", "paid",
  ];
  return Array.from({ length: 60 }, (_, i) => {
    const user = users[i % users.length];
    const plan = PLANS.find((p) => p.id === user.plan)!;
    const status = statuses[i % statuses.length];
    const amount =
      status === "failed"
        ? plan.price
        : status === "refunded"
          ? plan.price
          : plan.price + (i % 3 === 0 ? 0 : i % 5);
    return {
      id: `txn_${String(1000 + i)}`,
      userId: user.id,
      amount,
      status,
      planId: user.plan,
      description: `${plan.name} subscription — ${new Date(daysAgo(i * 2)).toLocaleString("en-US", { month: "short", year: "numeric", timeZone: "UTC" })}`,
      date: daysAgo(i * 2 + (i % 4)),
      paymentMethod: pick(TX_METHODS, i),
    };
  });
}

const BOOKING_TITLES = [
  "Strategy workshop", "Client onboarding", "Capacity planning", "QBR prep",
  "Studio shoot", "Facility walkthrough", "Training cohort", "Vendor review",
  "Launch dry-run", "Support escalation clinic", "Board readout", "Partner demo",
];

const LOCATIONS = [
  "Room A — HQ", "Zoom · Corelane", "Brooklyn Studio", "Austin Hub",
  "London Bridge office", "Virtual · Teams", "Dock 3 warehouse", "Clinic Bay 2",
];

export function createSeedBookings(users: User[]): Booking[] {
  const statuses: Booking["status"][] = ["confirmed", "pending", "completed", "cancelled", "confirmed"];
  return Array.from({ length: 25 }, (_, i) => {
    const start = new Date(daysAgo(-(i % 12) + 3));
    start.setUTCHours(14 + (i % 4), 0, 0, 0);
    const end = new Date(start);
    end.setUTCHours(start.getUTCHours() + 1 + (i % 2));
    return {
      id: `bk_${String(200 + i)}`,
      userId: users[(i + 6) % users.length].id,
      title: pick(BOOKING_TITLES, i),
      date: start.toISOString(),
      endDate: end.toISOString(),
      status: statuses[i % statuses.length],
      location: pick(LOCATIONS, i),
      attendees: 2 + (i % 8),
    };
  });
}

const ORDER_CATALOG = [
  { name: "Lane sensor kit", unitPrice: 89 },
  { name: "Branded badge pack", unitPrice: 24 },
  { name: "Desk stand (oak)", unitPrice: 64 },
  { name: "Priority shipping label roll", unitPrice: 18 },
  { name: "Onboarding playbook print", unitPrice: 42 },
  { name: "Tablet mount", unitPrice: 56 },
];

function orderTimeline(status: Order["status"], date: string) {
  const base = new Date(date).getTime();
  const step = (h: number) => new Date(base + h * 3600_000).toISOString();
  const stages = [
    { label: "Order placed", at: step(0), done: true },
    { label: "Processing", at: step(6), done: status !== "cancelled" },
    {
      label: "Shipped",
      at: step(30),
      done: status === "shipped" || status === "delivered",
    },
    { label: "Delivered", at: step(72), done: status === "delivered" },
  ];
  if (status === "cancelled") {
    return [
      stages[0],
      { label: "Cancelled", at: step(4), done: true },
    ];
  }
  return stages;
}

export function createSeedOrders(users: User[]): Order[] {
  const statuses: Order["status"][] = [
    "delivered",
    "processing",
    "shipped",
    "cancelled",
    "delivered",
  ];
  return Array.from({ length: 25 }, (_, i) => {
    const itemA = ORDER_CATALOG[i % ORDER_CATALOG.length];
    const itemB = ORDER_CATALOG[(i + 2) % ORDER_CATALOG.length];
    const qtyA = 1 + (i % 3);
    const qtyB = i % 2 === 0 ? 1 + (i % 2) : 0;
    const items = [
      { name: itemA.name, quantity: qtyA, unitPrice: itemA.unitPrice },
      ...(qtyB
        ? [{ name: itemB.name, quantity: qtyB, unitPrice: itemB.unitPrice }]
        : []),
    ];
    const total = items.reduce((s, it) => s + it.quantity * it.unitPrice, 0);
    const status = statuses[i % statuses.length];
    const date = daysAgo(i * 3 + 1);
    return {
      id: `ord_${String(500 + i)}`,
      userId: users[(i + 3) % users.length].id,
      items,
      total,
      status,
      date,
      trackingNumber:
        status === "shipped" || status === "delivered"
          ? `CL${980000 + i}`
          : undefined,
      timeline: orderTimeline(status, date),
    };
  });
}

export function createSeedFiles(users: User[]): UploadedFile[] {
  const names = [
    { name: "Q3-capacity-plan.pdf", mime: "application/pdf", size: 482_112 },
    { name: "brand-kit.zip", mime: "application/zip", size: 2_048_000 },
    { name: "lane-map.png", mime: "image/png", size: 890_400 },
    { name: "onboarding-checklist.docx", mime: "application/docx", size: 64_200 },
    { name: "invoice-export.csv", mime: "text/csv", size: 18_440 },
    { name: "studio-floorplan.pdf", mime: "application/pdf", size: 1_204_800 },
    { name: "support-macros.json", mime: "application/json", size: 12_880 },
    { name: "hero-still.jpg", mime: "image/jpeg", size: 640_220 },
  ];
  return names.map((f, i) => ({
    id: `file_${String(i + 1).padStart(3, "0")}`,
    userId: users[10 + (i % 5)].id,
    name: f.name,
    size: f.size,
    mimeType: f.mime,
    uploadedAt: daysAgo(i + 1),
  }));
}

export const DEFAULT_PAYMENT_METHOD: PaymentMethod = {
  brand: "Visa",
  last4: "4242",
  expMonth: 8,
  expYear: 2028,
};

export const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  product: true,
  billing: true,
  security: true,
  support: true,
  digest: false,
};

export const DEFAULT_ADDONS: SubscriptionAddon[] = [
  { id: "addon_seats", name: "Extra seats (+5)", price: 15, active: true },
  { id: "addon_sms", name: "SMS reminders", price: 9, active: false },
  { id: "addon_api", name: "API burst pack", price: 29, active: true },
];

export const DEFAULT_USAGE: UsageMeter[] = [
  { id: "usage_seats", label: "Team seats", used: 9, limit: 15, unit: "seats" },
  { id: "usage_bookings", label: "Bookings this month", used: 42, limit: 100, unit: "events" },
  { id: "usage_storage", label: "File storage", used: 3.2, limit: 10, unit: "GB" },
  { id: "usage_api", label: "API calls", used: 18_400, limit: 50_000, unit: "calls" },
];

export function createSeedInvoices(users: User[], transactions: Transaction[]): Invoice[] {
  return transactions.slice(0, 40).map((txn, i) => {
    const issued = new Date(txn.date);
    const due = new Date(issued);
    due.setUTCDate(due.getUTCDate() + 14);
    let status: Invoice["status"] = "paid";
    if (txn.status === "failed") status = "overdue";
    else if (txn.status === "refunded") status = "void";
    else if (i % 11 === 0) status = "open";
    return {
      id: `inv_${String(700 + i)}`,
      userId: txn.userId,
      amount: txn.amount,
      status,
      issuedDate: issued.toISOString(),
      dueDate: due.toISOString(),
      planId: txn.planId,
      number: `INV-2026-${String(1001 + i)}`,
    };
  });
}

export function createSeedTickets(users: User[]): SupportTicket[] {
  const subjects = [
    "Cannot export monthly revenue CSV",
    "Seat invite stuck in pending",
    "Incorrect tax on Growth invoice",
    "Dark mode flashes on Safari",
    "Webhook retries exhausting queue",
    "Need SSO mapping for Okta groups",
    "Booking conflict after timezone change",
    "Refund shows paid in customer portal",
    "API rate limit unclear for Scale",
    "Notification digests arriving twice",
  ];
  const categories = [
    "Billing", "Accounts", "Billing", "Product", "Integrations",
    "Security", "Bookings", "Billing", "API", "Notifications",
  ];
  const priorities: SupportTicket["priority"][] = [
    "medium", "high", "high", "low", "urgent", "high", "medium", "urgent", "medium", "low",
  ];
  const statuses: SupportTicket["status"][] = [
    "open", "pending", "open", "resolved", "open", "pending", "resolved", "open", "pending", "resolved",
  ];

  return subjects.map((subject, i) => {
    const user = users[(i + 10) % users.length];
    const agent = users[3 + (i % 3)];
    const createdAt = daysAgo(18 - i);
    const status = statuses[i];
    const messages = [
      {
        id: `msg_${i}_1`,
        authorId: user.id,
        authorName: user.name,
        authorRole: "User" as const,
        body: `Hi team — ${subject.toLowerCase()}. This started after our last plan change on Growth. Happy to jump on a call if helpful.`,
        createdAt,
      },
      {
        id: `msg_${i}_2`,
        authorId: agent.id,
        authorName: agent.name,
        authorRole: agent.role,
        body: `Thanks ${user.name.split(" ")[0]} — I've reproduced this on a Growth workspace and opened an internal thread. Expect an update within one business day.`,
        createdAt: hoursAgo(24 * (18 - i) - 5),
      },
    ];
    if (status !== "open") {
      messages.push({
        id: `msg_${i}_3`,
        authorId: user.id,
        authorName: user.name,
        authorRole: "User",
        body: "Appreciate the quick look. Let me know if you need screen recordings from our admin seat.",
        createdAt: hoursAgo(24 * (18 - i) - 20),
      });
    }
    if (status === "resolved") {
      messages.push({
        id: `msg_${i}_4`,
        authorId: agent.id,
        authorName: agent.name,
        authorRole: agent.role,
        body: "Resolved — root cause was a stale cache on the export worker. We've shipped a fix and re-ran your last export. Closing this ticket.",
        createdAt: hoursAgo(24 * (18 - i) - 30),
      });
    }
    return {
      id: `tkt_${String(50 + i)}`,
      userId: user.id,
      subject,
      status,
      priority: priorities[i],
      category: categories[i],
      messages,
      createdAt,
      updatedAt: messages[messages.length - 1].createdAt,
    };
  });
}

export function createSeedNotifications(users: User[]): Notification[] {
  const templates: Omit<Notification, "id" | "userId">[] = [
    {
      title: "Invoice paid",
      body: "Growth plan for March cleared via Visa ••4242.",
      read: false,
      type: "billing",
      createdAt: hoursAgo(3),
    },
    {
      title: "New booking confirmed",
      body: "Strategy workshop is locked for Thursday at 2:00 PM.",
      read: false,
      type: "product",
      createdAt: hoursAgo(8),
    },
    {
      title: "Security check-in",
      body: "A new admin session started from San Francisco.",
      read: true,
      type: "security",
      createdAt: hoursAgo(26),
    },
    {
      title: "Support replied",
      body: "Corelane Support updated ticket #tkt_50.",
      read: false,
      type: "support",
      createdAt: hoursAgo(12),
    },
    {
      title: "Order shipped",
      body: "Lane sensor kit is en route — tracking CL980004.",
      read: true,
      type: "product",
      createdAt: daysAgo(2),
    },
    {
      title: "Payment failed",
      body: "We couldn't charge Mastercard ••5512. Update billing to avoid interruption.",
      read: false,
      type: "billing",
      createdAt: daysAgo(1),
    },
  ];

  const list: Notification[] = [];
  let n = 0;
  for (let u = 0; u < 12; u++) {
    for (let t = 0; t < templates.length; t++) {
      if (list.length >= 36) break;
      list.push({
        ...templates[t],
        id: `ntf_${String(++n).padStart(3, "0")}`,
        userId: users[u].id,
        createdAt: hoursAgo(n * 3 + t),
        read: (u + t) % 3 === 0,
      });
    }
  }
  return list;
}

export function createSeedCms(): CmsContent {
  return {
    heroHeadline: "Operate every lane from one calm control plane",
    heroSubtext:
      "Corelane unifies bookings, billing, and support so growing teams ship work without juggling five dashboards.",
    features: [
      {
        id: "feat_1",
        title: "Unified capacity",
        description:
          "See bookings, seats, and utilization in one timeline — no spreadsheet reconciliation.",
        icon: "CalendarClock",
      },
      {
        id: "feat_2",
        title: "Revenue that reconciles",
        description:
          "Subscriptions, invoices, and refunds stay linked to the customer record that owns them.",
        icon: "Receipt",
      },
      {
        id: "feat_3",
        title: "Support with context",
        description:
          "Agents open tickets already knowing plan, last payment, and open bookings.",
        icon: "MessagesSquare",
      },
      {
        id: "feat_4",
        title: "Admin without chaos",
        description:
          "Roles, audit logs, and CMS publishing give operators confidence at Scale.",
        icon: "ShieldCheck",
      },
    ],
    faq: [
      {
        id: "faq_1",
        question: "Can we migrate mid-cycle from another billing tool?",
        answer:
          "Yes. Growth and Scale include a guided import for customers, open invoices, and subscription schedules. Most teams finish cutover in under a week.",
      },
      {
        id: "faq_2",
        question: "Do you support SSO?",
        answer:
          "SSO via SAML and OIDC is available on Scale, including Okta and Azure AD group-to-role mapping.",
      },
      {
        id: "faq_3",
        question: "How does refunding work in the demo?",
        answer:
          "Admins can refund a paid transaction from the admin panel. The shared store updates customer billing views and writes an audit log entry instantly.",
      },
      {
        id: "faq_4",
        question: "Is Corelane available for multi-location businesses?",
        answer:
          "Scale supports multiple workspaces with shared admin policies — designed for clinics, studios, and logistics hubs.",
      },
      {
        id: "faq_5",
        question: "What happens when I hit Reset demo?",
        answer:
          "Seed data is restored from the in-app fixtures and localStorage is rewritten so every surface — public, app, and admin — returns to a clean baseline.",
      },
    ],
    published: true,
    updatedAt: daysAgo(2),
  };
}

export function createSeedLogs(): ActivityLog[] {
  return [
    {
      id: "log_001",
      actor: "Ava Chen",
      action: "published CMS content",
      target: "Marketing homepage",
      timestamp: daysAgo(2),
    },
    {
      id: "log_002",
      actor: "Noah Patel",
      action: "changed role",
      target: "usr_012 → Manager",
      timestamp: daysAgo(5),
    },
    {
      id: "log_003",
      actor: "Mia Nguyen",
      action: "resolved ticket",
      target: "tkt_53",
      timestamp: daysAgo(4),
    },
  ];
}

export function createSeedData() {
  const users = createSeedUsers();
  const transactions = createSeedTransactions(users);
  const bookings = createSeedBookings(users);
  const orders = createSeedOrders(users);
  const invoices = createSeedInvoices(users, transactions);
  const tickets = createSeedTickets(users);
  const notifications = createSeedNotifications(users);
  const files = createSeedFiles(users);
  const content = createSeedCms();
  const logs = createSeedLogs();
  const ticketsWithAssign: SupportTicket[] = tickets.map((t, i) => ({
    ...t,
    ...(i % 3 === 0
      ? { assignedTo: users[3].id }
      : i % 3 === 1
        ? { assignedTo: users[4].id }
        : {}),
  }));

  return {
    users,
    plans: PLANS.map((p) => ({ ...p, features: [...p.features] })),
    transactions,
    bookings,
    orders,
    invoices,
    tickets: ticketsWithAssign,
    notifications,
    files,
    content: { ...content, features: content.features.map((f) => ({ ...f })), faq: content.faq.map((f) => ({ ...f })) },
    contentDraft: {
      ...content,
      features: content.features.map((f) => ({ ...f })),
      faq: content.faq.map((f) => ({ ...f })),
    },
    contentVersions: [
      {
        id: "ver_seed_1",
        publishedAt: daysAgo(14),
        actor: "Ava Chen",
        snapshot: {
          ...content,
          heroHeadline: "Ship calmer ops with Corelane",
          features: content.features.map((f) => ({ ...f })),
          faq: content.faq.map((f) => ({ ...f })),
          updatedAt: daysAgo(14),
        },
      },
      {
        id: "ver_seed_2",
        publishedAt: daysAgo(7),
        actor: "Ava Chen",
        snapshot: {
          ...content,
          heroHeadline: "One control plane for every lane",
          features: content.features.map((f) => ({ ...f })),
          faq: content.faq.map((f) => ({ ...f })),
          updatedAt: daysAgo(7),
        },
      },
    ],
    logs,
    paymentMethod: { ...DEFAULT_PAYMENT_METHOD },
    notificationPrefs: { ...DEFAULT_NOTIFICATION_PREFS },
    addons: DEFAULT_ADDONS.map((a) => ({ ...a })),
    usageMeters: DEFAULT_USAGE.map((u) => ({ ...u })),
    rolePermissions: createDefaultRolePermissions(),
    adminSettings: { ...DEFAULT_ADMIN_SETTINGS },
  };
}

export type SeedData = ReturnType<typeof createSeedData>;
