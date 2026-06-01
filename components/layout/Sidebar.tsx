"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SidebarProps {
  children?: ReactNode;
  position?: "left" | "right";
}

export default function Sidebar({
  children,
  position = "left",
}: SidebarProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: position === "left" ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="
        sticky
        top-0
        h-screen
        w-70
        shrink-0
        overflow-y-auto
        border-white/10
        bg-black/20
        backdrop-blur-xl
      "
    >
      <div className="flex min-h-full flex-col p-6">
        {children}
      </div>
    </motion.aside>
  );
}