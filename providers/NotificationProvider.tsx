"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { NotificationContext } from "@/context/NotificationContext";

import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  subscribeToNotifications,
} from "@/services/notifications";

import type { Notification } from "@/types/notification.types";

interface NotificationProviderProps {
  personaId: string;
  children: React.ReactNode;
}

export function NotificationProvider({
  personaId,
  children,
}: NotificationProviderProps) {
  const [notifications, setNotifications] =
    useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingReadId, setMarkingReadId] =
    useState<string | null>(null);
  const [markingAllRead, setMarkingAllRead] =
    useState(false);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const response = await getNotifications({ personaId });

      setNotifications(response.notifications);
      setUnreadCount(response.unreadCount);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load notifications.",
      );
    }
  }, [personaId]);

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      setLoading(true);
      setError(null);

      try {
        const response =
          await getNotifications({ personaId });

        if (!mounted) return;

        setNotifications(response.notifications);
        setUnreadCount(response.unreadCount);
      } catch (err) {
        if (mounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load notifications.",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void initialize();

    return () => {
      mounted = false;
    };
  }, [personaId]);

  useEffect(() => {
    let subscription:
      | Awaited<ReturnType<typeof subscribeToNotifications>>
      | undefined;

    async function setup() {
      try {
        subscription = await subscribeToNotifications(
          personaId,
          (notification) => {
            setNotifications((previous) => {
              const existing = previous.find(
                (item) => item.id === notification.id,
              );

              if (
                !notification.is_read &&
                !existing
              ) {
                setUnreadCount((count) => count + 1);
              }

              if (
                existing &&
                existing.is_read === notification.is_read
              ) {
                return previous;
              }

              return [
                notification,
                ...previous.filter(
                  (item) => item.id !== notification.id,
                ),
              ];
            });
          },
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to connect to notification updates.",
        );
      }
    }

    void setup();

    return () => {
      if (subscription) {
        void subscription.unsubscribe();
      }
    };
  }, [personaId]);

  const markReadAction = useCallback(
    async (notificationId: string) => {
      setMarkingReadId(notificationId);
      setError(null);

      try {
        await markAsRead(notificationId);

        setNotifications((previous) =>
          previous.map((notification) => {
            if (
              notification.id !== notificationId ||
              notification.is_read
            ) {
              return notification;
            }

            return {
              ...notification,
              is_read: true,
              read_at: new Date().toISOString(),
            };
          }),
        );

        setUnreadCount((count) => Math.max(0, count - 1));
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to mark notification as read.";
        setError(message);
        throw new Error(message);
      } finally {
        setMarkingReadId(null);
      }
    },
    [],
  );

  const markAllReadAction = useCallback(async () => {
    if (unreadCount <= 0 || markingAllRead) {
      return;
    }

    setMarkingAllRead(true);
    setError(null);

    try {
      await markAllAsRead(personaId);

      const readAt = new Date().toISOString();
      setNotifications((previous) =>
        previous.map((notification) => ({
          ...notification,
          is_read: true,
          read_at: readAt,
        })),
      );
      setUnreadCount(0);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to mark all notifications as read.";
      setError(message);
      throw new Error(message);
    } finally {
      setMarkingAllRead(false);
    }
  }, [personaId, unreadCount, markingAllRead]);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      loading,
      error,
      markingReadId,
      markingAllRead,
      refresh,
      markRead: markReadAction,
      markAllRead: markAllReadAction,
    }),
    [
      notifications,
      unreadCount,
      loading,
      error,
      markingReadId,
      markingAllRead,
      refresh,
      markReadAction,
      markAllReadAction,
    ],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
