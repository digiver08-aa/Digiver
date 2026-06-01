import type { LucideIcon } from "lucide-react";
import {
  Bell,
  Compass,
  House,
  MessageCircle,
  User,
} from "lucide-react";

import { ROUTES } from "@/constants/routes";

export interface NavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const mobileNavigation: NavigationItem[] = [
  {
    label: "Home",
    href: ROUTES.HOME,
    icon: House,
  },
  {
    label: "Explore",
    href: ROUTES.EXPLORE,
    icon: Compass,
  },
  {
    label: "Messages",
    href: ROUTES.MESSAGES,
    icon: MessageCircle,
  },
  {
    label: "Notifications",
    href: ROUTES.NOTIFICATIONS,
    icon: Bell,
  },
  {
    label: "Profile",
    href: ROUTES.SETTINGS,
    icon: User,
  },
];