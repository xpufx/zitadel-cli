export function fmtDate(ts: { seconds?: bigint | number; nanos?: number } | undefined): string {
  if (!ts) return "-";
  const ms = Number(ts.seconds ?? 0) * 1000 + (ts.nanos ?? 0) / 1_000_000;
  if (!ms) return "-";
  return new Date(ms).toLocaleString();
}

export function fmtState(state: string | undefined): { label: string; className: string } {
  switch (state) {
    case "active":
    case "STATE_ACTIVE":
      return { label: "Active", className: "badge-green" };
    case "deactivated":
    case "STATE_DEACTIVATED":
      return { label: "Deactivated", className: "badge-yellow" };
    case "deleted":
    case "STATE_DELETED":
      return { label: "Deleted", className: "badge-red" };
    case "locked":
    case "STATE_LOCKED":
      return { label: "Locked", className: "badge-red" };
    case "STATE_REMOVED":
      return { label: "Removed", className: "badge-gray" };
    default:
      return { label: state ?? "Unknown", className: "badge-gray" };
  }
}
