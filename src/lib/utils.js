import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Safely parse date from various formats (ISO, SQL string, timestamp, Jackson array)
export function parseDateSafely(dateVal) {
  if (!dateVal) return null;
  try {
    let d;
    if (Array.isArray(dateVal)) {
      d = new Date(
        dateVal[0],
        dateVal[1] - 1,
        dateVal[2],
        dateVal[3] || 0,
        dateVal[4] || 0,
        dateVal[5] || 0
      );
    } else if (typeof dateVal === "string") {
      let s = dateVal.trim();
      // Handle MySQL "YYYY-MM-DD HH:mm:ss" format by replacing space with "T"
      if (!s.includes("T") && s.includes(" ")) {
        s = s.replace(" ", "T");
      }
      d = new Date(s);
    } else {
      d = new Date(dateVal);
    }
    if (isNaN(d.getTime())) return null;
    return d;
  } catch {
    return null;
  }
}

// Safely format date from ISO string, timestamp, or Jackson array [year, month, day, hour, min]
export function formatOrderDate(dateVal) {
  const d = parseDateSafely(dateVal);
  if (!d) return "N/A";
  try {
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "N/A";
  }
}

// Safely format date & time for orders and order status histories (IST 12-hour format)
export function formatOrderDateTime(dateVal) {
  const d = parseDateSafely(dateVal);
  if (!d) return "N/A";
  try {
    return d.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "N/A";
  }
}
