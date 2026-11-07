import { BarChart3, Info, LayoutDashboard, MoreHorizontal, ShoppingBag, Smartphone, Users } from "lucide-react";

export const SIDEBAR_ITEMS = [
  { to: "/", label: "Summary", icon: LayoutDashboard, end: true },
  { to: "/clients", label: "Clients", icon: Users },
  { to: "/orders", label: "Online Orders", icon: ShoppingBag },
  { to: "/vodafone", label: "Vodafone Cash", icon: Smartphone },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/about", label: "About Raheeq", icon: Info },
];

export const TAB_ITEMS = [
  { to: "/", label: "Summary", icon: LayoutDashboard, end: true },
  { to: "/clients", label: "Clients", icon: Users },
  { to: "/orders", label: "Orders", icon: ShoppingBag },
  { to: "/vodafone", label: "Vodafone", icon: Smartphone },
  { to: "/more", label: "More", icon: MoreHorizontal, alsoActive: ["/analytics", "/about"] },
];
