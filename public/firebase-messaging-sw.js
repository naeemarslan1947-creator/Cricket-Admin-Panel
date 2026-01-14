// Firebase Cloud Messaging Service Worker
// This service worker handles background push notifications

// Firebase configuration - must match app/lib/firebase/firebase.ts
const firebaseConfig = {
    apiKey: "AIzaSyAPX8mBKG_EpOefuQj60Nz7wS39pV1U-Fk",
    authDomain: "crcikitt.firebaseapp.com",
    projectId: "crcikitt",
    storageBucket: "crcikitt.firebasestorage.app",
    messagingSenderId: "739889555986",
    appId: "1:739889555986:web:5a7a7f4df45f24289d06cb",
    measurementId: "G-96HEKY62FZ"
};

// Import and initialize Firebase
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message:', payload);

    // Extract notification data
    const notificationTitle = payload.notification?.title || 'New Notification';
    const notificationBody = payload.notification?.body || '';
    const notificationImage = payload.notification?.image || '';

    // Extract data payload
    const dataPayload = payload.data || {};
    const clickAction = dataPayload.click_action || dataPayload.url || '/notifications';
    const tag = dataPayload.tag || payload.messageId || 'default-notification';

    const notificationOptions = {
        body: notificationBody,
        icon: '/image/notification-icon.png',
        badge: '/image/badge-icon.png',
        image: notificationImage || '',
        vibrate: [200, 100, 200],
        tag: tag,
        renotify: true,
        data: {
            ...dataPayload,
            messageId: payload.messageId,
        },
        actions: [
            {
                action: 'view',
                title: 'View',
                icon: '/image/view-icon.png'
            },
            {
                action: 'dismiss',
                title: 'Dismiss',
                icon: '/image/dismiss-icon.png'
            }
        ],
        requireInteraction: true,
        silent: false
    };

    console.log('[firebase-messaging-sw.js] Showing notification:', notificationTitle);
    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click events
self.addEventListener('notificationclick', function (event) {
    console.log('[firebase-messaging-sw.js] Notification click:', event.action);
    console.log('[firebase-messaging-sw.js] Notification data:', event.notification.data);

    event.notification.close();

    if (event.action === 'dismiss') {
        return;
    }

    // Default action - open notifications page
    const notificationData = event.notification.data || {};
    const targetUrl = notificationData.url || notificationData.click_action || '/notifications';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
            // Check if there's already a window open
            for (const client of clientList) {
                // Focus on the first window that matches the URL pattern
                if (client.url.includes('/notifications') && 'focus' in client) {
                    return client.focus();
                }
                // Focus on dashboard if it's already open
                if (client.url.includes('/dashboard') && 'focus' in client) {
                    return client.focus();
                }
                // Focus on the admin panel if it's open
                if (client.url.includes('/admin') && 'focus' in client) {
                    return client.focus();
                }
            }

            // Open a new window if none exists
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});

// Handle service worker installation
self.addEventListener('install', function (event) {
    console.log('[firebase-messaging-sw.js] Service Worker installing');
    self.skipWaiting();
});

// Handle service worker activation
self.addEventListener('activate', function (event) {
    console.log('[firebase-messaging-sw.js] Service Worker activated');
    event.waitUntil(clients.claim());
});

// Handle push event directly for additional logging
self.addEventListener('push', function (event) {
    console.log('[firebase-messaging-sw.js] Push event received:', event);

    if (event.data) {
        const data = event.data.json();
        console.log('[firebase-messaging-sw.js] Push data:', JSON.stringify(data, null, 2));
    }
});

