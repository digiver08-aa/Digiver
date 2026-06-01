import { ReactNode } from "react";

interface AppLayoutProps {
  leftSidebar?: ReactNode;
  rightSidebar?: ReactNode;
  topbar?: ReactNode;
  children: ReactNode;
}

export default function AppLayout({
  leftSidebar,
  rightSidebar,
  topbar,
  children,
}: AppLayoutProps) {
  return (
    <div
      className="
        min-h-screen
        bg-background
        text-foreground
      "
    >
      <div className="flex min-h-screen">
        {/* Left Sidebar */}
        <div className="hidden xl:block">
          {leftSidebar}
        </div>

        {/* Main Area */}
        <div className="flex min-w-0 flex-1 flex-col">
          {topbar}

          <main
            className="
              flex-1
              overflow-x-hidden
            "
          >
            {children}
          </main>
        </div>

        {/* Right Sidebar */}
        <div className="hidden 2xl:block">
          {rightSidebar}
        </div>
      </div>
    </div>
  );
}