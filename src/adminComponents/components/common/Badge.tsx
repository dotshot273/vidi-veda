import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "green" | "yellow" | "red" | "blue" | "gray" | "purple";
  size?: "sm" | "md";
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "gray",
  size = "sm",
  className = "",
  dot = false,
}) => {
  const variantStyles = {
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    yellow: "bg-amber-50 text-amber-700 border-amber-200",
    red: "bg-rose-50 text-rose-700 border-rose-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    purple: "bg-indigo-50 text-indigo-700 border-indigo-200",
    gray: "bg-slate-100 text-slate-700 border-slate-200",
  };

  const dotColors = {
    green: "bg-emerald-500",
    yellow: "bg-amber-500",
    red: "bg-rose-500",
    blue: "bg-blue-500",
    purple: "bg-indigo-500",
    gray: "bg-slate-400",
  };

  const sizeStyles = size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs font-medium";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${variantStyles[variant]} ${sizeStyles} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};

export function getStatusBadgeProps(status: string): {
  variant: "green" | "yellow" | "red" | "blue" | "gray" | "purple";
  label: string;
} {
  switch (status) {
    case "Confirmed":
    case "Tuition Started":
    case "Paid":
    case "Active":
    case "Completed":
      return { variant: "green", label: status };

    case "Parent Decision Pending":
    case "Registration Pending":
    case "Pending":
    case "Partially Paid":
    case "Shortlisted":
    case "Demo Scheduled":
    case "Contacted":
      return { variant: "yellow", label: status };

    case "Overdue":
    case "Cancelled":
    case "Not Interested":
    case "Inactive":
      return { variant: "red", label: status };

    case "New Lead":
    case "Teacher Searching":
    case "Demo Running":
    case "Demo":
    case "Available":
      return { variant: "blue", label: status };

    default:
      return { variant: "gray", label: status };
  }
}
