export type UserRole = "Admin" | "Manager" | "Support" | "User";
export type UserStatus = "active" | "suspended";
export type PlanId = string;
export type TransactionStatus = "paid" | "refunded" | "failed";
export type BookingStatus = "confirmed" | "pending" | "cancelled" | "completed";
export type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";
export type InvoiceStatus = "paid" | "open" | "overdue" | "void";
export type TicketStatus = "open" | "pending" | "resolved";
export type TicketPriority = "low" | "medium" | "high" | "urgent";
/** Product vertical that drives the adaptive dashboard module */
export type CoreModule = "bookings" | "orders" | "subscriptions" | "uploads";
/** Demo pill surface switcher */
export type DemoView = "public" | "app" | "admin";
export type DemoRole = "Admin" | "Manager" | "Support";
export type DemoEnvironment = "production" | "staging";

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  interval: "month";
  description: string;
  features: string[];
  highlighted?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  plan: PlanId;
  signupDate: string;
  company: string;
  lastActive: string;
  avatarHue: number;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  status: TransactionStatus;
  planId: PlanId;
  description: string;
  date: string;
  paymentMethod: string;
}

export interface Booking {
  id: string;
  userId: string;
  title: string;
  date: string;
  endDate: string;
  status: BookingStatus;
  location: string;
  attendees: number;
}

export interface OrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  date: string;
  trackingNumber?: string;
  timeline?: { label: string; at: string; done: boolean }[];
}

export interface Invoice {
  id: string;
  userId: string;
  amount: number;
  status: InvoiceStatus;
  issuedDate: string;
  dueDate: string;
  planId: PlanId;
  number: string;
}

export interface TicketMessage {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole | "system";
  body: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
  messages: TicketMessage[];
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  read: boolean;
  type: "billing" | "product" | "security" | "support";
  createdAt: string;
}

export interface UploadedFile {
  id: string;
  userId: string;
  name: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

export interface PaymentMethod {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

export interface NotificationPrefs {
  product: boolean;
  billing: boolean;
  security: boolean;
  support: boolean;
  digest: boolean;
}

export interface FeatureContent {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface CmsContent {
  heroHeadline: string;
  heroSubtext: string;
  features: FeatureContent[];
  faq: FaqItem[];
  published: boolean;
  updatedAt: string;
}

export interface CmsVersion {
  id: string;
  publishedAt: string;
  actor: string;
  snapshot: CmsContent;
}

export interface AdminSettings {
  companyName: string;
  supportEmail: string;
  timezone: string;
  docsUrl: string;
  lastDeployAt: string;
  githubRepo: string;
}

export type PermissionId =
  | "users.manage"
  | "users.suspend"
  | "billing.refund"
  | "plans.manage"
  | "tickets.assign"
  | "tickets.resolve"
  | "content.publish"
  | "settings.edit"
  | "logs.export";

export type RolePermissions = Record<UserRole, Record<PermissionId, boolean>>;

export interface ActivityLog {
  id: string;
  actor: string;
  action: string;
  target: string;
  timestamp: string;
}

export interface SubscriptionAddon {
  id: string;
  name: string;
  price: number;
  active: boolean;
}

export interface UsageMeter {
  id: string;
  label: string;
  used: number;
  limit: number;
  unit: string;
}
