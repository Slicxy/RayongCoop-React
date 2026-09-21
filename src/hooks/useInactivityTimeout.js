import { useState, useEffect, useRef, useCallback } from 'react';

const TOTAL_TIMEOUT_SECONDS = 20 * 60; // 20 minutes (1200s)
const WARNING_THRESHOLD_SECONDS = 2 * 60; // 2 minutes (120s remaining)

export function useInactivityTimeout({
  isLoggedIn,
  onTimeout,
  onLogout,
  timeoutSeconds = TOTAL_TIMEOUT_SECONDS,
  warningSeconds = WARNING_THRESHOLD_SECONDS
}) {
  const [showWarning, setShowWarning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(warningSeconds);

  const lastActivityTimeRef = useRef(Date.now());
  const checkIntervalRef = useRef(null);
  const showWarningRef = useRef(false);
  const onTimeoutRef = useRef(onTimeout);
  const onLogoutRef = useRef(onLogout);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  useEffect(() => {
    onLogoutRef.current = onLogout;
  }, [onLogout]);

  useEffect(() => {
    showWarningRef.current = showWarning;
  }, [showWarning]);

  // Extend session / reset activity timestamp
  const extendSession = useCallback(() => {
    lastActivityTimeRef.current = Date.now();
    showWarningRef.current = false;
    setShowWarning(false);
    setRemainingSeconds(warningSeconds);
  }, [warningSeconds]);

  // Activity handler with throttle
  const handleActivity = useCallback(() => {
    // If warning modal is open, don't silently dismiss via background mousemove; require button click
    if (!showWarningRef.current) {
      lastActivityTimeRef.current = Date.now();
    }
  }, []);

  const logoutNow = useCallback(() => {
    setShowWarning(false);
    onLogoutRef.current?.();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setShowWarning(false);
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
      return;
    }

    lastActivityTimeRef.current = Date.now();

    // Attach user activity listeners
    const events = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'pointerdown', 'scroll', 'visibilitychange'];
    const throttledHandler = () => handleActivity();

    events.forEach((ev) => {
      window.addEventListener(ev, throttledHandler, { passive: true });
    });

    // Check interval every second
    checkIntervalRef.current = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - lastActivityTimeRef.current) / 1000);
      const secondsLeft = timeoutSeconds - elapsedSeconds;

      if (secondsLeft <= 0) {
        // Inactivity timeout reached!
        setShowWarning(false);
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
        onTimeoutRef.current?.();
      } else if (secondsLeft <= warningSeconds) {
        // Show warning countdown
        setShowWarning(true);
        setRemainingSeconds(secondsLeft);
      } else {
        setShowWarning(false);
      }
    }, 1000);

    return () => {
      events.forEach((ev) => {
        window.removeEventListener(ev, throttledHandler);
      });
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
    };
  }, [isLoggedIn, timeoutSeconds, warningSeconds, handleActivity]);

  return {
    showWarning,
    remainingSeconds,
    extendSession,
    logoutNow
  };
}
