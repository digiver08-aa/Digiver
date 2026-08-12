"use client";

// ============================================================
// DIGIVER
// ExploreTabs
// ============================================================

import { useCallback } from "react";

import {
  Circle,
  FileText,
  Search,
  Users,
} from "lucide-react";

import type { ExploreTab } from "@/context/ExploreContext";

import { useExplore } from "@/hooks/useExplore";

export interface ExploreTabsProps {
  className?: string;
}

interface TabItem {
  value: ExploreTab;
  label: string;
  icon: typeof Search;
}

const TABS: readonly TabItem[] = [
  {
    value: "all",
    label: "All",
    icon: Search,
  },
  {
    value: "personas",
    label: "Personas",
    icon: Users,
  },
  {
    value: "circles",
    label: "Circles",
    icon: Circle,
  },
  {
    value: "posts",
    label: "Posts",
    icon: FileText,
  },
] as const;

export function ExploreTabs({
  className,
}: ExploreTabsProps) {
  const {
    activeTab,
    changeTab,
  } = useExplore();

  const handleTabChange = useCallback(
    (tab: ExploreTab) => {
      if (tab === activeTab) {
        return;
      }

      changeTab(tab);
    },
    [activeTab, changeTab],
  );

  return (
    <nav
      aria-label="Explore result filters"
      className={[
        "overflow-x-auto",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex min-w-max gap-2">
        {TABS.map(
          ({
            value,
            label,
            icon: Icon,
          }) => {
            const selected =
              activeTab === value;

            return (
              <button
                key={value}
                type="button"
                aria-pressed={selected}
                onClick={() =>
                  handleTabChange(value)
                }
                className={[
                  "inline-flex items-center gap-2 whitespace-nowrap rounded-xl border px-4 py-2.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/20",
                  selected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-accent",
                ].join(" ")}
              >
                <Icon
                  className="h-4 w-4"
                  aria-hidden="true"
                />

                <span>{label}</span>
              </button>
            );
          },
        )}
      </div>
    </nav>
  );
}