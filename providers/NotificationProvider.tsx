"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  NotificationContext,
} from "@/context/NotificationContext";

import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  subscribeToNotifications,
} from "@/services/notifications";

import type {
  Notification,
} from "@/types/notification.types";

interface NotificationProviderProps {
  personaId: string;

  children: React.ReactNode;
}

export function NotificationProvider({
  personaId,
  children,
}: NotificationProviderProps) {
  const [
    notifications,
    setNotifications,
  ] = useState<Notification[]>([]);

  const [
    unreadCount,
    setUnreadCount,
  ] = useState(0);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const refresh =
    useCallback(async () => {
      const response =
        await getNotifications({
          personaId,
        });

      setNotifications(
        response.notifications
      );

      setUnreadCount(
        response.unreadCount
      );
    }, [personaId]);

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        const response =
          await getNotifications({
            personaId,
          });

        if (!mounted) {
          return;
        }

        setNotifications(
          response.notifications
        );

        setUnreadCount(
          response.unreadCount
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    initialize();

    return () => {
      mounted = false;
    };
  }, [personaId]);

  useEffect(() => {
    let subscription:
      | Awaited<
          ReturnType<
            typeof subscribeToNotifications
          >
        >
      | undefined;

    async function setup() {
      subscription =
        await subscribeToNotifications(
          personaId,
          (notification) => {
            setNotifications(
              (previous) => [
                notification,
                ...previous,
              ]
            );

            setUnreadCount(
              (count) => count + 1
            );
          }
        );
    }

    setup();

    return () => {
      if (subscription) {
        void subscription.unsubscribe();
      }
    };
  }, [personaId]);

  const markRead =
    useCallback(
      async (
        notificationId: string
      ) => {
        await markAsRead(
          notificationId
        );

        setNotifications(
          (previous) =>
            previous.map(
              (notification) => {
                if (
                  notification.id !==
                  notificationId
                ) {
                  return notification;
                }

                if (
                  notification.is_read
                ) {
                  return notification;
                }

                return {
                  ...notification,
                  is_read: true,
                  read_at:
                    new Date().toISOString(),
                };
              }
            )
        );

        setUnreadCount(
          (count) =>
            Math.max(0, count - 1)
        );
      },
      []
    );

  const markAllRead =
    useCallback(async () => {
      await markAllAsRead(
        personaId
      );

      setNotifications(
        (previous) =>
          previous.map(
            (notification) => ({
              ...notification,
              is_read: true,
              read_at:
                new Date().toISOString(),
            })
          )
      );

      setUnreadCount(0);
    }, [personaId]);

  const value = useMemo(
    () => ({
      notifications,

      unreadCount,

      loading,

      refresh,

      markRead,

      markAllRead,
    }),
    [
      notifications,
      unreadCount,
      loading,
      refresh,
      markRead,
      markAllRead,
    ]
  );

  return (
    <NotificationContext.Provider
      value={value}
    >
      {children}
    </NotificationContext.Provider>
  );
}