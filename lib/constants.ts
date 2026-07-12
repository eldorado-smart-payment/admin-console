export const NAV_ITEMS = [
  { label: "Dashboard", icon: "dashboard", href: "/dashboard" },
  { label: "Transactions", icon: "receipt_long", href: "/transactions" },
  { label: "Bill Payments", icon: "payments", href: "/bill-payments" },
  { label: "Admin Console", icon: "admin_panel_settings", href: "/admin" },
  { label: "Compliance", icon: "gavel", href: "/kyc" },
  { label: "Support", icon: "help_center", href: "#" },
] as const;

export const BOTTOM_NAV_ITEMS = [
  { label: "Settings", icon: "settings", href: "#" },
  { label: "Logout", icon: "logout", href: "#" },
] as const;
