export function fmtDate(ts: { seconds?: bigint | number; nanos?: number } | undefined): string {
  if (!ts) return "-";
  const ms = Number(ts.seconds ?? 0) * 1000 + (ts.nanos ?? 0) / 1_000_000;
  if (!ms) return "-";
  return new Date(ms).toLocaleString();
}

export function fmtState(state: string | undefined): { label: string; className: string; variant: "default" | "secondary" | "destructive" | "outline" } {
  switch (state) {
    case "active":
    case "STATE_ACTIVE":
      return { label: "Active", className: "", variant: "default" };
    case "deactivated":
    case "STATE_DEACTIVATED":
      return { label: "Deactivated", className: "", variant: "secondary" };
    case "deleted":
    case "STATE_DELETED":
    case "locked":
    case "STATE_LOCKED":
      return { label: state.includes("locked") ? "Locked" : "Deleted", className: "", variant: "destructive" };
    case "STATE_REMOVED":
      return { label: "Removed", className: "", variant: "outline" };
    default:
      return { label: state ?? "Unknown", className: "", variant: "outline" };
  }
}
