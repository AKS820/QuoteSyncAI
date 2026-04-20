import { useCallback } from 'react';

const USER_KEY = 'qs_user_id';

function getUserId() {
  let id = localStorage.getItem(USER_KEY);
  if (!id) {
    id = `anon_${Math.random().toString(36).slice(2)}_${Date.now()}`;
    localStorage.setItem(USER_KEY, id);
  }
  return id;
}

export function useEventTracking() {
  const trackEvent = useCallback(async (eventType, metadata = {}) => {
    try {
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: eventType,
          metadata,
          user_id: getUserId()
        })
      });
    } catch {
      // Non-critical — never surface tracking failures to users
    }
  }, []);

  return { trackEvent, getUserId };
}

export { getUserId };
