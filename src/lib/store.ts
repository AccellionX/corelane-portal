"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createSeedData, type SeedData } from "./mock-data";
import type {
  ActivityLog,
  AdminSettings,
  Booking,
  CmsContent,
  CoreModule,
  DemoEnvironment,
  DemoRole,
  DemoView,
  NotificationPrefs,
  PaymentMethod,
  PermissionId,
  Plan,
  PlanId,
  SupportTicket,
  UploadedFile,
  UserRole,
} from "./types";

function cloneContent(c: CmsContent): CmsContent {
  return {
    ...c,
    features: c.features.map((f) => ({ ...f })),
    faq: c.faq.map((f) => ({ ...f })),
  };
}

export interface CorelaneState extends SeedData {
  coreModule: CoreModule;
  demoView: DemoView;
  role: DemoRole;
  environment: DemoEnvironment;
  hydrated: boolean;

  setHydrated: (value: boolean) => void;
  setCoreModule: (module: CoreModule) => void;
  setDemoView: (view: DemoView) => void;
  setRole: (role: DemoRole) => void;
  setEnvironment: (environment: DemoEnvironment) => void;

  addLog: (actor: string, action: string, target: string, timestamp?: string) => void;
  suspendUser: (userId: string) => void;
  reactivateUser: (userId: string) => void;
  changeRole: (userId: string, role: UserRole) => void;
  refundTransaction: (transactionId: string) => void;
  updateContent: (patch: Partial<CmsContent>) => void;
  setContentDraft: (draft: CmsContent) => void;
  publishContent: () => void;
  restoreContentVersion: (versionId: string) => void;
  resolveTicket: (ticketId: string) => void;
  assignTicket: (ticketId: string, assigneeId: string | undefined) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (userId: string) => void;
  addBooking: (booking: Omit<Booking, "id">) => void;
  cancelBooking: (id: string) => void;
  rescheduleBooking: (id: string, date: string, endDate: string) => void;
  changePlan: (userId: string, planId: PlanId) => void;
  upsertPlan: (plan: Plan) => void;
  deletePlan: (planId: string) => void;
  updatePaymentMethod: (method: PaymentMethod) => void;
  toggleAddon: (addonId: string) => void;
  addTicket: (
    ticket: Omit<SupportTicket, "id" | "createdAt" | "updatedAt" | "messages"> & {
      message: string;
    }
  ) => void;
  replyToTicket: (ticketId: string, body: string, authorName: string) => void;
  addFile: (file: Omit<UploadedFile, "id" | "uploadedAt">) => void;
  removeFile: (id: string) => void;
  updateProfile: (
    userId: string,
    patch: { name?: string; email?: string; company?: string }
  ) => void;
  updateNotificationPrefs: (prefs: Partial<NotificationPrefs>) => void;
  setRolePermission: (role: UserRole, permission: PermissionId, allowed: boolean) => void;
  updateAdminSettings: (patch: Partial<AdminSettings>) => void;
  resetDemo: () => void;
}

function actorName(get: () => CorelaneState): string {
  const { role, users } = get();
  const match = users.find((u) => u.role === role);
  return match?.name ?? role;
}

function safeLocalStorage(): Storage | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const key = "__corelane_ls_test__";
    window.localStorage.setItem(key, "1");
    window.localStorage.removeItem(key);
    return window.localStorage;
  } catch {
    return undefined;
  }
}

const seed = createSeedData();

