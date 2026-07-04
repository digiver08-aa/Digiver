"use client";

import {
  createContext,
  useContext,
} from "react";

import type {
  Notification,
} from "@/types/notification.types";

export interface NotificationContextValue {
  notifications: Notification[];

  unreadCount: number;

  loading: boolean;

  refresh: () => Promise<void>;

  markRead: (
    notificationId: string
  ) => Promise<void>;

  markAllRead: () => Promise<void>;
}

export const NotificationContext =
  createContext<
    NotificationContextValue | undefined
  >(undefined);

export function useNotificationContext() {
  const context =
    useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotificationContext must be used within NotificationProvider"
    );
  }

  return context;
}