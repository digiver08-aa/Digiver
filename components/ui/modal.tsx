"use client";

import * as Dialog from "@radix-ui/react-dialog";

import { X } from "lucide-react";

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
  titleId?: string;
}

export function Modal({
  open,
  onOpenChange,
  title,
  children,
  titleId,
}: ModalProps) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={onOpenChange}
    >
      <Dialog.Portal>
        <Dialog.Overlay
          className="
            fixed inset-0 z-50
            bg-black/60
            backdrop-blur-sm
          "
        />

        <Dialog.Content
          className="
            fixed left-1/2 top-1/2 z-50
            w-full max-w-lg
            -translate-x-1/2
            -translate-y-1/2
            rounded-2xl
            border border-white/10
            bg-muted
            p-6
            outline-none
          "
        >
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title id={titleId} className="font-semibold">
              {title}
            </Dialog.Title>

            <Dialog.Close asChild>
              <button
                className="min-h-11 min-w-11 rounded-md p-2 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                aria-label="Close dialog"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}