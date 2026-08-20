/* eslint-disable @next/next/no-img-element */


import { cn } from "@/lib/utils";

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-16 w-16",
};

export function Avatar({
  src,
  alt = "Avatar",
  size = "md",
  className,
}: AvatarProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-full border border-white/10",
        sizeClasses[size],
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="h-full w-full bg-muted" />
      )}
    </div>
  );
}