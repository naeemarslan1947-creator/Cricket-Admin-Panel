"use client";

import { useEffect, useState, useCallback } from "react";
import { messaging, getToken, VAPID_KEY } from "../lib/firebase/firebase";

const useFCMToken = (forceRegenerate = false) => {
    const [token, setToken] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null);

    const generateToken = useCallback(
        async () => {
            if (!messaging) {
                setError("Firebase messaging not initialized");
                return null;
            }

            setIsGenerating(true);
            setError(null);

            try {
                // Check for existing token
                const existingToken = localStorage.getItem("fcm_token");
                if (existingToken && !forceRegenerate) {
                    setToken(existingToken);
                    setIsGenerating(false);
                    return existingToken;
                }

                // Request notification permission
                const permission = await Notification.requestPermission();
                if (permission !== "granted") {
                    throw new Error("Notification permission denied");
                }

                // Wait for service worker to be ready
                const registration = await navigator.serviceWorker.ready;

                // Generate token
                const currentToken = await getToken(messaging, {
                    vapidKey: VAPID_KEY,
                    serviceWorkerRegistration: registration
                });

                if (currentToken) {
                    localStorage.setItem("fcm_token", currentToken);
                    setToken(currentToken);
                    setIsGenerating(false);
                    return currentToken;
                }

                setIsGenerating(false);
                return null;
            } catch (err) {
                setError(err.message);
                setIsGenerating(false);
                return null;
            }
        },
        [forceRegenerate]
    );

    useEffect(() => {
        generateToken();
    }, [generateToken]);

    return {
        token,
        isGenerating,
        error,
        regenerateToken: generateToken
    };
};

export default useFCMToken;

