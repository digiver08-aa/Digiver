"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { mobileNavigation } from "@/config/navigation.config";
import { useMobile } from "@/hooks/useMobile";
import { cn } from "@/lib/utils";

export function MobileNavbar() {
  const pathname = usePathname();
  const isMobile = useMobile();

  if (!isMobile) {
    return null;
  }

  return (
    <motion.nav
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
      }}
      className="
        mobile-safe-area
        fixed
        inset-x-4
        bottom-4
        z-50
      "
    >
      <div
        className="
          relative
          overflow-hidden
          rounded-3xl
          border border-white/10
          bg-white/5
          backdrop-blur-xl
          shadow-atmospheric
        "
      >
        <div className="grid grid-cols-5 items-center">
          {mobileNavigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex justify-center"
              >
                <div
                  className="
                    relative
                    flex
                    min-h-18
                    w-full
                    flex-col
                    items-center
                    justify-center
                    gap-1
                    px-2
                    py-3
                  "
                >
                  {isActive && (
                    <motion.div
                      layoutId="mobile-nav-indicator"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                      className="
                        absolute
                        inset-x-2
                        inset-y-2
                        rounded-2xl
                        bg-white/10
                      "
                    />
                  )}

                  <motion.div
                    animate={{
                      scale: isActive ? 1.05 : 1,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                    className="relative z-10"
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 transition-colors duration-200",
                        isActive
                          ? "text-foreground"
                          : "text-foreground/60"
                      )}
                    />
                  </motion.div>

                  <span
                    className={cn(
                      "relative z-10 text-[11px] font-medium transition-colors",
                      isActive
                        ? "text-foreground"
                        : "text-foreground/60"
                    )}
                  >
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}