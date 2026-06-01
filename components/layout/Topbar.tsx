"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface TopbarProps {
  title?: string;
  actions?: ReactNode;
}

export default function Topbar({
  title,
  actions,
}: TopbarProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="
        sticky
        top-0
        z-30
        flex
        h-20
        items-center
        justify-between
        border-b
        border-white/10
        bg-black/30
        px-8
        backdrop-blur-xl
      "
    >
      <div>
        {title && (
          <h1 className="text-xl font-semibold tracking-wide">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-4">
        {actions}
      </div>
    </motion.header>
  );
}