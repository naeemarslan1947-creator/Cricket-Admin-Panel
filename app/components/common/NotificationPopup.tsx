"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  X,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Info,
  Volume2,
  VolumeX,
  ChevronRight,
} from "lucide-react";

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  type: "success" | "warning" | "error" | "info";
  timestamp: number;
  read?: boolean;
  data?: Record<string, unknown>;
  onClick?: () => void;
  onDismiss?: () => void;
}

interface NotificationPopupProps {
  notifications: NotificationItem[];
  maxVisible?: number;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  autoCloseDelay?: number;
  showSoundToggle?: boolean;
  soundEnabled?: boolean;
  onSoundToggle?: (enabled: boolean) => void;
  onNotificationClick?: (notification: NotificationItem) => void;
  onMarkAllRead?: () => void;
  onClearAll?: () => void;
}

const typeConfig = {
  success: {
    icon: CheckCircle,
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    iconColor: "text-green-500",
    progressColor: "bg-green-500",
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    iconColor: "text-amber-500",
    progressColor: "bg-amber-500",
  },
  error: {
    icon: AlertCircle,
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    iconColor: "text-red-500",
    progressColor: "bg-red-500",
  },
  info: {
    icon: Info,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    iconColor: "text-blue-500",
    progressColor: "bg-blue-500",
  },
};

const sound = typeof window !== "undefined" ? new Audio("/notification-sound.mp3") : null;

const playNotificationSound = () => {
  if (sound) {
    sound.volume = 0.5;
    sound.play().catch(() => {
      // Auto-play might be blocked
      console.log("Notification sound blocked");
    });
  }
};

export function NotificationPopup({
  notifications,
  maxVisible = 5,
  position = "top-right",
  autoCloseDelay = 5000,
  showSoundToggle = true,
  soundEnabled = true,
  onSoundToggle,
  onNotificationClick,
  onMarkAllRead,
  onClearAll,
}: NotificationPopupProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<NotificationItem[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [soundOn, setSoundOn] = useState(soundEnabled);
  const [remainingTime, setRemainingTime] = useState<Record<string, number>>({});

  const handleDismiss = useCallback((id: string) => {
    setDismissedIds((prev) => new Set(prev).add(id));
  }, []);

  // Filter and sort notifications
  useEffect(() => {
    const unread = notifications
      .filter((n) => !dismissedIds.has(n.id))
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, maxVisible);
    setVisibleNotifications(unread);

    // Play sound for new notifications
    if (soundOn && notifications.length > 0) {
      const newest = notifications[0];
      if (!dismissedIds.has(newest.id)) {
        playNotificationSound();
      }
    }
  }, [notifications, dismissedIds, maxVisible, soundOn]);

  // Auto-dismiss timer
  useEffect(() => {
    const timers: Record<string, NodeJS.Timeout> = {};

    visibleNotifications.forEach((notification) => {
      if (!remainingTime[notification.id]) {
        remainingTime[notification.id] = autoCloseDelay;
      }

      timers[notification.id] = setInterval(() => {
        setRemainingTime((prev) => {
          const newTime = (prev[notification.id] || autoCloseDelay) - 100;
          if (newTime <= 0) {
            handleDismiss(notification.id);
            return prev;
          }
          return { ...prev, [notification.id]: newTime };
        });
      }, 100);
    });

    return () => {
      Object.values(timers).forEach(clearInterval);
    };
  }, [visibleNotifications, autoCloseDelay, remainingTime, handleDismiss]);

  const handleNotificationClick = useCallback(
    (notification: NotificationItem) => {
      onNotificationClick?.(notification);
      notification.onClick?.();
      handleDismiss(notification.id);
    },
    [onNotificationClick, handleDismiss]
  );

  const handleSoundToggle = useCallback(() => {
    const newState = !soundOn;
    setSoundOn(newState);
    onSoundToggle?.(newState);
  }, [soundOn, onSoundToggle]);

  const getPositionStyles = () => {
    switch (position) {
      case "top-left":
        return "top-4 left-4";
      case "bottom-right":
        return "bottom-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      default:
        return "top-4 right-4";
    }
  };

  const unreadCount = notifications.filter((n) => !dismissedIds.has(n.id)).length;

  return (
    <div className={`fixed ${getPositionStyles()} z-50 flex flex-col gap-2 w-96 max-w-[calc(100vw-2rem)]`}>
      {/* Header */}
      {visibleNotifications.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Bell className="w-5 h-5 text-gray-700" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900">Notifications</h3>
            </div>
            <div className="flex items-center gap-1">
              {showSoundToggle && (
                <button
                  onClick={handleSoundToggle}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  title={soundOn ? "Sound on" : "Sound off"}
                >
                  {soundOn ? (
                    <Volume2 className="w-4 h-4 text-gray-500" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              )}
              {onMarkAllRead && unreadCount > 0 && (
                <button
                  onClick={onMarkAllRead}
                  className="text-xs text-[#007BFF] hover:text-[#0056b3] px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Mark all read
                </button>
              )}
              {onClearAll && (
                <button
                  onClick={onClearAll}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Clear all"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Notification List */}
      <AnimatePresence mode="popLayout">
        {visibleNotifications.map((notification) => {
          const config = typeConfig[notification.type];
          const IconComponent = config.icon;
          const progress = ((remainingTime[notification.id] || autoCloseDelay) / autoCloseDelay) * 100;

          return (
            <motion.div
              key={notification.id}
              layout
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`relative overflow-hidden rounded-xl shadow-lg border ${config.borderColor} ${config.bgColor}`}
            >
              {/* Progress Bar */}
              <motion.div
                className={`absolute bottom-0 left-0 h-1 ${config.progressColor}`}
                initial={{ width: "100%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
              />

              <div className="p-4 cursor-pointer" onClick={() => handleNotificationClick(notification)}>
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm`}>
                    <IconComponent className={`w-5 h-5 ${config.iconColor}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`font-semibold text-gray-900 ${!notification.read ? "flex items-center gap-2" : ""}`}>
                        {notification.title}
                        {!notification.read && (
                          <span className="w-2 h-2 bg-[#007BFF] rounded-full" />
                        )}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.body}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(notification.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {/* Dismiss Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDismiss(notification.id);
                    }}
                    className="shrink-0 p-1 rounded-lg hover:bg-white/50 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* View All Link */}
      {notifications.length > maxVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-3"
        >
          <button
            onClick={() => {
              window.location.href = "/notifications";
            }}
            className="w-full flex items-center justify-between text-sm text-[#007BFF] hover:text-[#0056b3] transition-colors"
          >
            <span>
              View all {notifications.length - maxVisible} notifications
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default NotificationPopup;

