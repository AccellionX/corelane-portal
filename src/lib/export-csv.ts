import type { ActivityLog } from "./types";

export function downloadActivityLogsCsv(logs: ActivityLog[], filename = "corelane-activity.csv") {
  const header = ["timestamp", "actor", "action", "target", "id"];
  const rows = logs.map((l) =>
    [l.timestamp, l.actor, l.action, l.target, l.id].map(escapeCsv).join(",")
  );
  const csv = [header.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function escapeCsv(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}