export const useCorelaneStore = create<CorelaneState>()(
  persist(
    (set, get) => ({
      ...seed,
      coreModule: "bookings",
      demoView: "public",
      role: "Admin",
      environment: "production",
      hydrated: false,

      setHydrated: (value) => set({ hydrated: value }),
      setCoreModule: (module) => {
        const actor = actorName(get);
        set({ coreModule: module });
        get().addLog(actor, "changed core business model", module);
      },
      setDemoView: (view) => set({ demoView: view }),
      setRole: (role) => set({ role }),
      setEnvironment: (environment) => {
        const actor = actorName(get);
        set({ environment });
        get().addLog(actor, "switched environment", environment);
      },

      addLog: (actor, action, target, timestamp) => {
        const entry: ActivityLog = {
          id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          actor,
          action,
          target,
          timestamp: timestamp ?? new Date().toISOString(),
        };
        set((state) => ({ logs: [entry, ...state.logs] }));
      },

      suspendUser: (userId) => {
        const actor = actorName(get);
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId ? { ...u, status: "suspended" as const } : u
          ),
        }));
        get().addLog(actor, "suspended user", userId);
      },

      reactivateUser: (userId) => {
        const actor = actorName(get);
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId ? { ...u, status: "active" as const } : u
          ),
        }));
        get().addLog(actor, "reactivated user", userId);
      },

      changeRole: (userId, role) => {
        const actor = actorName(get);
        set((state) => ({
          users: state.users.map((u) => (u.id === userId ? { ...u, role } : u)),
        }));
        get().addLog(actor, "changed role", `${userId} → ${role}`);
      },

      refundTransaction: (transactionId) => {
        const actor = actorName(get);
        const txn = get().transactions.find((t) => t.id === transactionId);
        if (!txn || txn.status !== "paid") return;
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === transactionId ? { ...t, status: "refunded" as const } : t
          ),
          invoices: state.invoices.map((inv) =>
            inv.userId === txn.userId &&
            inv.amount === txn.amount &&
            inv.status === "paid"
              ? { ...inv, status: "void" as const }
              : inv
          ),
        }));
        get().addLog(actor, "refunded transaction", transactionId);
      },

      updateContent: (patch) => {
        set((state) => ({
          contentDraft: {
            ...state.contentDraft,
            ...patch,
            published: false,
            updatedAt: new Date().toISOString(),
          },
        }));
      },

      setContentDraft: (draft) => set({ contentDraft: draft }),

      publishContent: () => {
        const actor = actorName(get);
        const now = new Date().toISOString();
        const published = cloneContent({
          ...get().contentDraft,
          published: true,
          updatedAt: now,
        });
        set((state) => ({
          content: published,
          contentDraft: cloneContent(published),
          contentVersions: [
            {
              id: `ver_${Date.now()}`,
              publishedAt: now,
              actor,
              snapshot: cloneContent(published),
            },
            ...state.contentVersions,
          ].slice(0, 5),
        }));
        get().addLog(actor, "published CMS content", "Marketing homepage");
      },

      restoreContentVersion: (versionId) => {
        const actor = actorName(get);
        const version = get().contentVersions.find((v) => v.id === versionId);
        if (!version) return;
        const restored = cloneContent({
          ...version.snapshot,
          published: false,
          updatedAt: new Date().toISOString(),
        });
        set({ contentDraft: restored });
        get().addLog(actor, "restored CMS version", versionId);
      },

      resolveTicket: (ticketId) => {
        const actor = actorName(get);
        const now = new Date().toISOString();
        set((state) => ({
          tickets: state.tickets.map((t) => {
            if (t.id !== ticketId) return t;
            return {
              ...t,
              status: "resolved" as const,
              updatedAt: now,
              messages: [
                ...t.messages,
                {
                  id: `msg_resolve_${Date.now()}`,
                  authorId: "system",
                  authorName: actor,
                  authorRole: get().role,
                  body: `Marked resolved by ${actor}.`,
                  createdAt: now,
                },
              ],
            };
          }),
        }));
        get().addLog(actor, "resolved ticket", ticketId);
      },

      assignTicket: (ticketId, assigneeId) => {
        const actor = actorName(get);
        set((state) => ({
          tickets: state.tickets.map((t) =>
            t.id === ticketId
              ? { ...t, assignedTo: assigneeId, updatedAt: new Date().toISOString() }
              : t
          ),
        }));
        get().addLog(
          actor,
          "assigned ticket",
          `${ticketId} → ${assigneeId ?? "unassigned"}`
        );
      },

      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },

      markAllNotificationsRead: (userId) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.userId === userId ? { ...n, read: true } : n
          ),
        }));
      },

      addBooking: (booking) => {
        const id = `bk_${Date.now().toString(36)}`;
        set((state) => ({
          bookings: [{ ...booking, id }, ...state.bookings],
        }));
      },

      cancelBooking: (id) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === id ? { ...b, status: "cancelled" as const } : b
          ),
        }));
      },

      rescheduleBooking: (id, date, endDate) => {
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b.id === id ? { ...b, date, endDate, status: "confirmed" as const } : b
          ),
        }));
      },

      changePlan: (userId, planId) => {
        const actor = actorName(get);
        set((state) => ({
          users: state.users.map((u) => (u.id === userId ? { ...u, plan: planId } : u)),
        }));
        get().addLog(actor, "changed plan", `${userId} → ${planId}`);
      },

      upsertPlan: (plan) => {
        const actor = actorName(get);
        set((state) => {
          const exists = state.plans.some((p) => p.id === plan.id);
          return {
            plans: exists
              ? state.plans.map((p) => (p.id === plan.id ? plan : p))
              : [...state.plans, plan],
          };
        });
        get().addLog(actor, "upserted plan", plan.id);
      },

      deletePlan: (planId) => {
        const actor = actorName(get);
        set((state) => ({
          plans: state.plans.filter((p) => p.id !== planId),
        }));
        get().addLog(actor, "deleted plan", planId);
      },

      updatePaymentMethod: (method) => set({ paymentMethod: method }),

      toggleAddon: (addonId) => {
        set((state) => ({
          addons: state.addons.map((a) =>
            a.id === addonId ? { ...a, active: !a.active } : a
          ),
        }));
      },

      addTicket: ({ message, ...rest }) => {
        const now = new Date().toISOString();
        const user = get().users.find((u) => u.id === rest.userId);
        const ticket: SupportTicket = {
          ...rest,
          id: `tkt_${Date.now().toString(36)}`,
          createdAt: now,
          updatedAt: now,
          messages: [
            {
              id: `msg_${Date.now()}`,
              authorId: rest.userId,
              authorName: user?.name ?? "You",
              authorRole: "User",
              body: message,
              createdAt: now,
            },
          ],
        };
        set((state) => ({ tickets: [ticket, ...state.tickets] }));
      },

      replyToTicket: (ticketId, body, authorName) => {
        const now = new Date().toISOString();
        set((state) => ({
          tickets: state.tickets.map((t) => {
            if (t.id !== ticketId) return t;
            return {
              ...t,
              status: t.status === "resolved" ? t.status : ("pending" as const),
              updatedAt: now,
              messages: [
                ...t.messages,
                {
                  id: `msg_${Date.now()}`,
                  authorId: "current",
                  authorName,
                  authorRole: "User" as const,
                  body,
                  createdAt: now,
                },
              ],
            };
          }),
        }));
      },

      addFile: (file) => {
        const entry: UploadedFile = {
          ...file,
          id: `file_${Date.now().toString(36)}`,
          uploadedAt: new Date().toISOString(),
        };
        set((state) => ({ files: [entry, ...state.files] }));
      },

      removeFile: (id) => {
        set((state) => ({ files: state.files.filter((f) => f.id !== id) }));
      },

      updateProfile: (userId, patch) => {
        set((state) => ({
          users: state.users.map((u) => (u.id === userId ? { ...u, ...patch } : u)),
        }));
      },

      updateNotificationPrefs: (prefs) => {
        set((state) => ({
          notificationPrefs: { ...state.notificationPrefs, ...prefs },
        }));
      },

      setRolePermission: (role, permission, allowed) => {
        const actor = actorName(get);
        set((state) => ({
          rolePermissions: {
            ...state.rolePermissions,
            [role]: {
              ...state.rolePermissions[role],
              [permission]: allowed,
            },
          },
        }));
        get().addLog(
          actor,
          allowed ? "granted permission" : "revoked permission",
          `${role} · ${permission}`
        );
      },

      updateAdminSettings: (patch) => {
        const actor = actorName(get);
        set((state) => ({
          adminSettings: { ...state.adminSettings, ...patch },
        }));
        get().addLog(actor, "updated admin settings", Object.keys(patch).join(", "));
      },

      resetDemo: () => {
        const fresh = createSeedData();
        set({
          ...fresh,
          coreModule: get().coreModule,
          demoView: get().demoView,
          role: get().role,
          environment: get().environment,
        });
      },
    }),
    {
      name: "corelane-demo-v3",
      skipHydration: true,
      storage: createJSONStorage(() => {
        const ls = safeLocalStorage();
        return {
          getItem: (name) => {
            try {
              return ls?.getItem(name) ?? null;
            } catch {
              return null;
            }
          },
          setItem: (name, value) => {
            try {
              ls?.setItem(name, value);
            } catch {
              /* ignore */
            }
          },
          removeItem: (name) => {
            try {
              ls?.removeItem(name);
            } catch {
              /* ignore */
            }
          },
        };
      }),
      partialize: (state) => ({
        users: state.users,
        plans: state.plans,
        transactions: state.transactions,
        bookings: state.bookings,
        orders: state.orders,
        invoices: state.invoices,
        tickets: state.tickets,
        notifications: state.notifications,
        files: state.files,
        content: state.content,
        contentDraft: state.contentDraft,
        contentVersions: state.contentVersions,
        logs: state.logs,
        paymentMethod: state.paymentMethod,
        notificationPrefs: state.notificationPrefs,
        addons: state.addons,
        usageMeters: state.usageMeters,
        rolePermissions: state.rolePermissions,
        adminSettings: state.adminSettings,
        coreModule: state.coreModule,
        demoView: state.demoView,
        role: state.role,
        environment: state.environment,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

export function selectCurrentUser(state: CorelaneState) {
  return state.users.find((u) => u.role === "User") ?? state.users[10];
}

export function contentHasUnsavedChanges(state: CorelaneState) {
  const a = state.contentDraft;
  const b = state.content;
  return (
    a.heroHeadline !== b.heroHeadline ||
    a.heroSubtext !== b.heroSubtext ||
    JSON.stringify(a.features) !== JSON.stringify(b.features) ||
    JSON.stringify(a.faq) !== JSON.stringify(b.faq) ||
    !a.published
  );
}
