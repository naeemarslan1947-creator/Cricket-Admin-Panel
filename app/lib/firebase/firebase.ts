// lib/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getMessaging, onMessage, getToken, Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAPX8mBKG_EpOefuQj60Nz7wS39pV1U-Fk",
  authDomain: "crcikitt.firebaseapp.com",
  projectId: "crcikitt",
  storageBucket: "crcikitt.firebasestorage.app",
  messagingSenderId: "739889555986",
  appId: "1:739889555986:web:5a7a7f4df45f24289d06cb",
  measurementId: "G-96HEKY62FZ"
};

// VAPID Key for web push notifications - must match Firebase Console configuration
const VAPID_KEY = "BHg5TsP5z80Y5llgpCcDwIDpPw_7jCTlAFYsGX5c64xa2vkA0GCrJMjnXycB0nVFegt_Eel3YMA4N0iGZb9h0KU";

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

let messaging: Messaging | undefined;

// Service worker registration reference for FCM
let serviceWorkerRegistration: ServiceWorkerRegistration | null = null;

if (typeof window !== "undefined" && "Notification" in window) {
  try {
    messaging = getMessaging(app);
    console.log("Firebase Messaging initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase Messaging:", error);
  }

  // Register service worker safely
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
        console.log("Service Worker registered successfully:", registration.scope);
        serviceWorkerRegistration = registration;
      })
      .catch((err) => {
        console.error("Service Worker registration failed:", err);
      });
  } else {
    console.warn("ServiceWorker is not supported in this browser");
  }
} else {
  console.warn(
    "Window or Notification API not available - running in SSR or unsupported browser"
  );
}

/**
 * Clears the cached FCM token from localStorage
 * Call this when token is invalid to force regeneration
 */
export const clearFCMToken = (): void => {
  localStorage.removeItem("fcm_token");
  console.log("FCM: Cleared cached token");
};

/**
 * Gets a fresh FCM token, bypassing any cached tokens
 * Use this when you need to ensure a valid token
 */
export const getFreshFCMToken = async (): Promise<string | null> => {
  // Always clear cached token for fresh token request
  localStorage.removeItem("fcm_token");
  return getFCMToken(true);
};

// Function to get FCM token - can be called from login page
// forceRefresh: if true, will always get a new token instead of using cached one
export const getFCMToken = async (forceRefresh = false): Promise<string | null> => {
  if (!messaging) {
    console.warn("FCM: Messaging not initialized");
    return null;
  }

  try {
    // Check for existing token first (only if not forcing refresh)
    const existingToken = localStorage.getItem("fcm_token");
    if (existingToken && !forceRefresh) {
      console.log("FCM: Using existing token from storage");
      // Validate token by making a test request
      const isValid = await validateToken(existingToken);
      if (isValid) {
        return existingToken;
      } else {
        console.log("FCM: Cached token is invalid, clearing and regenerating");
        localStorage.removeItem("fcm_token");
      }
    }

    console.log("FCM: Requesting notification permission...");
    // Request notification permission
    const permission = await Notification.requestPermission();
    console.log("FCM: Notification permission:", permission);
    if (permission !== "granted") {
      console.warn("FCM: Notification permission denied");
      return null;
    }

    // Wait for service worker to be ready
    console.log("FCM: Waiting for service worker to be ready...");
    
    // Try to get the already registered service worker first
    let registration = serviceWorkerRegistration;
    
    if (!registration) {
      // If not registered yet, try to get it from navigator
      const registrations = await navigator.serviceWorker.getRegistrations();
      if (registrations.length > 0) {
        registration = registrations[0];
      }
    }
    
    if (!registration) {
      // Register a new one if none exists
      registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
      console.log("FCM: Service Worker registered on demand:", registration.scope);
    }
    
    // Wait for the service worker to be ready
    const readyRegistration = await navigator.serviceWorker.ready;
    console.log("FCM: Service worker ready:", !!readyRegistration);

    // Get new token with additional options
    console.log("FCM: Getting token with VAPID key...");
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: readyRegistration
    });

    console.log("FCM: Token generated:", token ? token.substring(0, 50) + "..." : "null");

    if (token) {
      localStorage.setItem("fcm_token", token);
      console.log("FCM: Token saved to localStorage");
      return token;
    }

    return null;
  } catch (error: unknown) {
    console.error("FCM: Error getting token:", error);
    
    // Handle specific FCM errors
    const errorWithCode = error as { code?: string };
    if (errorWithCode.code === 'messaging/unsupported-browser') {
      console.error("FCM: Browser doesn't support push notifications");
    } else if (errorWithCode.code === 'messaging/permission-blocked') {
      console.error("FCM: Notification permission was blocked");
    } else if (errorWithCode.code === 'messaging/invalid-vapid-key') {
      console.error("FCM: VAPID key is invalid. Please check Firebase Console configuration.");
    } else if (errorWithCode.code === 'messaging/server-unavailable') {
      console.error("FCM: FCM server is unavailable. Try again later.");
    }
    
    return null;
  }
};

/**
 * Validates if a token is still valid by checking its format
 * Note: This is a basic format validation. Full validation requires server-side check.
 */
const validateToken = async (token: string): Promise<boolean> => {
  if (!token || typeof token !== 'string') {
    return false;
  }
  
  // FCM tokens are typically 140-152 characters for legacy FCM or longer for VAPID-based tokens
  // VAPID-based tokens are usually longer (around 200+ characters)
  const minLength = 100;
  const maxLength = 500;
  
  if (token.length < minLength || token.length > maxLength) {
    console.log("FCM: Token length validation failed:", token.length);
    return false;
  }
  
  // Token should only contain base64url characters (alphanumeric, underscore, hyphen)
  const tokenPattern = /^[A-Za-z0-9_-]+$/;
  if (!tokenPattern.test(token)) {
    console.log("FCM: Token format validation failed");
    return false;
  }
  
  return true;
};

// Export FCM token getter for use in login
export { messaging, onMessage, getToken, VAPID_KEY };
