import { ReactNode } from "react";

import AppLayout from "@/components/layout/AppLayout";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import SidebarNavigation from "@/components/layout/SidebarNavigation";

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  return (
    <AppLayout
      topbar={
        <Topbar title="Digiver" />
      }
      leftSidebar={
        <Sidebar position="left">
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold tracking-wide">
                Digiver
              </h2>
            </div>

            <SidebarNavigation />
          </div>
        </Sidebar>
      }
      rightSidebar={
        <Sidebar position="right">
          <div className="space-y-4">
            <h3 className="font-medium">
              Activity
            </h3>

            <div className="rounded-xl bg-white/5 p-4">
              Future widgets
            </div>
          </div>
        </Sidebar>
      }
    >
      {children}
    </AppLayout>
  );
}