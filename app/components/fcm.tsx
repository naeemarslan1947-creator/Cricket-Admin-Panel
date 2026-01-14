"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { messaging, onMessage, getFreshFCMToken, clearFCMToken } from "../lib/firebase/firebase";
import { SET_NEW_NOTIFICATION } from "../../redux/actionTypes";
import { setNotificationCount } from "@/redux/actions";
import { NotificationPopup, NotificationItem } from "./common/NotificationPopup";
import { RootState } from "@/redux/reducer";

// Extend Window interface for global variables
declare global {
  interface Window {
    showNotificationToast?: (data: { title: string; message: string; color?: string; duration?: number }) => void;
    notificationsQueue?: NotificationItem[];
    notificationUpdateCounter?: number;
    addEventListener(type: 'notificationAdded', listener: (e: CustomEvent) => void): void;
    removeEventListener(type: 'notificationAdded', listener: (e: CustomEvent) => void): void;
    dispatchEvent(event: Event): boolean;
    dispatchEvent(event: CustomEvent): boolean;
  }
}

// Create a global function for showing notifications
const createNotificationHandler = () => {
  if (typeof window !== "undefined") {
    // Store notifications in a global array
    window.notificationsQueue = window.notificationsQueue || [];

    window.showNotificationToast = (data: { title: string; message: string; color?: string; duration?: number }) => {
      const notification: NotificationItem = {
        id: `fcm-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        title: data.title,
        body: data.message,
        type: "info",
        timestamp: Date.now(),
        data: data,
      };

      // Add to queue
      window.notificationsQueue = [...(window.notificationsQueue || []), notification];

      // Trigger update by dispatching custom event
      window.dispatchEvent(new CustomEvent('notificationAdded', { detail: notification }));

      console.log("FCM: Notification queued:", notification);
    };

    // Listen for notification updates
    window.addEventListener('notificationAdded', ((e: CustomEvent) => {
      // Force re-render of NotificationPopup by updating a counter
      window.notificationUpdateCounter = (window.notificationUpdateCounter || 0) + 1;
      window.dispatchEvent(new Event('notificationUpdated'));
    }) as EventListener);
  }
};

const FCM = () => {
  const dispatch = useDispatch();
  const initializedRef = useRef(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const currentCount = useSelector((state: RootState) => state.notificationCount);

  // Initialize FCM token on mount
  useEffect(() => {
    const initFCM = async () => {
      try {
        console.log("FCM: Initializing FCM component...");

        // Create global notification handler
        createNotificationHandler();

        // Clear any existing token to get a fresh one
        clearFCMToken();

        // Get a fresh FCM token
        const token = await getFreshFCMToken();
        if (token) {
          console.log("FCM: Token initialized successfully:", token.substring(0, 50) + "...");

          // Dispatch event for token initialization
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent('fcmTokenInitialized', { detail: token }));
          }
        } else {
          console.warn("FCM: No token obtained during initialization");
        }
      } catch (error) {
        console.error("FCM: Error initializing FCM:", error);
      }
    };

    // Only initialize once
    if (!initializedRef.current) {
      initializedRef.current = true;
      initFCM();
    }
  }, []);

  // Listen for notification queue updates
  useEffect(() => {
    const handleNotificationAdded = (e: CustomEvent) => {
      setNotifications(prev => [...prev, e.detail]);
    };

    window.addEventListener('notificationAdded', handleNotificationAdded as EventListener);

    return () => {
      window.removeEventListener('notificationAdded', handleNotificationAdded as EventListener);
    };
  }, []);

  // Set up message listener for foreground messages
  useEffect(() => {
    if (!messaging) {
      console.warn("FCM: Messaging not available in component");
      return;
    }

    console.log("FCM: Setting up message listener...");

    try {
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log("FCM: Foreground message received:", payload);

        const { colour, color, ...restData } = payload?.data ?? {};
        const { title, body, ...restNotification } = payload?.notification ?? {};

        // Set new notification flag
        dispatch({ type: SET_NEW_NOTIFICATION, payload: true });
        
        // Increment notification count
        dispatch(setNotificationCount(currentCount + 1));

        // Log the full payload for debugging
        console.log("FCM: Message payload:", JSON.stringify(payload, null, 2));

        // Show notification
        const notificationTitle = title || 'New Notification';
        const notificationBody = body || 'You have a new notification';
        const notificationColor = colour || color || "#4F46E5";

        console.log("FCM: Showing notification:", { title: notificationTitle, body: notificationBody, color: notificationColor });

        // Use our global function
        if (typeof window !== "undefined" && window.showNotificationToast) {
          window.showNotificationToast({
            title: notificationTitle,
            message: notificationBody,
            color: notificationColor,
            duration: 5000,
          });
        } else {
          // Fallback to browser notification
          if (Notification.permission === "granted") {
            new Notification(notificationTitle, {
              body: notificationBody,
              icon: '/image/notification-icon.png',
              badge: '/image/badge-icon.png',
              tag: payload.messageId || 'default-notification',
            });
          }
        }
      });

      return () => {
        console.log("FCM: Cleaning up message listener");
        if (unsubscribe) unsubscribe();
      };
    } catch (error) {
      console.error("FCM: Error setting up message listener:", error);
    }
  }, [dispatch]);

  // Handle notification click/dismiss
  const handleNotificationClick = useCallback((notification: NotificationItem) => {
    console.log("FCM: Notification clicked:", notification);
    // Navigate to notifications page or handle click
    const url = notification.data?.url as string | undefined;
    if (url) {
      window.location.href = url;
    }
  }, []);

  const handleClearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <>
      {/* Render notification popup for FCM notifications */}
      {notifications.length > 0 && (
        <NotificationPopup
          notifications={notifications}
          position="top-right"
          autoCloseDelay={5000}
          onNotificationClick={handleNotificationClick}
          onClearAll={handleClearAll}
        />
      )}
    </>
  );
};

export default FCM;

