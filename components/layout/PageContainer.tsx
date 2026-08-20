import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
}

export default function PageContainer({
  children,
}: PageContainerProps) {
  return (
    <div
      className="mx-auto w-full max-w-350 px-4 py-8 sm:px-8 sm:py-10"
    >
      {children}
    </div>
  );
}